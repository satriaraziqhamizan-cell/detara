import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const P4_AnalisisRisiko: React.FC = () => {
  const { zones, selectedZone, setSelectedZoneId, scenario } = useApp();
  const [activeTab, setActiveTab] = useState<'matrix' | 'formula' | 'anomali'>('matrix');

  // Matrix cells definition
  // Row: Risiko [Tinggi, Sedang, Rendah]
  // Col: Trust [Rendah, Sedang, Tinggi]
  const matrixCells = [
    {
      risk: 'Tinggi',
      riskRange: 'Risk ≥ 75 (Awas) / 55-74 (Siaga)',
      trust: 'Rendah',
      trustRange: 'Trust < 40%',
      action: 'Minta Verifikasi Cepat (Warga / Patroli Cek Perangkat)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300  ',
      description: 'Sensor mengindikasikan panas tinggi tapi mungkin terjadi drift atau baterai drop tanpa dukungan tetangga.'
    },
    {
      risk: 'Tinggi',
      riskRange: 'Risk ≥ 75 / 55-74',
      trust: 'Sedang',
      trustRange: 'Trust 40 - 69%',
      action: 'Peringatan Siaga & Frekuensi LoRa Dipercepat (Tiap 2 Menit)',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300  ',
      description: 'Tren suhu & penurunan air konsisten antar-node. Persiapkan pompa apung posko MPA.'
    },
    {
      risk: 'Tinggi',
      riskRange: 'Risk ≥ 75',
      trust: 'Tinggi',
      trustRange: 'Trust ≥ 70%',
      action: 'Peringatan AWAS + Luncurkan Groundcheck & Water Pumping',
      badgeColor: 'bg-red-100 text-red-800 border-red-300  ',
      description: 'Terkonfirmasi multi-node, citra satelit VIIRS, dan laporan visual warga/MPA. Tindakan pemadaman darurat!'
    },

    {
      risk: 'Sedang',
      riskRange: 'Risk 35 - 54 (Waspada)',
      trust: 'Rendah',
      trustRange: 'Trust < 40%',
      action: 'Cek Perangkat & Log Kalibrasi Sensor',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300  ',
      description: 'Pembacaan tidak wajar. Sistem otomatis mengisolasi node dari kalkulasi zona.'
    },
    {
      risk: 'Sedang',
      riskRange: 'Risk 35 - 54',
      trust: 'Sedang',
      trustRange: 'Trust 40 - 69%',
      action: 'Status Waspada: Pantau Perkembangan Harian',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300  ',
      description: 'Kondisi kering kemarau normal. Edukasi pembukaan lahan tanpa bakar di desa.'
    },
    {
      risk: 'Sedang',
      riskRange: 'Risk 35 - 54',
      trust: 'Tinggi',
      trustRange: 'Trust ≥ 70%',
      action: 'Siaga Dini & Patroli Prioritas Sekat Kanal',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300  ',
      description: 'Data terverifikasi solid. Tutup sekat kanal sekunder untuk menjaga kelembapan gambut.'
    },

    {
      risk: 'Rendah',
      riskRange: 'Risk < 35 (Normal)',
      trust: 'Rendah',
      trustRange: 'Trust < 40%',
      action: 'Abaikan Alarm, Catat Log Perawatan',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300  ',
      description: 'Kondisi lingkungan basah, node bermasalah ditandai tiket teknisi berkala.'
    },
    {
      risk: 'Rendah',
      riskRange: 'Risk < 35',
      trust: 'Sedang',
      trustRange: 'Trust 40 - 69%',
      action: 'Pemantauan Rutin (Heartbeat Standar)',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300  ',
      description: 'Siklus pengukuran sensor setiap 15 menit, transmisi LoRa ringkas 30–60 menit.'
    },
    {
      risk: 'Rendah',
      riskRange: 'Risk < 35',
      trust: 'Tinggi',
      trustRange: 'Trust ≥ 70%',
      action: 'Status NORMAL (Kondisi Ideal Lahan Gambut)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300  ',
      description: 'Air tanah stabil di atas -40 cm, kelembapan tanah >50%, tidak ada indikasi anomali.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-600" />
            <span>Mesin Analitik & Verifikasi Berlapis (Edge AI)</span>
          </h1>
          <p className="text-xs text-slate-500 ">
            Inti Inovasi YESC 2026: Menggabungkan Indeks Risiko Karhutla dengan Skor Kepercayaan Data (Trust Score)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white  p-1 rounded-2xl border border-slate-200 ">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600  hover:bg-slate-100'
            }`}
          >
            Matriks Risk × Confidence
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'formula'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600  hover:bg-slate-100'
            }`}
          >
            Rumus Skor & Bobot
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Scientific Concept Explainer Box */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Gagasan Inti & Pembeda dari Sistem Konvensional:</span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-4xl">
              Pada sistem tradisional, lonjakan suhu sesaat pada satu sensor langsung memicu alarm palsu (false alarm) yang melelahkan petugas. <strong>DETARA</strong> menerapkan verifikasi berlapis: status tindakan dihitung dari perkalian silang <strong>Risk Index</strong> (tingkat bahaya fisik) dengan <strong>Trust Score</strong> (tingkat keyakinan data berdasarkan konsistensi antarnode, tren waktu, validasi satelit, dan laporan warga MPA).
            </p>
          </div>

          {/* Interactive 3x3 Grid */}
          <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 ">
                  Matriks Keputusan 3×3 (Risk × Confidence Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  Posisi zona wilayah Jambi terpetakan dinamis sesuai pembacaan sensor dan laporan warga terkini
                </p>
              </div>
            </div>

            {/* Matrix Header & Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Trust Rendah (<40%)', 'Trust Sedang (40-69%)', 'Trust Tinggi (≥70%)'].map((colTitle, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  <div className="text-center py-2 px-3 bg-slate-100  rounded-xl text-xs font-bold text-slate-700 ">
                    {colTitle}
                  </div>

                  {/* 3 Rows for this column: Tinggi, Sedang, Rendah */}
                  {[0, 1, 2].map((rowIdx) => {
                    const cell = matrixCells[rowIdx * 3 + colIdx];
                    // Find zones currently matching this cell
                    const matchingZones = zones.filter((z) => {
                      const riskMatch =
                        rowIdx === 0
                          ? z.riskIndex >= 55
                          : rowIdx === 1
                          ? z.riskIndex >= 35 && z.riskIndex < 55
                          : z.riskIndex < 35;
                      const trustMatch =
                        colIdx === 0
                          ? z.trustScore < 40
                          : colIdx === 1
                          ? z.trustScore >= 40 && z.trustScore < 70
                          : z.trustScore >= 70;
                      return riskMatch && trustMatch;
                    });

                    return (
                      <div
                        key={rowIdx}
                        className={`p-4 rounded-2xl border transition shadow-sm ${cell.badgeColor} ${
                          matchingZones.length > 0 ? 'ring-2 ring-emerald-500' : 'opacity-85'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span>{cell.risk} × {cell.trust}</span>
                          {matchingZones.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px]">
                              {matchingZones.length} Zona Aktif
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold mt-1 leading-snug">{cell.action}</h4>
                        <p className="text-[10px] mt-1.5 opacity-90 leading-relaxed">
                          {cell.description}
                        </p>

                        {/* Badges for zones inside this cell */}
                        {matchingZones.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-black/10  space-y-1">
                            <span className="text-[10px] font-bold block">Wilayah saat ini:</span>
                            {matchingZones.map((z) => (
                              <button
                                key={z.id}
                                onClick={() => setSelectedZoneId(z.id)}
                                className="w-full text-left px-2 py-1 rounded bg-white/70  text-[11px] font-semibold flex items-center justify-between hover:bg-white transition"
                              >
                                <span>{z.name.split(' ')[0]}</span>
                                <span className="font-mono">R:{z.riskIndex} | T:{z.trustScore}%</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'formula' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formula 1: Risk Index */}
          <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100  text-red-600 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 ">
                  Formulasi Indeks Risiko Karhutla (Risk Index 0–100)
                </h3>
                <span className="text-[11px] text-slate-400">Parameter Fisik Lingkungan Gambut</span>
              </div>
            </div>

            <p className="text-xs text-slate-600  leading-relaxed">
              Jumlah berbobot dari 5 parameter sensor lapangan yang dikalibrasi sesuai ambang batas Peraturan Pemerintah No. 57/2016:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Kelembapan Tanah Gambut Rendah (&lt;30%)</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 30%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Penurunan Muka Air Tanah (&lt; -40 cm batas PP 57)</span>
                <span className="font-bold font-mono text-cyan-600">Bobot 25%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Suhu Gambut & Udara Tinggi (&gt; 35°C)</span>
                <span className="font-bold font-mono text-amber-600">Bobot 20%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Konsentrasi Gas Karbon Monoksida (CO &gt; 2 ppm)</span>
                <span className="font-bold font-mono text-rose-600">Bobot 15%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Jumlah Hari Kering Tanpa Hujan (BMKG)</span>
                <span className="font-bold font-mono text-slate-600 ">Bobot 10%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-100  rounded-xl text-xs font-mono text-slate-700 ">
              Risk = (0.30 × S_moist) + (0.25 × S_water) + (0.20 × S_temp) + (0.15 × S_co) + (0.10 × S_dry)
            </div>
          </div>

          {/* Formula 2: Trust Score */}
          <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100  text-emerald-600 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 ">
                  Formulasi Skor Kepercayaan Data (Trust Score 0–100)
                </h3>
                <span className="text-[11px] text-slate-400">Filter Anomali & Verifikasi Silang</span>
              </div>
            </div>

            <p className="text-xs text-slate-600  leading-relaxed">
              Memastikan bahwa peringatan dini benar-benar sahih sebelum menggerakkan regu pemadam Manggala Agni:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Kesehatan Node (Baterai &gt; 3.6V, RSSI &gt; -110 dBm)</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 25%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Kesesuaian Spasial dengan Node Tetangga</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 25%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Konsistensi Tren Waktu (Rate of Change)</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 20%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Konfirmasi Laporan Lapangan Warga / MPA</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 20%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                <span>Dukungan Citra Satelit VIIRS / MODIS</span>
                <span className="font-bold font-mono text-emerald-600">Bobot 10%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-100  rounded-xl text-xs font-mono text-slate-700 ">
              Trust = (0.25 × Health) + (0.25 × Neighbor) + (0.20 × Trend) + (0.20 × Citizen) + (0.10 × Sat)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
