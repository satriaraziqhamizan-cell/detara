import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { useAuth } from '../../store/authContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  QrCode,
  LogOut,
  User,
  Shield,
  Lock,
  MoreVertical,
  Home,
  Info,
  Smartphone,
  LayoutDashboard,
  Sliders,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { mode, setMode, setIsQRModalOpen, setIsDemoSheetOpen, showToast } = useApp();
  const { authMode, profile, logout, openLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handlePetugasTabClick = () => {
    if (authMode === 'warga') {
      showToast('Akses dibatasi: Halaman Petugas hanya untuk akun resmi Petugas.');
      return;
    }
    setMode('petugas');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMode('welcome');
    setIsMobileMenuOpen(false);
    showToast('Anda telah keluar.');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Mobile Top Navigation (Screens < md): Single 56px Header (Item 14) */}
      <div className="md:hidden px-3.5 h-14 flex items-center justify-between gap-2">
        {/* Left: Logo + DETARA */}
        <div className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Logo DETARA" className="w-9 h-9 object-contain mix-blend-multiply" />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setMode('welcome');
            }}
            className="text-[17px] font-bold tracking-tight text-slate-900"
          >
            DETARA
          </a>
        </div>

        {/* Center / Right: Small chip "Data simulasi" */}
        <div className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[12px] font-medium shrink-0">
          Data simulasi
        </div>

        {/* Right: Single menu button (titik tiga) */}
        <div className="relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menu Aplikasi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-slate-600/25"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-2 text-[14px] text-slate-700 animate-in fade-in duration-100">
                {/* User status */}
                <div className="px-3 py-1.5 border-b border-slate-100 text-[13px] text-slate-500">
                  Status:{' '}
                  <strong className="text-slate-800">
                    {authMode === 'demo' ? 'Mode Demo' : profile?.name || 'Warga'}
                  </strong>
                </div>

                <button
                  onClick={() => {
                    setMode('welcome');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 min-h-[44px]"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Layar Awal</span>
                </button>

                {authMode !== 'warga' && (
                  <button
                    onClick={handlePetugasTabClick}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Mode Petugas</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsQRModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 min-h-[44px]"
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Scan QR di HP Juri</span>
                </button>

                <button
                  onClick={() => {
                    setIsDemoSheetOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 min-h-[44px]"
                >
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span>Panel Demo</span>
                </button>

                <button
                  onClick={() => {
                    setMode('tentang');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 min-h-[44px]"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>Tentang & Privasi</span>
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <div className="px-3.5 py-1">
                    <PWAInstallButton compact={false} />
                  </div>
                </div>

                {authMode && (
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3.5 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 min-h-[44px] font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Navigation (Screens >= md) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 h-14 items-center justify-between gap-6">
        {/* Zone 1: Logo & Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="Logo DETARA" className="w-9 h-9 object-contain mix-blend-multiply" />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setMode('welcome');
            }}
            className="text-[18px] font-bold tracking-tight text-slate-900"
          >
            DETARA
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => setMode('welcome')}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition min-h-[36px] ${
              mode === 'welcome'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Layar Awal
          </button>

          <button
            onClick={() => setMode('warga')}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition min-h-[36px] ${
              mode === 'warga'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Warga
          </button>

          <button
            onClick={handlePetugasTabClick}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition flex items-center gap-1 min-h-[36px] ${
              mode === 'petugas'
                ? 'bg-slate-800 text-white font-bold'
                : authMode === 'warga'
                ? 'text-slate-400 cursor-not-allowed opacity-60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={authMode === 'warga' ? 'Dibatasi untuk Petugas' : 'Command Center'}
          >
            {authMode === 'warga' && <Lock className="w-3.5 h-3.5" />}
            <span>Petugas</span>
          </button>

          <button
            onClick={() => setMode('tentang')}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition min-h-[36px] ${
              mode === 'tentang'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Tentang & Privasi
          </button>
        </nav>

        {/* Zone 3: Account info & actions */}
        <div className="flex items-center gap-2 shrink-0">
          {authMode ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-[13px]">
              <span className="text-slate-700">
                {authMode === 'demo' ? 'Mode Demo' : profile?.name || 'Terhubung'}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-bold text-[12px] ml-1"
                title="Keluar"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => openLoginModal('warga')}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 transition min-h-[36px] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition min-h-[36px]"
            title="Scan QR di HP Juri"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>Scan QR</span>
          </button>

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
