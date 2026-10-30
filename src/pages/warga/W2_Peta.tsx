import React from 'react';
import { useApp } from '../../store/appContext';
import { GISMap } from '../../components/gis/GISMap';
import { MapPin, Navigation, Info } from 'lucide-react';

export const W2_Peta: React.FC = () => {
  const { selectedZone } = useApp();

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Peta Risiko Wilayah</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Sebaran sensor LoRa, titik panas satelit simulasi, dan laporan warga di Jambi
        </p>
      </div>

      {/* Interactive GIS Map */}
      <GISMap height="h-[360px]" showAllControls={true} />

      {/* Zone Details Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                selectedZone.riskLevel === 'Awas'
                  ? 'bg-red-600'
                  : selectedZone.riskLevel === 'Siaga'
                  ? 'bg-orange-500'
                  : selectedZone.riskLevel === 'Waspada'
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            />
            <h3 className="text-[17px] font-bold text-slate-900">
              {selectedZone.name}
            </h3>
          </div>
          <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {selectedZone.peatType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[15px]">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[13px] text-slate-500 block">Indeks risiko api:</span>
            <span className="font-bold text-[16px] text-slate-900">
              {selectedZone.riskIndex}/100 ({selectedZone.riskLevel})
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[13px] text-slate-500 block">Tingkat kepercayaan:</span>
            <span className="font-bold text-[16px] text-emerald-700">
              {selectedZone.trustScore}% ({selectedZone.trustLevel})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[14px] text-slate-700 pt-2 border-t border-slate-100">
          <Navigation className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Sumber air terdekat: <strong>{selectedZone.nearestWaterSource}</strong></span>
        </div>
      </div>

      <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[14px] text-emerald-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>
          Ketuk lingkaran zona atau titik sensor pada peta untuk memeriksa telemetri gambut dan status terkini.
        </span>
      </div>
    </div>
  );
};
