import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { SensorNode, SatelliteHotspot, CitizenReport, Zone } from '../../types';
import {
  Layers,
  Flame,
  Radio,
  Eye,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Wind,
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface GISMapProps {
  interactive?: boolean;
  height?: string;
  showAllControls?: boolean;
  onSelectNode?: (node: SensorNode) => void;
  onSelectZone?: (zone: Zone) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  interactive = true,
  height = 'h-[500px]',
  showAllControls = true,
  onSelectNode,
  onSelectZone
}) => {
  const {
    zones,
    nodes,
    hotspots,
    reports,
    selectedZone,
    setSelectedZoneId,
    scenario
  } = useApp();

  // Layer toggles
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showReports, setShowReports] = useState<boolean>(true);
  const [showCanals, setShowCanals] = useState<boolean>(true);
  const [showPatrolRoute, setShowPatrolRoute] = useState<boolean>(true);

  // Map viewport pan & zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected item popover
  const [activePopover, setActivePopover] = useState<{
    type: 'node' | 'hotspot' | 'report' | 'zone';
    data: any;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.8, Math.min(2.5, +(prev + delta).toFixed(2))));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePopover(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Awas':
        return { fill: '#ef4444', stroke: '#b91c1c', bgClass: 'bg-red-500' };
      case 'Siaga':
        return { fill: '#f97316', stroke: '#c2410c', bgClass: 'bg-orange-500' };
      case 'Waspada':
        return { fill: '#eab308', stroke: '#a16207', bgClass: 'bg-yellow-500' };
      default:
        return { fill: '#10b981', stroke: '#047857', bgClass: 'bg-emerald-500' };
    }
  };

  return (
    <div className={`relative w-full ${height} bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 select-none shadow-inner`}>
      {/* Top Map Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 pointer-events-auto shadow-md">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white">Peta SIG Jambi</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">103.2° – 104.2° BT</span>
        </div>

        {/* Layer Toggle Strip */}
        {showAllControls && (
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 pointer-events-auto shadow-md text-xs">
            <button
              onClick={() => setShowSensors((v) => !v)}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showSensors ? 'bg-emerald-600/90 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Sensor ({nodes.length})</span>
            </button>
            <button
              onClick={() => setShowHotspots((v) => !v)}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showHotspots ? 'bg-amber-600/90 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hotspot ({hotspots.length})</span>
            </button>
            <button
              onClick={() => setShowReports((v) => !v)}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showReports ? 'bg-blue-600/90 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Laporan ({reports.length})</span>
            </button>
            <button
              onClick={() => setShowCanals((v) => !v)}
              className={`px-2 py-1 rounded-lg hidden sm:flex items-center gap-1 transition-colors ${
                showCanals ? 'bg-cyan-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Kanal Air</span>
            </button>
            <button
              onClick={() => setShowPatrolRoute((v) => !v)}
              className={`px-2 py-1 rounded-lg hidden md:flex items-center gap-1 transition-colors ${
                showPatrolRoute ? 'bg-purple-700 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Rute Patroli</span>
            </button>
          </div>
        )}

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 pointer-events-auto shadow-md">
          <button
            onClick={() => handleZoom(0.2)}
            title="Perbesar"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            title="Perkecil"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Tampilan"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            {/* Peatland Texture Gradient */}
            <radialGradient id="peatGradient" cx="60%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>
            {/* Glowing Fire Pulse */}
            <filter id="firePulse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="500" fill="#0b1329" />
          <rect width="800" height="500" fill="url(#grid)" />

          {/* Coastline / River Batanghari Line */}
          <path
            d="M 120 480 Q 280 430 360 380 T 480 340 T 620 300 T 780 260"
            fill="none"
            stroke="#0284c7"
            strokeWidth="7"
            opacity="0.35"
          />
          <text x="730" y="250" fill="#38bdf8" fontSize="9" opacity="0.6">Selat Berhala</text>

          {/* Peat Hydrological Units (KHG) Multi-Polygon Zones */}
          {zones.map((zone) => {
            const riskColors = getRiskColor(zone.riskLevel);
            const isSelected = selectedZone.id === zone.id;

            // Generate polygon shape around zone coordinates
            const cx = zone.coordinates.x;
            const cy = zone.coordinates.y;
            const radius = 64;

            return (
              <g
                key={zone.id}
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZoneId(zone.id);
                  if (onSelectZone) onSelectZone(zone);
                  setActivePopover({
                    type: 'zone',
                    data: zone,
                    x: cx,
                    y: cy
                  });
                }}
              >
                {/* Peat Area Bubble */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={radius}
                  ry={radius * 0.75}
                  fill={riskColors.fill}
                  fillOpacity={isSelected ? 0.32 : 0.18}
                  stroke={isSelected ? '#ffffff' : riskColors.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray={zone.peatType === 'Gambut Dalam' ? 'none' : '4 3'}
                />

                {/* Risk Level Badge & Zone Name */}
                <text
                  x={cx}
                  y={cy - 24}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  className="drop-shadow-md pointer-events-none"
                >
                  {zone.name.split(' ')[0]}
                </text>
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  fill={riskColors.fill}
                  fontSize="9.5"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {zone.riskLevel} ({zone.riskIndex})
                </text>
              </g>
            );
          })}

          {/* Primary & Secondary Canals (Canal Blocking Network) */}
          {showCanals && (
            <g opacity="0.75">
              {/* Canal Dendang to Berbak */}
              <path
                d="M 520 250 L 550 280 L 590 340 L 620 410"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              {/* Sekat Kanal symbols */}
              <circle cx="535" cy="265" r="3.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
              <circle cx="570" cy="310" r="3.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
              <circle cx="605" cy="375" r="3.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
              {/* Canal Kumpeh */}
              <path
                d="M 340 320 L 380 350 L 430 380"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <circle cx="380" cy="350" r="3.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1" />
              {/* Canal Betara */}
              <path
                d="M 230 170 L 260 190 L 300 210"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
            </g>
          )}

          {/* Recommended Fast Patrol Route */}
          {showPatrolRoute && scenario !== 'normal' && (
            <g>
              <path
                d="M 370 340 L 460 290 L 540 275 L 565 290"
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
              {/* Patrol vehicle position */}
              <circle cx="490" cy="284" r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
              <text x="490" y="272" fill="#d8b4fe" fontSize="8.5" textAnchor="middle" fontWeight="bold">
                Armada Patroli Daops
              </text>
            </g>
          )}

          {/* Sensor Nodes Layer */}
          {showSensors &&
            nodes.map((node) => {
              const isWarning = node.status === 'WARNING';
              const isAnomaly = node.status === 'ANOMALY';
              const isSelected = selectedZone.id === node.zoneId;

              let markerColor = '#10b981'; // green
              if (isWarning) markerColor = '#ef4444'; // red
              if (isAnomaly) markerColor = '#f59e0b'; // amber

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectNode) onSelectNode(node);
                    setSelectedZoneId(node.zoneId);
                    setActivePopover({
                      type: 'node',
                      data: node,
                      x: node.coordinates.x,
                      y: node.coordinates.y
                    });
                  }}
                >
                  {/* Warning radar pulse */}
                  {isWarning && (
                    <circle
                      cx={node.coordinates.x}
                      cy={node.coordinates.y}
                      r="16"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer base */}
                  <circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r={isSelected ? 8 : 6}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />

                  {/* Inner dot */}
                  <circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r="2.5"
                    fill="#0f172a"
                  />

                  {/* Node ID label */}
                  <text
                    x={node.coordinates.x}
                    y={node.coordinates.y + 16}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="8"
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}

          {/* Satellite Hotspots Layer */}
          {showHotspots &&
            hotspots.map((hs) => (
              <g
                key={hs.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopover({
                    type: 'hotspot',
                    data: hs,
                    x: hs.coordinates.x,
                    y: hs.coordinates.y
                  });
                }}
              >
                <circle
                  cx={hs.coordinates.x}
                  cy={hs.coordinates.y}
                  r="12"
                  fill="#f97316"
                  opacity="0.3"
                  className="animate-pulse"
                />
                <circle
                  cx={hs.coordinates.x}
                  cy={hs.coordinates.y}
                  r="5"
                  fill="#ea580c"
                  stroke="#ffedd5"
                  strokeWidth="1.5"
                />
                <text
                  x={hs.coordinates.x}
                  y={hs.coordinates.y - 8}
                  textAnchor="middle"
                  fill="#fdba74"
                  fontSize="8"
                  fontWeight="bold"
                >
                  VIIRS {hs.frpMw} MW
                </text>
              </g>
            ))}

          {/* Citizen Reports Layer */}
          {showReports &&
            reports.map((rep) => {
              const isFire = rep.condition === 'Api';
              const isSmoke = rep.condition === 'Asap';
              const iconColor = isFire ? '#dc2626' : isSmoke ? '#eab308' : '#10b981';

              return (
                <g
                  key={rep.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopover({
                      type: 'report',
                      data: rep,
                      x: rep.coordinates.x,
                      y: rep.coordinates.y
                    });
                  }}
                >
                  <rect
                    x={rep.coordinates.x - 7}
                    y={rep.coordinates.y - 7}
                    width="14"
                    height="14"
                    rx="3"
                    fill={iconColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={rep.coordinates.x}
                    y={rep.coordinates.y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {isFire ? '!' : isSmoke ? '~' : '✓'}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Interactive Popover Modal / Inspection Sheet */}
      {activePopover && (
        <div
          className="absolute z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-slate-100 max-w-xs animate-in fade-in zoom-in-95 duration-150"
          style={{
            bottom: '16px',
            right: '16px'
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                {activePopover.type === 'node'
                  ? `IoT Node Telemetry`
                  : activePopover.type === 'hotspot'
                  ? `Satelit Hotspot Deteksi`
                  : activePopover.type === 'report'
                  ? `Laporan Komunitas Warga`
                  : `Wilayah Gambut`}
              </div>
              <h4 className="text-sm font-semibold text-white">
                {activePopover.type === 'node'
                  ? activePopover.data.name
                  : activePopover.type === 'hotspot'
                  ? `${activePopover.data.satellite} (${activePopover.data.confidence})`
                  : activePopover.type === 'report'
                  ? `${activePopover.data.reporterType}: ${activePopover.data.condition}`
                  : activePopover.data.name}
              </h4>
            </div>
            <button
              onClick={() => setActivePopover(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md text-xs"
            >
              ✕
            </button>
          </div>

          {activePopover.type === 'node' && (
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2 rounded-lg font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Kelembapan Tanah:</span>
                  <span className="text-emerald-400 font-bold">{activePopover.data.telemetry.soilMoisture}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Muka Air Tanah:</span>
                  <span className="text-cyan-400 font-bold">{activePopover.data.telemetry.waterTableCm} cm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Suhu Udara:</span>
                  <span className="text-amber-400 font-bold">{activePopover.data.telemetry.airTemp}°C</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gas CO:</span>
                  <span className="text-rose-400 font-bold">{activePopover.data.telemetry.coPpm} ppm</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Baterai: {activePopover.data.batteryPercent}% ({activePopover.data.batteryVolt}V)</span>
                <span>Sinyal: {activePopover.data.rssi} dBm</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Status Edge AI: <span className="text-white font-mono">{activePopover.data.edgeAiFlag}</span>
              </div>
            </div>
          )}

          {activePopover.type === 'hotspot' && (
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300">
                Kecerahan Termal: <span className="font-mono text-white">{activePopover.data.brightnessKelvin} K</span>
              </p>
              <p className="text-slate-300">
                Fire Radiative Power: <span className="font-mono text-amber-400 font-bold">{activePopover.data.frpMw} MW</span>
              </p>
              <p className="text-slate-400 text-[11px]">Waktu Deteksi: {activePopover.data.timestamp}</p>
            </div>
          )}

          {activePopover.type === 'report' && (
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-200 italic">"{activePopover.data.notes}"</p>
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Status: <span className="text-emerald-400 font-medium">{activePopover.data.status}</span></span>
                <span>{activePopover.data.timestamp}</span>
              </div>
            </div>
          )}

          {activePopover.type === 'zone' && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Indeks Risiko:</span>
                <span className="font-bold text-rose-400 font-mono">{activePopover.data.riskIndex}/100 ({activePopover.data.riskLevel})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Trust Score:</span>
                <span className="font-bold text-emerald-400 font-mono">{activePopover.data.trustScore}% ({activePopover.data.trustLevel})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sumber Air Terdekat:</span>
                <span className="text-cyan-300 truncate max-w-[140px]">{activePopover.data.nearestWaterSource}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Waspada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Siaga</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Awas</span>
        </div>
        <div className="border-l border-slate-700 pl-2 flex items-center gap-1 text-slate-400">
          <span>Data Simulasi Demonstrasi</span>
        </div>
      </div>
    </div>
  );
};
