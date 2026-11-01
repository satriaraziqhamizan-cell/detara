import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import {
  Compass,
  Navigation,
  ShieldAlert,
  Users,
  Sprout,
  Truck,
  Droplet,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import patrolFieldTeamWebp from '../../assets/images/patrol_field_team.webp';

export const P7_PrioritasPatroli: React.FC = () => {
  const { zones, setSelectedZoneId, setMode } = useApp();

  // Sort by Patrol Priority Score (PPS) descending
  const rankedZones = [...zones].sort(
    (a, b) => b.patrolPriorityScore - a.patrolPriorityScore
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-700" />
            <span>Prioritas Patroli Sadar Dampak (Patrol Priority Score)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Inovasi Taktis YESC 2026: Rekomendasi urutan intervensi saat sumber daya armada dan personel terbatas (data simulasi).
          </p>
        </div>
      </div>

      {/* Algorithmic Formula Banner in Light Theme */}
      <div className="bg-purple-50 text-slate-800 p-6 rounded-2xl border border-purple-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-900 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-purple-700" />
            <span>Rumus Optimasi Penugasan Armada Patroli:</span>
          </div>
          <span className="font-mono text-xs bg-white text-purple-800 px-3 py-1 rounded-xl border border-purple-300 font-bold">
            PPS = Risk Index × Faktor Keterpaparan (Exposure)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-sm text-purple-700 font-semibold block">1. Kedekatan Permukiman</span>
            <span className="font-bold text-slate-900 text-sm">Bobot 35%</span>
            <span className="text-sm text-slate-600 block mt-0.5">Mencegah asap masuk desa</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-sm text-purple-700 font-semibold block">2. Lahan Pangan & Sawit</span>
            <span className="font-bold text-slate-900 text-sm">Bobot 25%</span>
            <span className="text-sm text-slate-600 block mt-0.5">Melindungi aset ekonomi warga</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-sm text-purple-700 font-semibold block">3. Akses Jalan & Kanal</span>
            <span className="font-bold text-slate-900 text-sm">Bobot 20%</span>
            <span className="text-sm text-slate-600 block mt-0.5">Kelayakan rute armada pompa</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-sm text-purple-700 font-semibold block">4. Sekolah & Puskesmas</span>
            <span className="font-bold text-slate-900 text-sm">Bobot 20%</span>
            <span className="text-sm text-slate-600 block mt-0.5">Fasilitas umum rentan ISPA</span>
          </div>
        </div>
      </div>

      {/* Featured Patrol Image Banner with ES Module WebP Import */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 relative shadow-xs">
        <img
          src={patrolFieldTeamWebp}
          alt="Ilustrasi konsep simulasi patroli terpadu"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-5 flex flex-col justify-end text-white">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Ilustrasi Simulasi Lapangan (Dibuat dengan AI)
          </span>
          <h3 className="text-base font-bold mt-0.5">
            Eksekusi Cepat Pembasahan Gambut (Rewetting) Sebelum Api Menjalar ke Bawah Tanah
          </h3>
          <p className="text-sm text-slate-200 mt-1 max-w-2xl">
            Sistem menyajikan rekomendasi sumber air kanal primer terdekat dan kondisi tinggi muka air tanah simulasi kepada regu patroli.
          </p>
        </div>
      </div>

      {/* Ranked Dispatch Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-slate-900">
          Daftar Urutan Intervensi Patroli Wilayah (Peringkat Simulasi)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Urutan</th>
                <th className="py-3 px-3">Wilayah Sasaran</th>
                <th className="py-3 px-3 text-center">Indeks Risiko</th>
                <th className="py-3 px-3 text-center">Faktor Keterpaparan</th>
                <th className="py-3 px-3 text-center">Skor Prioritas (PPS)</th>
                <th className="py-3 px-3">Warga Terpapar</th>
                <th className="py-3 px-3">Sumber Air Terdekat</th>
                <th className="py-3 px-3 text-center">Aksi Armada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {rankedZones.map((zone, idx) => {
                const isTop1 = idx === 0;

                return (
                  <tr
                    key={zone.id}
                    className={`transition ${
                      isTop1
                        ? 'bg-purple-50/80 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex w-6 h-6 rounded-full items-center justify-center font-bold text-xs ${
                          isTop1
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-900 font-bold">
                      {zone.name}
                      <span className="block text-xs text-slate-400 font-normal">{zone.regency}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-red-600">
                      {zone.riskIndex}/100
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      × {zone.exposureFactor}
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-base text-purple-700">
                      {zone.patrolPriorityScore}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-600">
                      {zone.populationNear.toLocaleString('id-ID')} jiwa · {zone.farmlandHectares} ha
                    </td>
                    <td className="py-3 px-3 font-sans text-cyan-700 truncate max-w-[200px]">
                      {zone.nearestWaterSource}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <button
                        onClick={() => setSelectedZoneId(zone.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition shadow-xs min-h-[38px]"
                      >
                        Pilih Rute
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
