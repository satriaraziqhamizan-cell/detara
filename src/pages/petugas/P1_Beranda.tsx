import React from 'react';
import { useApp } from '../../store/appContext';
import {
  Radio,
  Flame,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Droplets,
  Activity,
  Users,
  Compass
} from 'lucide-react';

interface P1BerandaProps {
  onNavigate: (tab: string) => void;
}

export const P1_Beranda: React.FC<P1BerandaProps> = ({ onNavigate }) => {
  const { zones, nodes, hotspots, alerts, reports, tasks, scenario } = useApp();

  const totalOnlineNodes = nodes.filter((n) => n.status === 'ONLINE').length;
  const totalWarningNodes = nodes.filter((n) => n.status === 'WARNING').length;
  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  // Top 5 priority zones based on Patrol Priority Score
  const priorityZones = [...zones].sort(
    (a, b) => b.patrolPriorityScore - a.patrolPriorityScore
  );

  return (
    <div className="space-y-6">
      {/* Welcome & System Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600  uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>DETARA Early Warning System · Prov. Jambi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 ">
            Pusat Komando & Pengendalian Karhutla (Command Center)
          </h1>
          <p className="text-xs text-slate-500  mt-1">
            Monitoring telemetri gambut multi-node LoRa, analisis Edge AI, dan respons terpadu Manggala Agni, BPBD & MPA.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('peta')}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Buka Peta SIG</span>
          </button>
        </div>
      </div>

      {/* 4 Key Performance & Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Node IoT Aktif */}
        <div className="bg-white  p-5 rounded-2xl border border-slate-200  shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Node IoT Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100  text-emerald-600  flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900  tabular-nums">
              {totalOnlineNodes}/{nodes.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Online</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalWarningNodes > 0 ? `${totalWarningNodes} anomali lokal terdeteksi` : 'Seluruh node normal'}
          </span>
        </div>

        {/* Metric 2: Hotspot Satelit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Hotspot Satelit</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {hotspots.length}
            </span>
            <span className="text-[13px] text-amber-700 font-semibold">Titik Panas</span>
          </div>
          <span className="text-[13px] text-slate-500 mt-1 block">
            Hotspot simulasi (belum terhubung ke satelit)
          </span>
        </div>

        {/* Metric 3: Peringatan Aktif */}
        <div className="bg-white  p-5 rounded-2xl border border-slate-200  shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peringatan Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100  text-rose-600  flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900  tabular-nums">
              {activeAlertsCount}
            </span>
            <span className="text-[11px] text-rose-600 font-semibold">Belum Direspons</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Eskalasi otomatis sesuai Trust Score
          </span>
        </div>

        {/* Metric 4: Partisipasi Laporan Warga */}
        <div className="bg-white  p-5 rounded-2xl border border-slate-200  shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Laporan Komunitas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100  text-blue-600  flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900  tabular-nums">
              {reports.length}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">Laporan Masuk</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {tasks.length} penugasan lapangan aktif
          </span>
        </div>
      </div>

      {/* Two Column Section: Priority Zones (P1) + Real-time Alerts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): 5 Zona Prioritas Utama */}
        <div className="lg:col-span-2 bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900  flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>5 Zona Prioritas Tertinggi (Patrol Priority Score)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Peringkat intervensi berdasarkan kombinasi Risiko Api × Keterpaparan Permukiman & Pangan
              </p>
            </div>
            <button
              onClick={() => onNavigate('patroli')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Detail Patroli</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50  text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200 ">
                <tr>
                  <th className="py-2.5 px-3">Zona Wilayah</th>
                  <th className="py-2.5 px-3">Tipe Gambut</th>
                  <th className="py-2.5 px-3 text-center">Indeks Risiko</th>
                  <th className="py-2.5 px-3 text-center">Trust Score</th>
                  <th className="py-2.5 px-3 text-center">Skor Prioritas (PPS)</th>
                  <th className="py-2.5 px-3">Tindakan Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 ">
                {priorityZones.slice(0, 5).map((zone, idx) => {
                  const isAwas = zone.riskLevel === 'Awas';
                  const isSiaga = zone.riskLevel === 'Siaga';

                  return (
                    <tr key={zone.id} className="hover:bg-slate-50 :bg-slate-700/40 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 ">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                          <div>
                            <span>{zone.name}</span>
                            <span className="block text-[10px] text-slate-400">{zone.regency}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 ">
                        {zone.peatType}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            isAwas
                              ? 'bg-red-100  text-red-700 '
                              : isSiaga
                              ? 'bg-orange-100  text-orange-700 '
                              : 'bg-yellow-100  text-yellow-700 '
                          }`}
                        >
                          {zone.riskIndex}/100 ({zone.riskLevel})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-600 ">
                        {zone.trustScore}% ({zone.trustLevel})
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-extrabold text-sm text-slate-900 ">
                        {zone.patrolPriorityScore}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onNavigate('analisis')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100  hover:bg-emerald-600 hover:text-white transition font-medium text-[11px]"
                        >
                          Analisis
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (1 col): Ringkasan Peringatan Terkini & Tindakan Lapangan */}
        <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900  flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Peringatan Siaga</span>
            </h3>
            <button
              onClick={() => onNavigate('peringatan')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900  truncate">
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                </div>
                <p className="text-slate-600  text-[11px] line-clamp-2">
                  {alert.actionRecommendation}
                </p>
                <div className="text-[10px] text-emerald-600  font-semibold pt-1">
                  Kanal: {alert.channels.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50  rounded-2xl border border-emerald-200  text-xs">
            <span className="font-bold text-emerald-900  block mb-1">
              Keunggulan Inovasi Verifikasi Berlapis:
            </span>
            <p className="text-[11px] text-emerald-800  leading-relaxed">
              Sistem meniadakan alarm palsu (false alarm). Eskalasi hanya dijalankan ketika Risk Index didukung oleh Trust Score tinggi dari laporan warga atau citra satelit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
