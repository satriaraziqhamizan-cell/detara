import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import {
  X,
  Shield,
  User,
  KeyRound,
  Phone,
  Home,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  onOpenPrivacyPolicy?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenPrivacyPolicy }) => {
  const {
    isLoginModalOpen,
    loginTargetRole,
    closeLoginModal,
    login,
    register,
    isLoading
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('Dendang');
  const [agreedPrivacy, setAgreedPrivacy] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoginModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const isPetugas = loginTargetRole === 'petugas';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!identifier.trim() || !password) {
      setErrorMessage('Harap isi ID dan kata sandi.');
      return;
    }

    const res = await login(identifier, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Gagal masuk. Periksa kembali ID dan kata sandi Anda.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password || !name.trim() || !phone.trim() || !village) {
      setErrorMessage('Harap lengkapi seluruh kolom pendaftaran.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.');
      return;
    }

    if (!agreedPrivacy) {
      setErrorMessage('Harap setujui Kebijakan Privasi terlebih dahulu.');
      return;
    }

    const res = await register({
      identifier,
      password,
      name,
      phone,
      village
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal mendaftar.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/30 p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={closeLoginModal}
    >
      <div
        className="w-full max-w-[420px] rounded-xl bg-white border border-slate-200 text-slate-800 shadow-lg overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${
                isPetugas ? 'bg-slate-800' : 'bg-emerald-700'
              }`}
            >
              {isPetugas ? <Shield className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-slate-900 leading-tight">
                {isPetugas ? 'Masuk Petugas' : 'Masuk Warga'}
              </h3>
              <p className="text-[13px] text-slate-500">
                {isPetugas
                  ? 'Command Center Karhutla Jambi'
                  : 'Sistem Laporan Partisipatif'}
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs for Warga (Login vs Daftar) or Notice for Petugas */}
        {!isPetugas ? (
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 gap-1 text-[14px]">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg font-bold transition min-h-[44px] ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg font-bold transition min-h-[44px] ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-[13px] text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Pendaftaran Terbatas:</span>
              <span>Akun Petugas hanya diterbitkan oleh Admin Posko. Tidak tersedia pendaftaran mandiri.</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[13px] text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4">
          {activeTab === 'login' || isPetugas ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                  ID Pengguna
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isPetugas ? 'ID petugas Anda' : 'Contoh: budi.desa'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 min-h-[44px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-[15px] text-white transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px] ${
                  isPetugas
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                    Desa / Kelurahan
                  </label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 min-h-[44px]"
                  >
                    <option value="Dendang">Dendang</option>
                    <option value="Betara">Betara</option>
                    <option value="Kumpeh Ulu">Kumpeh Ulu</option>
                    <option value="Muara Sabak">Muara Sabak</option>
                    <option value="Lainnya">Wilayah Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                  ID Pengguna (Username atau Email)
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: budi.desa"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-700 block mb-1">
                  Kata Sandi (Minimal 8 karakter)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-[15px] focus:outline-none focus:border-emerald-700 min-h-[44px]"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[13px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 text-emerald-700 focus:ring-emerald-700 shrink-0"
                  />
                  <span>
                    Saya menyetujui penyimpanan nama, nomor HP, dan desa sesuai{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacyPolicy}
                      className="text-emerald-700 font-bold underline"
                    >
                      Kebijakan Privasi
                    </button>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg font-bold text-[15px] text-white bg-emerald-700 hover:bg-emerald-800 transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px] mt-2"
              >
                <span>{isLoading ? 'Mendaftarkan...' : 'Daftar Akun Warga'}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
