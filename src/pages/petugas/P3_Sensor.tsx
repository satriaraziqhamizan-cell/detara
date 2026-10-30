import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { SensorNode } from '../../types';
import {
  Radio,
  BatteryCharging,
  Wifi,
  Activity,
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  RefreshCw,
  Cpu,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const P3_Sensor: React.FC = () => {
  const { nodes, isSimulatingTime, toggleTimeSimulation, currentTimeString } = useApp();
  const [selectedNode, setSelectedNode] = useState<SensorNode>(nodes[0]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNodes = nodes.filter((n) => {
    if (filterType !== 'ALL' && n.nodeType !== filterType) return false;
    if (
      searchQuery &&
      !n.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const exportTelemetryCsv = () => {
    const headers =
      'Node_ID,Name,Zone,Type,Status,Soil_Moisture_Pct,Water_Table_Cm,Soil_Temp_C,Air_Temp_C,CO_Ppm,PM25,Battery_V,RSSI_dBm,Health_Score\n';
    const rows = nodes
      .map(
        (n) =>
          `${n.id},"${n.name}","${n.zoneName}",${n.nodeType},${n.status},${n.telemetry.soilMoisture},${n.telemetry.waterTableCm},${n.telemetry.soilTemp},${n.telemetry.airTemp},${n.telemetry.coPpm},${n.telemetry.pm25},${n.batteryVolt},${n.rssi},${n.healthScore}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `detara_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate synthetic time-series points leading to current selected node value (Point 22)
  const currentMoist = selectedNode.telemetry.soilMoisture;
  const currentPm25 = selectedNode.telemetry.pm25;

  // 8 historical points
  const timeLabels = ['-180m', '-150m', '-120m', '-90m', '-60m', '-30m', '-15m', 'Sekarang'];
  const moistSeries = [
    Math.min(95, currentMoist + 12),
    Math.min(95, currentMoist + 10),
    Math.min(95, currentMoist + 8),
    Math.min(95, currentMoist + 6),
    Math.min(95, currentMoist + 4),
    Math.min(95, currentMoist + 2),
    Math.min(95, currentMoist + 1),
    currentMoist
  ];

  const pm25Series = [
    Math.max(10, currentPm25 - 28),
    Math.max(12, currentPm25 - 24),
    Math.max(14, currentPm25 - 18),
    Math.max(16, currentPm25 - 14),
    Math.max(18, currentPm25 - 10),
    Math.max(20, currentPm25 - 6),
    Math.max(20, currentPm25 - 2),
    currentPm25
  ];

  // SVG chart dimensions
  const chartWidth = 500;
  const chartHeight = 160;
  const padding = { top: 20, right: 30, bottom: 25, left: 40 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const moistMin = 0;
  const moistMax = 100;
  const pm25Min = 0;
  const pm25Max = Math.max(140, currentPm25 + 20);

  const getMoistY = (val: number) =>
    padding.top + innerHeight - ((val - moistMin) / (moistMax - moistMin)) * innerHeight;
  const getPm25Y = (val: number) =>
    padding.top + innerHeight - ((val - pm25Min) / (pm25Max - pm25Min)) * innerHeight;
  const getX = (idx: number) => padding.left + (idx / (timeLabels.length - 1)) * innerWidth;

  const moistPathD = moistSeries
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getMoistY(val)}`)
    .join(' ');

  const pm25PathD = pm25Series
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getPm25Y(val)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 ">
            Monitoring Jaringan Sensor IoT & Telemetri
          </h1>
          <p className="text-xs text-slate-500 ">
            Pembacaan waktu nyata dari sensor lahan gambut (Node A), stasiun udara (Node B), dan cuaca mikro (Node C)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportTelemetryCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-900  text-white  text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Selected Node Real-time Telemetry Showcase Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-emerald-400">{selectedNode.id}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {selectedNode.firmwareVersion}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    selectedNode.status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedNode.status === 'WARNING'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{selectedNode.name}</h2>
              <span className="text-xs text-slate-400">{selectedNode.zoneName}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Tegangan Baterai</span>
              <span className="text-emerald-400 font-bold">{selectedNode.batteryVolt} V ({selectedNode.batteryPercent}%)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Sinyal LoRa</span>
              <span className="text-cyan-400 font-bold">{selectedNode.rssi} dBm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Health Index</span>
              <span className="text-amber-400 font-bold">{selectedNode.healthScore}%</span>
            </div>
          </div>
        </div>

        {/* Telemetry Gauge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Kelembapan Tanah</span>
            <span className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {selectedNode.telemetry.soilMoisture}%
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Kapasitif RS485</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Tinggi Muka Air</span>
            <span className="text-xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {selectedNode.telemetry.waterTableCm} cm
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Dipwell Ultrasonik</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Suhu Gambut</span>
            <span className="text-xl font-extrabold font-mono text-amber-400 tabular-nums">
              {selectedNode.telemetry.soilTemp}°C
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Probe DS18B20</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Suhu & RH Udara</span>
            <span className="text-xl font-extrabold font-mono text-white tabular-nums">
              {selectedNode.telemetry.airTemp}° / {selectedNode.telemetry.airRh}%
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Sensor SHT31</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Gas Karbon Monoksida</span>
            <span className="text-xl font-extrabold font-mono text-rose-400 tabular-nums">
              {selectedNode.telemetry.coPpm} ppm
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Sensor Elektrokimia CO</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Partikulat PM2.5</span>
            <span className="text-xl font-extrabold font-mono text-purple-400 tabular-nums">
              {selectedNode.telemetry.pm25} µg
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Laser Optik PMS5003</span>
          </div>
        </div>

        {/* Point 22: Time-series Line Chart in pure SVG (no new library) */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">
                Grafik Deret Waktu: Kelembapan Tanah vs PM2.5 (Node {selectedNode.id})
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block"></span>
                <span>Kelembapan Tanah (%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400">
                <span className="w-3 h-1 bg-purple-400 rounded-full inline-block"></span>
                <span>Partikulat PM2.5 (µg/m³)</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 text-slate-400 select-none"
            >
              {/* Horizontal Grid lines */}
              {[0, 25, 50, 75, 100].map((level) => {
                const y = getMoistY(level);
                return (
                  <g key={level}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748b"
                      fontFamily="monospace"
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* X Axis Time Labels */}
              {timeLabels.map((t, idx) => (
                <text
                  key={idx}
                  x={getX(idx)}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {t}
                </text>
              ))}

              {/* Line 1: Kelembapan Tanah (Emerald) */}
              <path
                d={moistPathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 1 Dots */}
              {moistSeries.map((val, idx) => (
                <circle
                  key={`m-${idx}`}
                  cx={getX(idx)}
                  cy={getMoistY(val)}
                  r="3.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}

              {/* Line 2: PM2.5 (Purple) */}
              <path
                d={pm25PathD}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 2 Dots */}
              {pm25Series.map((val, idx) => (
                <circle
                  key={`p-${idx}`}
                  cx={getX(idx)}
                  cy={getPm25Y(val)}
                  r="3"
                  fill="#c084fc"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Edge AI Diagnostic Note */}
        <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Status Edge AI Mikrokontroler: <strong className="text-white font-mono">{selectedNode.edgeAiFlag}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Pembaruan terakhir: {currentTimeString}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white  p-4 rounded-2xl border border-slate-200  shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Tipe:</span>
          <div className="flex items-center gap-1">
            {['ALL', 'A_LAHAN', 'B_UDARA', 'C_CUACA'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  filterType === t
                    ? 'bg-slate-900  text-white '
                    : 'text-slate-600  hover:bg-slate-100 :bg-slate-700'
                }`}
              >
                {t === 'ALL'
                  ? 'Semua Node'
                  : t === 'A_LAHAN'
                  ? 'Sensor Lahan (A)'
                  : t === 'B_UDARA'
                  ? 'Sensor Udara (B)'
                  : 'Cuaca Mikro (C)'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari ID Node atau Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-100  text-slate-800  pl-9 pr-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Telemetry Data Grid Table */}
      <div className="bg-white  rounded-3xl border border-slate-200  shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50  text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 ">
              <tr>
                <th className="py-3 px-3">Node ID</th>
                <th className="py-3 px-3">Lokasi / Wilayah</th>
                <th className="py-3 px-3">Tipe</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Air Gambut</th>
                <th className="py-3 px-3 text-center">Lembap Tanah</th>
                <th className="py-3 px-3 text-center">Suhu Gambut</th>
                <th className="py-3 px-3 text-center">CO (ppm)</th>
                <th className="py-3 px-3 text-center">PM2.5</th>
                <th className="py-3 px-3 text-center">Baterai</th>
                <th className="py-3 px-3 text-center">RSSI</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100  font-mono">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isWarning = node.status === 'WARNING';
                const isAnomaly = node.status === 'ANOMALY';

                return (
                  <tr
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50/80  font-semibold'
                        : 'hover:bg-slate-50 :bg-slate-700/30'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900 ">
                      {node.id}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-700 ">
                      <div>
                        <span>{node.name}</span>
                        <span className="block text-[10px] text-slate-400">{node.zoneName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-500">
                      {node.nodeType === 'A_LAHAN'
                        ? 'Lahan (A)'
                        : node.nodeType === 'B_UDARA'
                        ? 'Udara (B)'
                        : 'Cuaca (C)'}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWarning
                            ? 'bg-red-100 text-red-700  '
                            : isAnomaly
                            ? 'bg-amber-100 text-amber-700  '
                            : 'bg-emerald-100 text-emerald-700  '
                        }`}
                      >
                        {node.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-cyan-600  font-bold">
                      {node.telemetry.waterTableCm} cm
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600  font-bold">
                      {node.telemetry.soilMoisture}%
                    </td>
                    <td className="py-3 px-3 text-center text-amber-600 ">
                      {node.telemetry.soilTemp}°C
                    </td>
                    <td className="py-3 px-3 text-center text-rose-600 ">
                      {node.telemetry.coPpm}
                    </td>
                    <td className="py-3 px-3 text-center text-purple-600 ">
                      {node.telemetry.pm25}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 ">
                      {node.batteryVolt}V
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500">
                      {node.rssi} dBm
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100  hover:bg-emerald-600 hover:text-white transition text-[11px] font-medium"
                      >
                        Inspeksi
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
