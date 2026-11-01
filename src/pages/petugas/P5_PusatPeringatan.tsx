import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { RiskLevel, AlertNotification } from '../../types';
import {
  Bell,
  Send,
  Radio,
  RotateCcw,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldAlert
} from 'lucide-react';

export const P5_PusatPeringatan: React.FC = () => {
  const {
    alerts,
    broadcastAlert,
    retriggerAlert,
    escalateAlert,
    acknowledgeAlert,
    zones,
    selectedZone
  } = useApp();

  const [title, setTitle] = useState<string>('');
  const [level, setLevel] = useState<RiskLevel>('Siaga');
  const [zoneName, setZoneName] = useState<string>(selectedZone.name);
  const [message, setMessage] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<('App Push' | 'WhatsApp Bot' | 'SMS Gateway' | 'Sirine Desa')[]>([
    'App Push',
    'WhatsApp Bot'
  ]);
  const [isSent, setIsSent] = useState<boolean>(false);

  const toggleChannel = (ch: 'App Push' | 'WhatsApp Bot' | 'SMS Gateway' | 'Sirine Desa') => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    broadcastAlert({
      title,
      level,
      zoneName,
      message,
      actionRecommendation: recommendation || 'Tetap waspada dan ikuti arahan posko desa.',
      channels: selectedChannels
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setTitle('');
      setMessage('');
      setRecommendation('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
            Pusat Peringatan & Diseminasi Informasi Multikanal
          </h1>
          <p className="text-sm text-slate-500">
            Kirim peringatan dini (simulasi siaran) ke aplikasi warga PWA, bot WhatsApp komunitas, SMS gateway pedalaman, dan sirine desa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Kirim Siaran Peringatan Baru</span>
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-sm">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Tingkat Bahaya:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Waspada', 'Siaga', 'Awas'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 rounded-xl font-bold transition text-sm min-h-[40px] ${
                      level === lvl
                        ? lvl === 'Awas'
                          ? 'bg-red-600 text-white'
                          : lvl === 'Siaga'
                          ? 'bg-orange-600 text-white'
                          : 'bg-yellow-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Wilayah Sasaran:
              </label>
              <select
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-sm min-h-[44px]"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Judul Peringatan:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Titik Panas & Penurunan Air Tanah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Isi Pesan Peringatan:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Deskripsi situasi lapangan yang terdeteksi..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Rekomendasi Tindakan Warga:
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Tutup ventilasi rumah, gunakan masker partikulat..."
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              />
            </div>

            {/* Multichannel Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Kanal Diseminasi:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['App Push', 'WhatsApp Bot', 'SMS Gateway', 'Sirine Desa'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`p-2 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition min-h-[40px] ${
                      selectedChannels.includes(ch)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${selectedChannels.includes(ch) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>{ch}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition shadow-md active:scale-95 min-h-[44px]"
            >
              {isSent ? 'Peringatan Berhasil Disiarkan!' : 'Siarkan Peringatan Multikanal'}
            </button>
          </form>
        </div>

        {/* Right: Active Broadcast Feed with Kirim Ulang & Eskalasi (Point 21) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>Riwayat Peringatan yang Sedang Aktif ({alerts.length})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.map((al) => {
              const isAwas = al.level === 'Awas';
              const isSiaga = al.level === 'Siaga';

              return (
                <div
                  key={al.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                          isAwas
                            ? 'bg-red-600 text-white'
                            : isSiaga
                            ? 'bg-orange-600 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}
                      >
                        {al.level.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {al.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{al.timestamp}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-sm">
                    {al.message}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2 text-sm">
                    <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{al.actionRecommendation}</span>
                  </div>

                  {/* Actions: Kirim Ulang & Eskalasi (Point 21) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-sm">
                    <span className="text-slate-500">Target: <strong className="text-slate-800">{al.zoneName}</strong></span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => retriggerAlert(al.id)}
                        className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold flex items-center gap-1.5 transition text-sm min-h-[40px]"
                        title="Siarkan ulang peringatan ini"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Kirim Ulang</span>
                      </button>

                      {al.level !== 'Awas' && (
                        <button
                          onClick={() => escalateAlert(al.id)}
                          className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold flex items-center gap-1.5 border border-red-300 transition text-sm min-h-[40px]"
                          title="Naikkan status ke level lebih tinggi"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                          <span>Eskalasi</span>
                        </button>
                      )}

                      {!al.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(al.id)}
                          className="px-3 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-sm min-h-[40px]"
                        >
                          Tandai Tahu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
