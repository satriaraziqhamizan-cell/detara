import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './store/authContext';
import { AppProvider, useApp } from './store/appContext';
import { Navbar } from './components/common/Navbar';
import { ScenarioControlBar } from './components/common/ScenarioControlBar';
import { QRCodeModal } from './components/common/QRCodeModal';
import { AuthModal } from './components/auth/AuthModal';
import { WargaLayout } from './pages/warga/WargaLayout';
import { PetugasLayout } from './pages/petugas/PetugasLayout';
import { WelcomeScreen } from './pages/welcome/WelcomeScreen';
import { TentangScreen } from './pages/tentang/TentangScreen';

const AppContent: React.FC = () => {
  const { mode, setMode, activeToast, isQRModalOpen, setIsQRModalOpen, showToast } = useApp();
  const { authMode, openLoginModal } = useAuth();

  // Strict Petugas Route Guard (Point 3: Warga cannot access Petugas pages even via direct state)
  useEffect(() => {
    if (mode === 'petugas' && authMode === 'warga') {
      showToast('Akses dibatasi: Halaman Petugas hanya untuk akun resmi Petugas.');
      setMode('warga');
    }
  }, [mode, authMode, setMode, showToast]);

  const handleOpenPrivacyFromModal = () => {
    setMode('tentang');
  };

  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden box-border">
        <WelcomeScreen />
        <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
        <AuthModal onOpenPrivacyPolicy={handleOpenPrivacyFromModal} />
        {activeToast && (
          <div className="fixed bottom-6 right-4 z-50 max-w-sm bg-white text-slate-800 p-3.5 rounded-xl shadow-xl border border-slate-200 text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
            <span className="flex-1 leading-snug font-medium">{activeToast}</span>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'tentang') {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden box-border">
        <ScenarioControlBar />
        <Navbar />
        <TentangScreen />
        <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
        <AuthModal onOpenPrivacyPolicy={handleOpenPrivacyFromModal} />
        {activeToast && (
          <div className="fixed bottom-6 right-4 z-50 max-w-sm bg-white text-slate-800 p-3.5 rounded-xl shadow-xl border border-slate-200 text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
            <span className="flex-1 leading-snug font-medium">{activeToast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden box-border">
      {/* 1. Global Scenario Demo Control Bar */}
      <ScenarioControlBar />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Main Dual View Content: DETARA Warga vs Command Center Petugas */}
      <div className="flex-1">
        {mode === 'warga' ? (
          <WargaLayout />
        ) : authMode === 'warga' ? (
          <WargaLayout />
        ) : (
          <PetugasLayout />
        )}
      </div>

      {/* 4. Interactive QR Modal for Jury Phone Scan */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      {/* 5. Auth Modal for Login & Registration */}
      <AuthModal onOpenPrivacyPolicy={handleOpenPrivacyFromModal} />

      {/* 6. Non-intrusive Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm bg-white text-slate-800 p-3.5 rounded-xl shadow-xl border border-slate-200 text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
          <span className="flex-1 leading-snug font-medium">{activeToast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
