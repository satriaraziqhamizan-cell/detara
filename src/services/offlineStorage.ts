import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CitizenReport } from '../types';

interface DetaraDB extends DBSchema {
  offline_reports: {
    key: string;
    value: CitizenReport;
  };
}

const DB_NAME = 'detara_offline_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<DetaraDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<DetaraDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline_reports')) {
          db.createObjectStore('offline_reports', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveOfflineReport(report: CitizenReport): Promise<void> {
  const db = await getDB();
  await db.put('offline_reports', report);
}

export async function getAllOfflineReports(): Promise<CitizenReport[]> {
  const db = await getDB();
  return db.getAll('offline_reports');
}

export async function deleteOfflineReport(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('offline_reports', id);
}

export async function clearAllOfflineReports(): Promise<void> {
  const db = await getDB();
  await db.clear('offline_reports');
}

/**
 * Compresses an image file or DataURL to max 800px width/height and JPEG 0.7 quality
 */
export async function compressImage(fileOrDataUrl: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const maxDim = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      console.warn('Image compression fallback:', err);
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(err);
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
