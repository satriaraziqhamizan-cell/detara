import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { GISMap } from '../../components/gis/GISMap';
import { SensorNode } from '../../types';
import {
  Layers,
  MapPin,
  Radio,
  Flame,
  FileText,
  Navigation,
  Compass,
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const P2_PetaSIG: React.FC = () => {
  const { zones, nodes, hotspots, reports, selectedZone, setSelectedZoneId } = useApp();
  const [inspectedNode, setInspectedNode] = useState<SensorNode | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
            Peta Sistem Informasi Geografis (SIG) Karhutla
          </h1>
          <p className="text-sm text-slate-500">
            Tampilan spasial multi-layer: jaringan sensor LoRa, sekat kanal gambut, titik panas simulasi, dan laporan warga
          </p>
        </div>

        {/* Quick Filter by Regency */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Pilih Zona:</span>
          <select
            value={selectedZone.id}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="text-sm font-semibold text-slate-800 bg-white py-1.5 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} - {z.riskLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Full GIS Map Display */}
      <GISMap
        height="h-[560px]"
        showAllControls={true}
        onSelectNode={(node) => setInspectedNode(node)}
      />

      {/* GIS Telemetry & Layer Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Radio className="w-4 h-4 text-emerald-700" />
            <span>Jaringan Sensor LoRa (Node Lapangan)</span>
          </div>
          <p className="text-sm text-slate-500">
            Total {nodes.length} node disimulasikan di KHG Sungai Batanghari & Kumpeh. Jangkauan transmisi gateway mencakup radius 12 km tanpa seluler.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Hotspot Satelit (Simulasi)</span>
          </div>
          <p className="text-sm text-slate-500">
            {hotspots.length} deteksi hotspot simulasi. Berfungsi sebagai validasi pendukung pada matriks Risk × Confidence untuk menghitung Trust Score.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Navigation className="w-4 h-4 text-cyan-700" />
            <span>Infrastruktur Sekat Kanal (Rewetting)</span>
          </div>
          <p className="text-sm text-slate-500">
            Garis putus-putus biru menandakan jaringan kanal dan sekat kanal pencegah penurunan air tanah di bawah standar PP 57/2016 (-40 cm).
          </p>
        </div>
      </div>
    </div>
  );
};
