import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/appContext';
import { useAuth } from '../../store/authContext';
import {
  Camera,
  MapPin,
  Send,
  CheckCircle,
  Flame,
  Wind,
  Shield,
  WifiOff,
  Check,
  AlertCircle,
  RefreshCw,
  FileText,
  UserCheck
} from 'lucide-react';
import sampleIllustration from '../../assets/images/patrol_field_team.webp';
import { KebijakanPrivasi } from '../tentang/KebijakanPrivasi';

interface W4LaporProps {
  onSuccess?: () => void;
}

export const W4_Lapor: React.FC<W4LaporProps> = ({ onSuccess }) => {
  const {
    zones,
    selectedZone,
    addCitizenReport,
    isOnline,
    offlineQueueCount
  } = useApp();

  const { authMode, profile } = useAuth();

  const [condition, setCondition] = useState<'Aman' | 'Asap' | 'Api'>('Asap');
  const [zoneId, setZoneId] = useState<string>(selectedZone.id);
  const [reporterType, setReporterType] = useState<'Warga' | 'Anggota MPA' | 'Petani'>('Warga');
  const [notes, setNotes] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Real Geolocation API states
  const [realCoords, setRealCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [realAccuracy, setRealAccuracy] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Consent & Privacy state (Point 5)
  const [hasConsent, setHasConsent] = useState<boolean>(true);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isPrivacyModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPrivacyModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrivacyModalOpen]);

  // Real Geolocation API request
  const requestRealGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Perangkat tidak mendukung sensor Geolocation GPS.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRealCoords({
          lat: +pos.coords.latitude.toFixed(5),
          lng: +pos.coords.longitude.toFixed(5)
        });
        setRealAccuracy(Math.round(pos.coords.accuracy));
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied or error:', err.message);
        setGpsError('Izin lokasi ditolak atau sinyal GPS lemah. Silakan pilih desa secara manual.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    requestRealGPS();
  }, []);

  // Handle Photo selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleIllustration = () => {
    setPhotoPreview(sampleIllustration);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(null);

    if (!hasConsent) {
      setConsentError('Anda wajib menyetujui pengiriman koordinat lokasi dan foto sebelum mengirim laporan.');
      return;
    }

    setIsSubmitting(true);

    const targetZone = zones.find((z) => z.id === zoneId) || selectedZone;

    const finalLat = realCoords ? realCoords.lat : targetZone.coordinates.lat;
    const finalLng = realCoords ? realCoords.lng : targetZone.coordinates.lng;

    await addCitizenReport({
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      condition,
      reporterType,
      notes: notes || `Laporan kondisi ${condition} di sekitar wilayah ${targetZone.name}.`,
      photoUrl: photoPreview || undefined,
      coordinates: {
        x: targetZone.coordinates.x,
        y: targetZone.coordinates.y,
        lat: finalLat,
        lng: finalLng
      }
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setNotes('');
      setPhotoPreview(null);
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Formulir Lapor Cepat</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Laporkan temuan asap atau api. Tetap dapat dikirim saat tanpa sinyal (disimpan di antrean perangkat).
        </p>
      </div>

      {/* Account / Session Badge */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-[13px]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">
              {profile ? profile.name : authMode === 'demo' ? 'Mode Demo' : 'Warga'}
            </span>
            <span className="text-[12px] text-slate-500">
              {authMode === 'demo'
                ? 'Simulasi lokal (tidak menulis ke database)'
                : profile?.village
                ? `Desa: ${profile.village}`
                : 'Tersambung ke Posko'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-[13px] font-semibold text-emerald-700 hover:underline min-h-[44px] px-2 flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Privasi</span>
        </button>
      </div>

      {isSuccess ? (
        <div className="text-center py-10 bg-white rounded-xl border border-emerald-200 p-6 animate-in zoom-in-95 duration-150 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-slate-900">
            {isOnline ? 'Laporan berhasil terkirim' : 'Laporan tersimpan di antrean'}
          </h3>
          <p className="text-[14px] text-slate-600 max-w-sm mx-auto">
            {isOnline
              ? 'Terima kasih atas laporan Anda. Data telah masuk ke posko untuk memperkuat verifikasi wilayah.'
              : `Laporan disimpan di antrean (${offlineQueueCount + 1} antrean). Saat perangkat tersambung sinyal, data otomatis dikirim.`}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Condition Selector Buttons (Clean light theme, min 44px height) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <label className="text-[15px] font-bold text-slate-900 block">
              1. Apa yang Anda lihat di lapangan?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCondition('Aman')}
                className={`min-h-[46px] py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                  condition === 'Aman'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-5 h-5 text-emerald-700" />
                <span className="text-[14px]">Aman</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('Asap')}
                className={`min-h-[46px] py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                  condition === 'Asap'
                    ? 'bg-amber-50 text-amber-800 border-amber-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Wind className="w-5 h-5 text-amber-600" />
                <span className="text-[14px]">Ada asap</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('Api')}
                className={`min-h-[46px] py-2 px-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                  condition === 'Api'
                    ? 'bg-red-50 text-red-800 border-red-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-5 h-5 text-red-600" />
                <span className="text-[14px]">Ada api</span>
              </button>
            </div>
          </div>

          {/* Step 2: Location */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[15px] font-bold text-slate-900">
                2. Lokasi kejadian
              </label>
              <button
                type="button"
                onClick={requestRealGPS}
                className="text-[13px] font-semibold text-emerald-700 flex items-center gap-1 hover:underline min-h-[44px] px-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>Segarkan GPS</span>
              </button>
            </div>

            {/* GPS Result Box */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[13px]">
              {gpsLoading ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Mendeteksi koordinat GPS perangkat...</span>
                </div>
              ) : realCoords ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>GPS terkunci: {realCoords.lat}, {realCoords.lng}</span>
                  </div>
                  <span className="text-[12px] text-slate-500 block">
                    Akurasi perangkat: ±{realAccuracy} meter
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 text-amber-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{gpsError || 'GPS belum aktif. Menggunakan pilihan manual desa di bawah.'}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-[13px] font-semibold text-slate-600 block mb-1">
                Pilih wilayah desa:
              </span>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full text-[15px] font-medium text-slate-900 bg-white py-2 px-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-700 min-h-[44px]"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.regency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Photo Attachment */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <label className="text-[15px] font-bold text-slate-900 block">
              3. Foto bukti lapangan
            </label>

            {photoPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={photoPreview}
                  alt="Ilustrasi Lampiran"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 px-3 py-1.5 rounded-md bg-white/95 text-red-600 border border-slate-200 shadow-sm text-[13px] font-bold min-h-[44px] flex items-center gap-1 hover:bg-white"
                >
                  Hapus foto
                </button>
              </div>
            ) : (
              <div>
                <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition min-h-[80px]">
                  <Camera className="w-6 h-6 text-emerald-700" />
                  <span className="text-[14px] font-bold text-slate-800">
                    Ambil foto / pilih file
                  </span>
                  <span className="text-[12px] text-slate-500">Kamera atau galeri perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[13px] text-slate-500">Uji coba cepat:</span>
                  <button
                    type="button"
                    onClick={handleUseSampleIllustration}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition min-h-[44px]"
                  >
                    Pakai contoh ilustrasi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Notes */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[15px] font-bold text-slate-900">
                4. Keterangan tambahan
              </label>
              <div className="flex items-center gap-1">
                {(['Warga', 'Anggota MPA', 'Petani'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReporterType(t)}
                    className={`px-2.5 py-1 text-[13px] rounded-lg transition min-h-[44px] flex items-center ${
                      reporterType === t
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Asap tercium di dekat kanal km 12..."
              rows={2}
              className="w-full text-[15px] text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-700 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Step 5: Mandatory Consent Box */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
            <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-emerald-950">
              <input
                type="checkbox"
                required
                checked={hasConsent}
                onChange={(e) => {
                  setHasConsent(e.target.checked);
                  if (e.target.checked) setConsentError(null);
                }}
                className="w-4 h-4 rounded mt-0.5 text-emerald-700 focus:ring-emerald-700 shrink-0"
              />
              <span className="leading-snug">
                <strong>Persetujuan pengiriman data:</strong> Saya menyetujui koordinat lokasi GPS dan foto dikirimkan ke Posko DETARA sesuai{' '}
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-emerald-800 font-bold underline"
                >
                  Kebijakan Privasi
                </button>.
              </span>
            </label>

            {consentError && (
              <p className="text-[12px] text-red-600 font-semibold pl-6">
                {consentError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl font-bold text-[15px] text-white shadow-xs transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[46px] ${
              condition === 'Api'
                ? 'bg-red-600 hover:bg-red-700'
                : condition === 'Asap'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Menyimpan...'
                : isOnline
                ? 'Kirim laporan sekarang'
                : 'Simpan di antrean offline'}
            </span>
          </button>
        </form>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/30 p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsPrivacyModalOpen(false)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-5 shadow-lg border border-slate-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <KebijakanPrivasi onBack={() => setIsPrivacyModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
