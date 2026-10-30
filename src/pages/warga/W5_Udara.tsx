import React from 'react';
import { useApp } from '../../store/appContext';
import { Wind, HeartPulse, Baby, UserCheck, Activity } from 'lucide-react';

export const W5_Udara: React.FC = () => {
  const { zones, selectedZone } = useApp();

  const getAirQualityStatus = (pm25: number) => {
    if (pm25 <= 15) {
      return {
        label: 'Baik',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50/60 border-emerald-200',
        badgeBg: 'bg-emerald-700',
        desc: 'Kualitas udara baik. Udara bersih dan tidak berisiko bagi kesehatan masyarakat.'
      };
    } else if (pm25 <= 55) {
      return {
        label: 'Sedang',
        color: 'text-blue-700',
        bg: 'bg-blue-50/60 border-blue-200',
        badgeBg: 'bg-blue-600',
        desc: 'Kualitas udara dapat diterima. Terdapat sedikit partikel debu ringan.'
      };
    } else if (pm25 <= 100) {
      return {
        label: 'Tidak sehat (sensitif)',
        color: 'text-amber-700',
        bg: 'bg-amber-50/60 border-amber-200',
        badgeBg: 'bg-amber-600',
        desc: 'Kelompok sensitif (anak-anak, lansia, penderita asma) disarankan mengurangi aktivitas luar.'
      };
    } else {
      return {
        label: 'Tidak sehat / Berbahaya',
        color: 'text-red-700',
        bg: 'bg-red-50/60 border-red-200',
        badgeBg: 'bg-red-600',
        desc: 'Kabut asap pekat. Gunakan masker partikulat dan tutup ventilasi jika asap memasuki rumah.'
      };
    }
  };

  const currentAqi = getAirQualityStatus(selectedZone.pm25Avg);

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Kualitas Udara & Kesehatan</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Pantauan sensor partikulat PM2.5 per desa dan panduan kesehatan
        </p>
      </div>

      {/* Main PM2.5 Gauge Card */}
      <div className={`p-4 rounded-xl border ${currentAqi.bg} shadow-xs space-y-3`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] font-semibold text-slate-500">
              Konsentrasi PM2.5 · {selectedZone.name}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[32px] font-extrabold text-slate-900 leading-none">
                {selectedZone.pm25Avg}
              </span>
              <span className="text-[13px] font-semibold text-slate-500">µg/m³</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-lg ${currentAqi.badgeBg} text-white text-[13px] font-bold`}>
            {currentAqi.label}
          </div>
        </div>

        <p className="text-[14px] text-slate-700 leading-relaxed">
          {currentAqi.desc}
        </p>

        {/* 24-Hour Trend Visualizer Bar */}
        <div className="pt-2.5 border-t border-slate-200">
          <div className="flex items-center justify-between text-[13px] text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tren 24 jam terakhir</span>
            </span>
            <span>Tertinggi: {Math.round(selectedZone.pm25Avg * 1.25)} µg</span>
          </div>

          <div className="h-10 flex items-end gap-1 pt-1">
            {[45, 48, 52, 60, 68, 75, 82, 88, 92, selectedZone.pm25Avg].map((val, idx) => {
              const heightPct = Math.min(100, (val / 120) * 100);
              const barColor =
                val > 90 ? 'bg-red-500' : val > 55 ? 'bg-amber-500' : 'bg-emerald-600';
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className={`w-full rounded-t-sm ${barColor} opacity-90 transition-all duration-300`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[12px] text-slate-400 mt-1">
            <span>24 jam lalu</span>
            <span>12 jam lalu</span>
            <span>Sekarang</span>
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-600" />
          <span>Saran kesehatan:</span>
        </h3>

        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <Baby className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-[14px] block">
                Anak-anak di bawah 12 tahun
              </span>
              <p className="text-[13px] text-slate-600 mt-0.5 leading-normal">
                Batasi aktivitas bermain di luar rumah saat pagi dan sore hari jika terdapat embusan asap gambut.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-[14px] block">
                Lansia dan penderita pernapasan
              </span>
              <p className="text-[13px] text-slate-600 mt-0.5 leading-normal">
                Siapkan obat pelega pernapasan dan gunakan masker yang menutup rapat saat keluar rumah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Villages Comparison List */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-[16px] font-bold text-slate-900">
          Perbandingan PM2.5 antar desa
        </h3>

        <div className="divide-y divide-slate-100">
          {zones.map((z) => {
            const status = getAirQualityStatus(z.pm25Avg);
            return (
              <div key={z.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[15px] text-slate-900 block">
                    {z.name}
                  </span>
                  <span className="text-[13px] text-slate-400">{z.regency}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[15px] text-slate-900 block">
                    {z.pm25Avg} µg/m³
                  </span>
                  <span className={`text-[13px] font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
