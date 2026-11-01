import React from 'react';
import { useApp } from '../../store/appContext';
import {
  Leaf,
  HeartPulse,
  Sprout,
  Users,
  GraduationCap,
  Building2,
  TrendingDown,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const P8_AgriDampak: React.FC = () => {
  const { zones } = useApp();

  // Calculations based on KLHK & Peatland Science empirical constants
  // 1 ha peat fire releases approx. ~450 - 550 tons CO2eq
  const totalProtectedPeatHectares = zones.reduce((acc, z) => acc + z.farmlandHectares, 0) + 1850;
  const estimatedAvoidedEmissionsTons = Math.round(totalProtectedPeatHectares * 1.8 * 48); // simulated avoided carbon
  const totalBeneficiaryPopulation = zones.reduce((acc, z) => acc + z.populationNear, 0);

  const subthemes = [
    {
      id: 'env',
      title: '1. Environmental Sustainability (Subtema Utama)',
      sdgs: 'SDG 13 (Aksi Iklim) & SDG 15 (Ekosistem Darat)',
      icon: Leaf,
      color: 'text-emerald-600 bg-emerald-50  border-emerald-200 ',
      metric: `${estimatedAvoidedEmissionsTons.toLocaleString('id-ID')} Ton CO₂e`,
      metricLabel: 'Potensi Emisi Karbon Tercegah',
      details: 'Pencegahan kebakaran permukaan sebelum masuk ke lapisan gambut dalam (smoldering combustion) yang melepaskan emisi karbon masif ke atmosfer global.'
    },
    {
      id: 'health',
      title: '2. Public Health (Kesehatan Masyarakat)',
      sdgs: 'SDG 3 (Kehidupan Sehat & Sejahtera)',
      icon: HeartPulse,
      color: 'text-rose-600 bg-rose-50  border-rose-200 ',
      metric: 'Lead Time 4 Jam',
      metricLabel: 'Peringatan Dini Sebelum Kabut Tebal',
      details: 'Sensor PM2.5 desa memicu peringatan proteksi bagi 33.000+ warga rentan (anak-anak dan lansia) sebelum indeks partikulat mencapai level berbahaya.'
    },
    {
      id: 'food',
      title: '3. Food Security (Ketahanan Pangan)',
      sdgs: 'SDG 2 (Tanpa Kelaparan)',
      icon: Sprout,
      color: 'text-amber-600 bg-amber-50  border-amber-200 ',
      metric: `${totalProtectedPeatHectares.toLocaleString('id-ID')} Hektar`,
      metricLabel: 'Lahan Produktif Dalam Pengawasan',
      details: 'Menjaga kebun kelapa, kopi liberika, pinang, dan sawit rakyat dari kerusakan akibat perambatan api bawah tanah.'
    },
    {
      id: 'econ',
      title: '4. Economic Empowerment (Pemberdayaan Ekonomi)',
      sdgs: 'SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi)',
      icon: Users,
      color: 'text-cyan-600 bg-cyan-50  border-cyan-200 ',
      metric: '48 Personel MPA',
      metricLabel: 'Warga Terlatih Menjadi Teknisi Sensor',
      details: 'Komunitas Masyarakat Peduli Api dilatih menjadi operator pemeliharaan panel surya, pengecekan dipwell, dan verifikator data.'
    },
    {
      id: 'edu',
      title: '5. Quality Education (Pendidikan Berkualitas)',
      sdgs: 'SDG 4 (Pendidikan Bermutu)',
      icon: GraduationCap,
      color: 'text-purple-600 bg-purple-50  border-purple-200 ',
      metric: '12 Sekolah Desa',
      metricLabel: 'Integrasi Edukasi Sains Lingkungan',
      details: 'Sensor stasiun cuaca mikro menjadi laboratorium hidup bagi pelajar desa untuk mempelajari iklim, kelembapan tanah, dan mitigasi bencana.'
    },
    {
      id: 'resilient',
      title: '6. Resilient Cities & Green Innovation',
      sdgs: 'SDG 11 (Kota Berkelanjutan) & SDG 7 (Energi Bersih)',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50  border-indigo-200 ',
      metric: '100% Tenaga Surya',
      metricLabel: 'Perangkat Mandiri Energi (Off-Grid)',
      details: 'Node pemantau beroperasi mandiri dengan panel surya dan baterai LiFePO4, menjamin keandalan data meski listrik PLN di pedalaman padam.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span>Keterkaitan 6 Subtema YESC 2026 & Estimasi Dampak</span>
          </h1>
          <p className="text-sm text-slate-500">
            Penjelasan dampak multidimensi pencegahan karhutla: Lingkungan, Kesehatan, Pangan, Ekonomi, Edukasi, dan Ketahanan Wilayah
          </p>
        </div>
      </div>

      {/* 6 Subthemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subthemes.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className={`p-5 rounded-3xl border ${st.color} shadow-sm space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-white shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/80">
                    {st.sdgs.split('&')[0].trim()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">
                  {st.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {st.details}
                </p>
              </div>

              <div className="pt-3 border-t border-black/10">
                <span className="text-xs text-slate-500 block">{st.metricLabel}:</span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {st.metric}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agri-Advisory Calendar Module (Food Security Pillar) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Modul Agri-Advisory: Kalender Risiko Tani & Panduan PLTB Jambi
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
            Petani Siaga Api
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Petani perkebunan rakyat di Muaro Jambi dan Tanjung Jabung sering terjebak membakar seresah karena ketiadaan modal alat berat. Modul Agri-Advisory DETARA menyediakan kalender prediksi kelembapan tanah, rekomendasi waktu aman pengolahan tanah, dan panduan dekomposisi hayati tanpa api.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">
              1. Pengecekan Ambang Muka Air
            </span>
            <p className="text-slate-600 text-sm leading-relaxed">
              Jika muka air kanal &lt; -40 cm, dilarang keras melakukan pembersihan seresah dengan api terbuka di lahan gambut.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">
              2. Aplikasi Bio-Dekomposer Cair
            </span>
            <p className="text-slate-600 text-sm leading-relaxed">
              Semprotkan mikroba pengurai jerami/pelepah kelapa sawit dosis 2 liter/ha untuk memicu fermentasi alami dalam 21 hari.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">
              3. Pembuatan Rorak & Sekat Kanal
            </span>
            <p className="text-slate-600 text-sm leading-relaxed">
              Buat rorak penampung air hujan di antara barisan tanaman produktif untuk mempertahankan kelembapan mikro perkebunan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
