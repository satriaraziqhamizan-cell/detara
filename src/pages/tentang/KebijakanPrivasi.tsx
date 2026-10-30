import React, { useState } from 'react';
import { useAuth } from '../../store/authContext';
import { useApp } from '../../store/appContext';
import {
  ShieldCheck,
  Lock,
  Trash2,
  AlertTriangle,
  UserCheck,
  MapPin,
  Camera,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface KebijakanPrivasiProps {
  onBack?: () => void;
}

export const KebijakanPrivasi: React.FC<KebijakanPrivasiProps> = ({ onBack }) => {
  const { user, profile, deleteAccount } = useAuth();
  const { showToast } = useApp();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      showToast('Akun dan seluruh data profil Anda telah berhasil dihapus.');
      if (onBack) onBack();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus akun.');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 pb-24 text-slate-800 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center transition border border-slate-200"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <span>Kebijakan Privasi & Perlindungan Data DETARA</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Transparansi pengelolaan data untuk peringatan dini karhutla di Provinsi Jambi
          </p>
        </div>
      </div>

      {/* 1. Data yang Disimpan */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-700" />
          <span>1. Data Apa Saja yang Kami Simpan?</span>
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Dalam operasional sistem peringatan dini karhutla, DETARA hanya mengumpulkan data yang relevan secara fungsional:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-base block text-slate-900">Identitas Akun Warga</span>
            <span className="text-sm text-slate-500 mt-1 block">
              Nama lengkap, nomor WhatsApp/HP, dan nama desa domisili saat mendaftar.
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-base block text-slate-900">Lokasi & Koordinat GPS Laporan</span>
            <span className="text-sm text-slate-500 mt-1 block">
              Titik koordinat lintang/bujur lokasi temuan asap/api yang disetujui warga sebelum dikirim.
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-base block text-slate-900">Foto Bukti Lapangan</span>
            <span className="text-sm text-slate-500 mt-1 block">
              Foto dokumentasi kondisi gambut atau api (dikompres otomatis di perangkat pengguna).
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-base block text-slate-900">Catatan & Kondisi</span>
            <span className="text-sm text-slate-500 mt-1 block">
              Status temuan (Aman / Asap / Api) serta rincian keterangan lokasi kejadian.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tujuan Penggunaan */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700" />
          <span>2. Tujuan Pengumpulan Data</span>
        </h2>
        <ul className="list-disc list-inside space-y-2 text-base text-slate-600 leading-relaxed">
          <li>
            <strong>Verifikasi Silang Laporan (Groundcheck):</strong> Mengonfirmasi deteksi anomali sensor IoT dan hotspot satelit dengan kondisi faktual di lapangan.
          </li>
          <li>
            <strong>Penerbitan Tugas Patroli Cepat:</strong> Membantu Posko Induk Manggala Agni dan BPBD mengarahkan regu pemadam ke koordinat akurat.
          </li>
          <li>
            <strong>Siaran Peringatan Dini:</strong> Mengirimkan notifikasi bahaya asap atau kebakaran ke nomor kontak warga di desa terdampak.
          </li>
          <li>
            <strong>Pencegahan Informasi Palsu:</strong> Memastikan setiap laporan dapat dipertanggungjawabkan melalui akun terverifikasi.
          </li>
        </ul>
      </div>

      {/* 3. Keamanan & Pembatasan Peran */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-700" />
          <span>3. Keamanan Data & Pembatasan Akses (RBAC)</span>
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Seluruh data disimpan pada infrastruktur cloud terenkripsi menggunakan Firestore Security Rules:
        </p>
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 space-y-1.5">
          <p>
            • <strong>Warga:</strong> Hanya dapat membaca dan mengelola data profil serta laporan yang dibuat oleh dirinya sendiri.
          </p>
          <p>
            • <strong>Petugas:</strong> Hanya petugas berizin resmi yang dapat melihat agregat laporan wilayah untuk keperluan penanganan darurat karhutla.
          </p>
          <p>
            • <strong>Mode Demo:</strong> Berjalan sepenuhnya pada memori simulasi dan sama sekali tidak menulis ke database cloud atau melacak data pengguna.
          </p>
        </div>
      </div>

      {/* 4. Hak Menghapus Akun & Data */}
      <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-red-600 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          <span>4. Prosedur & Hak Penghapusan Akun</span>
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Setiap warga memiliki hak penuh untuk meminta penghapusan akun dan data pribadi kapan saja. Saat akun dihapus, dokumen profil Anda akan dihapus secara permanen dari basis data.
        </p>

        {user && profile?.role === 'warga' ? (
          <div className="pt-2">
            {!showConfirmDelete ? (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded-xl font-bold text-base transition flex items-center gap-2 min-h-[46px]"
              >
                <Trash2 className="w-5 h-5" />
                <span>Hapus Akun Saya ({profile.name})</span>
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-xl border border-red-300 space-y-3">
                <p className="text-sm font-semibold text-red-900">
                  Apakah Anda yakin ingin menghapus akun ini secara permanen? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-base min-h-[44px] transition"
                  >
                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-semibold text-base min-h-[44px] transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Masuk dengan akun Warga Anda untuk mengakses tombol penghapusan akun mandiri.
          </p>
        )}
      </div>
    </div>
  );
};
