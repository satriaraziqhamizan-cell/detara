import React from 'react';
import { useApp } from '../../store/appContext';
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ChevronRight,
  CheckCircle,
  Info
} from 'lucide-react';

interface W1BerandaProps {
  onNavigate: (tab: string) => void;
}

export const W1_Beranda: React.FC<W1BerandaProps> = ({ onNavigate }) => {
  const {
    selectedZone,
    zones,
    setSelectedZoneId,
    confirmCondition,
    alerts
  } = useApp();

  const getStatusConfig = (level: string) => {
    switch (level) {
      case 'Awas':
        return {
          stripColor: 'border-l-red-600',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          icon: <Flame className="w-5 h-5 text-red-600 shrink-0" />,
          title: 'Status: Awas',
          advice: 'Bahaya kebakaran tinggi. Dilarang menyalakan api di kebun atau pekarangan.'
        };
      case 'Siaga':
        return {
          stripColor: 'border-l-orange-500',
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />,
          title: 'Status: Siaga',
          advice: 'Muka air tanah gambut sangat rendah. Tim MPA desa bersiap di posko sekat kanal.'
        };
      case 'Waspada':
        return {
          stripColor: 'border-l-amber-500',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          title: 'Status: Waspada',
          advice: 'Cuaca terik dan kering. Waspadai embusan asap di sekitar lahan perkebunan.'
        };
      default:
        return {
          stripColor: 'border-l-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
          title: 'Status: Normal',
          advice: 'Kondisi gambut aman dan lembap. Tetap jaga kelestarian lingkungan desa.'
        };
    }
  };

  const statusConfig = getStatusConfig(selectedZone.riskLevel);
  const activeAlert = alerts[0];

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      {/* Zone Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 min-h-[44px]">
        <div className="flex items-center gap-2 text-[13px] text-slate-600 shrink-0">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">Desa:</span>
        </div>
        <select
          value={selectedZone.id}
          onChange={(e) => setSelectedZoneId(e.target.value)}
          className="min-w-0 flex-1 text-[15px] font-semibold text-slate-900 bg-slate-50 py-2 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-700 min-h-[44px]"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} ({z.regency})
            </option>
          ))}
        </select>
      </div>

      {/* Main Status Card: White card with left border strip & 22px title (Item 12) */}
      <div className={`bg-white rounded-xl p-4 border border-slate-200 border-l-4 ${statusConfig.stripColor} shadow-xs space-y-3.5`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[13px] font-semibold ${statusConfig.badgeBg}`}>
                {statusConfig.icon}
                <span>{selectedZone.riskLevel}</span>
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-slate-900 leading-tight">
              {statusConfig.title}
            </h2>
            <p className="text-[14px] text-slate-500 mt-0.5">
              {selectedZone.name} · {selectedZone.peatType}
            </p>
          </div>
        </div>

        {/* Vital Metrics in light clean boxes */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[13px] text-slate-500 block">Air gambut</span>
            <span className="text-[16px] font-bold text-slate-900">{selectedZone.waterLevelAvg} cm</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[13px] text-slate-500 block">Kelembapan</span>
            <span className="text-[16px] font-bold text-slate-900">{selectedZone.soilMoistureAvg}%</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[13px] text-slate-500 block">PM2.5 udara</span>
            <span className="text-[16px] font-bold text-slate-900">{selectedZone.pm25Avg} µg</span>
          </div>
        </div>

        {/* Advice box */}
        <div className="text-[14px] text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
          <span>{statusConfig.advice}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => onNavigate('lapor')}
        className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[15px] transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[46px] shadow-xs"
      >
        <Flame className="w-5 h-5 text-white" />
        <span>Lapor kondisi atau titik api</span>
      </button>

      {/* Instant 1-Tap Community Verification */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>Konfirmasi warga sekitar</span>
          </h3>
          <span className="text-[13px] text-slate-400">Verifikasi cepat</span>
        </div>
        <p className="text-[14px] text-slate-600 leading-normal">
          Bantu posko memvalidasi keakuratan deteksi di desa Anda:
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => confirmCondition(selectedZone.id, 'Aman')}
            className="min-h-[44px] py-2 px-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[14px] font-bold hover:bg-emerald-100 transition active:scale-95 text-center flex items-center justify-center"
          >
            ✓ Aman
          </button>
          <button
            onClick={() => confirmCondition(selectedZone.id, 'Asap')}
            className="min-h-[44px] py-2 px-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[14px] font-bold hover:bg-amber-100 transition active:scale-95 text-center flex items-center justify-center"
          >
            ~ Ada asap
          </button>
          <button
            onClick={() => confirmCondition(selectedZone.id, 'Api')}
            className="min-h-[44px] py-2 px-1 rounded-lg bg-red-50 text-red-800 border border-red-200 text-[14px] font-bold hover:bg-red-100 transition active:scale-95 text-center flex items-center justify-center"
          >
            ! Ada api
          </button>
        </div>
      </div>

      {/* Latest Alert Card */}
      {activeAlert && (
        <div
          onClick={() => onNavigate('peringatan')}
          className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl cursor-pointer hover:bg-amber-100/60 transition shadow-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-[15px] font-bold text-amber-950">
                  {activeAlert.title}
                </h4>
                <p className="text-[13px] text-amber-900 mt-1 leading-relaxed">
                  {activeAlert.message}
                </p>
                <span className="text-[13px] text-amber-800 mt-1.5 block font-semibold">
                  {activeAlert.timestamp} · Ketuk untuk saran lengkap →
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
          </div>
        </div>
      )}
    </div>
  );
};
