import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CitizenReport } from '../types';

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initial connection pending.');
    }
  }
}
testConnection();

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  village?: string;
  role: 'warga' | 'petugas';
  createdAt: string;
}

// Helper to convert plain ID to email format for Firebase Auth if not already an email
export function normalizeIdToEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (clean.includes('@')) {
    return clean;
  }
  // Remove non-alphanumeric chars except dots, underscores, dashes
  const safeId = clean.replace(/[^a-z0-9._-]/g, '');
  return `${safeId || 'user'}@detara.local`;
}

/**
 * Register a new citizen (Warga)
 */
export async function registerWarga(data: {
  identifier: string;
  password: string;
  name: string;
  phone: string;
  village: string;
}): Promise<UserProfile> {
  if (!data.password || data.password.length < 8) {
    throw new Error('Kata sandi minimal 8 karakter.');
  }

  const email = normalizeIdToEmail(data.identifier);
  const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
  const uid = userCredential.user.uid;

  const profile: UserProfile = {
    id: uid,
    name: data.name,
    phone: data.phone,
    village: data.village,
    role: 'warga',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', uid), profile);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
  }

  return profile;
}

/**
 * Login for Warga or Petugas. Role is strictly read from users/{uid}.role in Firestore.
 */
export async function loginWithIdAndPassword(
  identifier: string,
  password: string
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  const email = normalizeIdToEmail(identifier);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  let profile: UserProfile | null = null;

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      profile = userDoc.data() as UserProfile;
    } else {
      // Document does not exist; treat as warga and never assign or write role petugas from client
      profile = {
        id: uid,
        name: email.split('@')[0],
        role: 'warga',
        createdAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }

  return { user: userCredential.user, profile: profile! };
}

/**
 * Fetch current user profile
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }
}

/**
 * Delete citizen account per Privacy Policy
 */
export async function deleteUserAccount(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid));
    if (auth.currentUser && auth.currentUser.uid === uid) {
      await auth.currentUser.delete();
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
  }
}

/**
 * Save report to Firestore
 */
export async function saveReportToFirestore(
  report: CitizenReport,
  userId: string,
  userName?: string,
  userPhone?: string
): Promise<void> {
  const payload = {
    id: report.id,
    userId,
    userName: userName || 'Warga Terdaftar',
    userPhone: userPhone || '',
    zoneId: report.zoneId,
    zoneName: report.zoneName,
    condition: report.condition,
    reporterType: report.reporterType,
    notes: report.notes,
    photoUrl: report.photoUrl || '',
    status: report.status,
    coordinates: report.coordinates,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'reports', report.id), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `reports/${report.id}`);
  }
}

/**
 * Fetch reports from Firestore based on role
 */
export async function fetchReportsFromFirestore(
  role: 'warga' | 'petugas',
  userId: string
): Promise<CitizenReport[]> {
  try {
    const reportsRef = collection(db, 'reports');
    let q;
    if (role === 'warga') {
      q = query(reportsRef, where('userId', '==', userId));
    } else {
      q = query(reportsRef);
    }

    const snapshot = await getDocs(q);
    const results: CitizenReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: data.id || docSnap.id,
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Terkirim',
        zoneId: data.zoneId,
        zoneName: data.zoneName,
        condition: data.condition,
        reporterType: data.reporterType || 'Warga',
        notes: data.notes || '',
        photoUrl: data.photoUrl || undefined,
        status: data.status || 'Terkirim',
        coordinates: data.coordinates || { x: 50, y: 50, lat: -1.6, lng: 103.6 },
        syncStatus: 'synced',
      });
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'reports');
  }
}

/**
 * Petugas: Update report status
 */
export async function updateReportStatusInFirestore(
  reportId: string,
  newStatus: CitizenReport['status'],
  verifiedBy: string,
  verificationNotes?: string
): Promise<void> {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      verifiedBy,
      verificationNotes: verificationNotes || '',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `reports/${reportId}`);
  }
}
