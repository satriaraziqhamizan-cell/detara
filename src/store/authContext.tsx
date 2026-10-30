import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  getUserProfile,
  loginWithIdAndPassword,
  registerWarga,
  deleteUserAccount,
  UserProfile
} from '../services/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export type AuthMode = 'demo' | 'warga' | 'petugas' | null;

interface AuthContextType {
  authMode: AuthMode;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  loginTargetRole: 'warga' | 'petugas';
  openLoginModal: (role: 'warga' | 'petugas') => void;
  closeLoginModal: () => void;
  startDemoMode: () => void;
  login: (id: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    identifier: string;
    password: string;
    name: string;
    phone: string;
    village: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    // Check if session had demo or previous state
    const saved = sessionStorage.getItem('detara_auth_mode');
    return (saved as AuthMode) || null;
  });
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginTargetRole, setLoginTargetRole] = useState<'warga' | 'petugas'>('warga');

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const p = await getUserProfile(firebaseUser.uid);
          if (p) {
            setProfile(p);
            setAuthMode(p.role);
            sessionStorage.setItem('detara_auth_mode', p.role);
          } else {
            // Role is strictly read from Firestore; if document does not exist, treat as warga
            setAuthMode('warga');
            sessionStorage.setItem('detara_auth_mode', 'warga');
          }
        } catch (err) {
          console.warn('Error reading user profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
        // Only keep demo if in demo mode
        const saved = sessionStorage.getItem('detara_auth_mode');
        if (saved !== 'demo') {
          setAuthMode(null);
          sessionStorage.removeItem('detara_auth_mode');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openLoginModal = (role: 'warga' | 'petugas') => {
    setLoginTargetRole(role);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const startDemoMode = () => {
    setAuthMode('demo');
    sessionStorage.setItem('detara_auth_mode', 'demo');
    setIsLoginModalOpen(false);
  };

  const login = async (id: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await loginWithIdAndPassword(id, pass);
      setUser(res.user);
      setProfile(res.profile);
      setAuthMode(res.profile.role);
      sessionStorage.setItem('detara_auth_mode', res.profile.role);
      setIsLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      let errMsg = 'ID atau kata sandi tidak sesuai.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errMsg = 'ID atau kata sandi salah. Silakan periksa kembali.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'Akun belum terdaftar. Silakan daftar terlebih dahulu.';
      } else if (err.code === 'auth/network-request-failed') {
        errMsg = 'Gagal terhubung ke jaringan. Periksa koneksi internet Anda.';
      } else if (err.message) {
        errMsg = err.message;
      }
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    identifier: string;
    password: string;
    name: string;
    phone: string;
    village: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const newProfile = await registerWarga(data);
      setProfile(newProfile);
      setAuthMode('warga');
      sessionStorage.setItem('detara_auth_mode', 'warga');
      setIsLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      let errMsg = 'Gagal mendaftar akun warga.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'ID/Nomor ini sudah terdaftar. Silakan langsung masuk.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Kata sandi minimal 6 karakter.';
      } else if (err.message) {
        errMsg = err.message;
      }
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setAuthMode(null);
    sessionStorage.removeItem('detara_auth_mode');
    setIsLoading(false);
  };

  const deleteAccount = async () => {
    if (!user) return;
    setIsLoading(true);
    await deleteUserAccount(user.uid);
    setUser(null);
    setProfile(null);
    setAuthMode(null);
    sessionStorage.removeItem('detara_auth_mode');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authMode,
        user,
        profile,
        isLoading,
        isLoginModalOpen,
        loginTargetRole,
        openLoginModal,
        closeLoginModal,
        startDemoMode,
        login,
        register,
        logout,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
