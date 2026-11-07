import React from 'react';
import { useApp } from '../../store/appContext';
import { useAuth } from '../../store/authContext';
import {
  UserCheck,
  Shield,
  PlayCircle,
  Info,
  QrCode,
  FileText
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setMode, setIsQRModalOpen } = useApp();
  const { startDemoMode, openLoginModal } = useAuth();

  const handleStartDemo = () => {
    startDemoMode();
    setMode('warga');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between p-6">
      {/* Top minimal status indicator */}
      <div className="max-w-[420px] mx-auto w-full flex items-center justify-between text-[13px] text-slate-500 pt-2 pb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>ThinkLab 2026 · Provinsi Jambi</span>
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
          Data simulasi
        </span>
      </div>

      {/* Main Center Content */}
      <div className="max-w-[420px] mx-auto w-full text-center space-y-6 my-auto py-8">
        {/* Logo DETARA */}
        <img src="/logo.png" alt="Logo DETARA" className="w-24 h-24 mx-auto object-contain mix-blend-multiply" />

        {/* Nama & Tagline */}
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-none">
            DETARA
          </h1>
          <p className="text-[15px] text-slate-600 font-normal">
            Peringatan dini karhutla untuk Jambi
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {/* Tombol Utama Hijau: Coba Demo */}
          <button
            onClick={handleStartDemo}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[15px] transition flex items-center justify-center gap-2 min-h-[46px]"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Coba Demo</span>
          </button>

          {/* Dua tombol outline: Masuk Warga & Masuk Petugas */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => openLoginModal('warga')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[15px] border border-slate-300 transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Masuk Warga</span>
            </button>

            <button
              onClick={() => openLoginModal('petugas')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[15px] border border-slate-300 transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Shield className="w-4 h-4 text-slate-700" />
              <span>Masuk Petugas</span>
            </button>
          </div>
        </div>

        {/* Tautan kecil: Tentang, Kebijakan Privasi, Scan QR */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-slate-500 pt-4 border-t border-slate-100">
          <button
            onClick={() => setMode('tentang')}
            className="hover:text-emerald-700 transition flex items-center gap-1 min-h-[44px] px-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Tentang</span>
          </button>
          <span>·</span>
          <button
            onClick={() => setMode('tentang')}
            className="hover:text-emerald-700 transition flex items-center gap-1 min-h-[44px] px-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Kebijakan Privasi</span>
          </button>
          <span>·</span>
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="hover:text-emerald-700 transition flex items-center gap-1 min-h-[44px] px-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-[420px] mx-auto w-full text-center text-[13px] text-slate-400 py-2">
        ThinkLab Coding Competition 2026 – HIMASI UNJA
      </div>
    </div>
  );
};
