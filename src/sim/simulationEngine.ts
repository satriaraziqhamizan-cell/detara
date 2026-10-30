import { Zone, SensorNode, ScenarioId, RiskLevel, TrustLevel, SatelliteHotspot, CitizenReport } from '../types';

export function calculateRiskIndex(params: {
  soilMoisture: number; // % (0-100)
  waterTableCm: number; // negative cm (e.g. -50cm)
  airTemp: number; // °C
  coPpm: number; // ppm
  dryDays: number; // days without rain
}): number {
  // 1. Soil moisture score (lower moisture = higher risk)
  // safe >= 50% (score 0), critical <= 15% (score 100)
  const moistScore = Math.max(0, Math.min(100, (50 - params.soilMoisture) * (100 / 35)));

  // 2. Water table depth (threshold -40cm based on PP 57/2016 KLHK)
  // safe >= -20cm (score 0), dangerous <= -65cm (score 100)
  const waterDepth = Math.abs(params.waterTableCm);
  const waterScore = Math.max(0, Math.min(100, (waterDepth - 20) * (100 / 45)));

  // 3. Temperature score (ambient >= 35°C is high)
  const tempScore = Math.max(0, Math.min(100, (params.airTemp - 28) * (100 / 9)));

  // 4. Gas CO score (>2 ppm is smoldering indicator)
  const coScore = Math.max(0, Math.min(100, params.coPpm * 22));

  // 5. Drought days score (14 days ~ 70, 21 days = 100)
  const dryScore = Math.max(0, Math.min(100, (params.dryDays / 21) * 100));

  const weightedRisk =
    moistScore * 0.30 +
    waterScore * 0.25 +
    tempScore * 0.20 +
    coScore * 0.15 +
    dryScore * 0.10;

  return Math.round(Math.max(0, Math.min(100, weightedRisk)));
}

export function calculateTrustScore(params: {
  zoneNodes: SensorNode[];
  neighborConsistencyScore?: number; // 0 - 25
  hasHotspots: boolean;
  smokeOrFireReportsCount: number;
}): number {
  const { zoneNodes, neighborConsistencyScore = 20, hasHotspots, smokeOrFireReportsCount } = params;

  // 1. Sensor Hardware Health Component (Weight 25)
  let healthComp = 20;
  if (zoneNodes.length > 0) {
    const avgHealth = zoneNodes.reduce((acc, n) => acc + n.healthScore, 0) / zoneNodes.length;
    // Filter out penalty if an anomaly node like TJB-A-009 exists
    const hasActiveAnomaly = zoneNodes.some((n) => n.status === 'ANOMALY' || n.edgeAiFlag === 'sensor_drift');
    healthComp = Math.round((avgHealth / 100) * 25);
    if (hasActiveAnomaly) {
      healthComp = Math.max(8, healthComp - 8); // Penalize single erratic node until verified
    }
  }

  // 2. Spatial Neighbor Consistency Component (Weight 25)
  const spatialComp = Math.min(25, Math.max(5, neighborConsistencyScore));

  // 3. Time-Series Trend Consistency Component (Weight 20)
  // Assumes consistent physical progression in climate
  const trendComp = 18;

  // 4. Satellite Hotspot Confirmation Component (Weight 10)
  const satComp = hasHotspots ? 10 : 3;

  // 5. Citizen Reports Confirmation Component (Weight 20) - CRUCIAL FOR VERIFIKASI BERLAPIS
  // When citizens report Asap or Api, Trust Score jumps!
  let citizenComp = 4; // Baseline if no reports yet
  if (smokeOrFireReportsCount === 1) {
    citizenComp = 14;
  } else if (smokeOrFireReportsCount >= 2) {
    citizenComp = 20;
  }

  const totalTrust = healthComp + spatialComp + trendComp + satComp + citizenComp;
  return Math.round(Math.max(15, Math.min(100, totalTrust)));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 35) return 'Normal';
  if (score < 55) return 'Waspada';
  if (score < 75) return 'Siaga';
  return 'Awas';
}

export function getTrustLevel(score: number): TrustLevel {
  if (score < 40) return 'Rendah';
  if (score < 70) return 'Sedang';
  return 'Tinggi';
}

export function calculatePatrolPriorityScore(riskIndex: number, exposureFactor: number): number {
  return Math.round(Math.min(100, riskIndex * exposureFactor));
}

/**
 * Computes all zone metrics dynamically from underlying nodes, weather, hotspots, and reports
 */
export function computeZoneMetrics(
  zone: Zone,
  nodes: SensorNode[],
  dryDays: number,
  hotspots: SatelliteHotspot[],
  reports: CitizenReport[]
): Zone {
  const zoneNodes = nodes.filter((n) => n.zoneId === zone.id);
  const zoneHotspots = hotspots.filter((h) => h.zoneId === zone.id);
  const zoneReports = reports.filter((r) => r.zoneId === zone.id);
  const smokeOrFireReports = zoneReports.filter((r) => r.condition === 'Asap' || r.condition === 'Api');

  let avgMoist = zone.soilMoistureAvg;
  let avgWater = zone.waterLevelAvg;
  let avgSoilTemp = zone.soilTempAvg;
  let avgAirTemp = 32;
  let avgCo = zone.coAvg;
  let avgPm25 = zone.pm25Avg;

  if (zoneNodes.length > 0) {
    // Only average nodes that are not disconnected
    const validNodes = zoneNodes.filter((n) => n.status !== 'OFFLINE');
    if (validNodes.length > 0) {
      avgMoist = +(validNodes.reduce((a, b) => a + b.telemetry.soilMoisture, 0) / validNodes.length).toFixed(1);
      avgWater = +(validNodes.reduce((a, b) => a + b.telemetry.waterTableCm, 0) / validNodes.length).toFixed(1);
      avgSoilTemp = +(validNodes.reduce((a, b) => a + b.telemetry.soilTemp, 0) / validNodes.length).toFixed(1);
      avgAirTemp = +(validNodes.reduce((a, b) => a + b.telemetry.airTemp, 0) / validNodes.length).toFixed(1);
      avgCo = +(validNodes.reduce((a, b) => a + b.telemetry.coPpm, 0) / validNodes.length).toFixed(1);
      avgPm25 = +(validNodes.reduce((a, b) => a + b.telemetry.pm25, 0) / validNodes.length).toFixed(0);
    }
  }

  const riskIndex = calculateRiskIndex({
    soilMoisture: avgMoist,
    waterTableCm: avgWater,
    airTemp: avgAirTemp,
    coPpm: avgCo,
    dryDays
  });

  const trustScore = calculateTrustScore({
    zoneNodes,
    neighborConsistencyScore: 20,
    hasHotspots: zoneHotspots.length > 0,
    smokeOrFireReportsCount: smokeOrFireReports.length
  });

  const riskLevel = getRiskLevel(riskIndex);
  const trustLevel = getTrustLevel(trustScore);
  const patrolPriorityScore = calculatePatrolPriorityScore(riskIndex, zone.exposureFactor);

  return {
    ...zone,
    soilMoistureAvg: avgMoist,
    waterLevelAvg: avgWater,
    soilTempAvg: avgSoilTemp,
    coAvg: avgCo,
    pm25Avg: avgPm25,
    riskIndex,
    riskLevel,
    trustScore,
    trustLevel,
    patrolPriorityScore,
    activeHotspotsCount: zoneHotspots.length,
    activeReportsCount: zoneReports.length
  };
}

export interface ScenarioPreset {
  id: ScenarioId;
  name: string;
  tagline: string;
  description: string;
  dryDays: number;
  highlightZone: string;
  nodesModifier: (nodes: SensorNode[]) => SensorNode[];
}

export const SCENARIO_PRESETS: Record<ScenarioId, ScenarioPreset> = {
  normal: {
    id: 'normal',
    name: '1. Kondisi Normal (Musim Hujan/Aman)',
    tagline: 'Semua zona aman, kelembapan tanah tinggi, sistem hemat daya LoRa',
    description: 'Kondisi dasar: tanah basah (>50%), tinggi muka air kanal stabil (-15 hingga -25 cm), tidak ada titik panas satelit, PM2.5 baik. Interval pengiriman LoRa hemat daya setiap 30–60 menit.',
    dryDays: 1,
    highlightZone: 'zone-dendang',
    nodesModifier: (nodes) =>
      nodes.map((n) => ({
        ...n,
        status: n.id === 'TJB-A-009' ? 'ANOMALY' : 'ONLINE',
        edgeAiFlag: n.id === 'TJB-A-009' ? 'sensor_drift' : 'normal',
        telemetry: {
          ...n.telemetry,
          soilMoisture: n.id === 'TJB-A-009' ? 14 : 54,
          soilTemp: n.id === 'TJB-A-009' ? 42.0 : 29.5,
          airTemp: 30.0,
          waterTableCm: -20,
          coPpm: 0.1,
          pm25: 20,
          rainfallMm: 5
        }
      }))
  },

  kemarau: {
    id: 'kemarau',
    name: '2. Kemarau Meningkat (Hari ke-14)',
    tagline: 'Muka air tanah turun, risiko naik ke Waspada & Siaga, LoRa adaptif aktif',
    description: 'Hari ke-14 tanpa hujan di Jambi timur. Suhu harian mencapai 35°C, kelembapan tanah gambut anjlok ke 30%, muka air tanah turun di bawah batas aman -40 cm. Edge AI di node otomatis mempercepat frekuensi kirim LoRa dari 30 menit ke 5 menit.',
    dryDays: 14,
    highlightZone: 'zone-kumpeh',
    nodesModifier: (nodes) =>
      nodes.map((n) => {
        if (n.zoneId === 'zone-kumpeh' || n.zoneId === 'zone-dendang') {
          return {
            ...n,
            status: 'ONLINE',
            edgeAiFlag: 'rate_of_change_alert',
            telemetry: {
              ...n.telemetry,
              soilMoisture: 30,
              soilTemp: 35.5,
              airTemp: 35.2,
              waterTableCm: -46,
              coPpm: 1.1,
              pm25: 64,
              rainfallMm: 0
            }
          };
        }
        return {
          ...n,
          status: 'ONLINE',
          edgeAiFlag: 'normal',
          telemetry: {
            ...n.telemetry,
            soilMoisture: 38,
            soilTemp: 32.5,
            airTemp: 33.0,
            waterTableCm: -36,
            coPpm: 0.4,
            pm25: 40,
            rainfallMm: 0
          }
        };
      })
  },

  awas: {
    id: 'awas',
    name: '3. Awas Terverifikasi (Verifikasi Berlapis)',
    tagline: 'Titik asap terdeteksi, warga lapor, Trust Score melonjak -> Groundcheck Otomatis!',
    description: 'Skenario klimaks pembuktian inovasi: Node TJT-A-014 mendeteksi anomali CO & suhu tinggi di Dendang. Laporan warga MPA masuk dengan foto kepulan asap. Trust Score melonjak tinggi setelah ada konfirmasi warga. Sistem langsung menaikkan status ke AWAS dan menugaskan Groundcheck ke Regu Manggala Agni Daops Jambi.',
    dryDays: 21,
    highlightZone: 'zone-dendang',
    nodesModifier: (nodes) =>
      nodes.map((n) => {
        if (n.id === 'TJT-A-014') {
          return {
            ...n,
            status: 'WARNING',
            edgeAiFlag: 'rate_of_change_alert',
            telemetry: {
              ...n.telemetry,
              soilMoisture: 18,
              soilTemp: 39.0,
              airTemp: 36.8,
              waterTableCm: -64,
              coPpm: 4.8,
              pm25: 118,
              rainfallMm: 0
            }
          };
        }
        if (n.zoneId === 'zone-dendang') {
          return {
            ...n,
            status: 'WARNING',
            edgeAiFlag: 'anomaly_local',
            telemetry: {
              ...n.telemetry,
              soilMoisture: 22,
              soilTemp: 36.5,
              airTemp: 35.4,
              waterTableCm: -56,
              coPpm: 2.2,
              pm25: 92,
              rainfallMm: 0
            }
          };
        }
        if (n.zoneId === 'zone-kumpeh') {
          return {
            ...n,
            status: 'ONLINE',
            edgeAiFlag: 'rate_of_change_alert',
            telemetry: {
              ...n.telemetry,
              soilMoisture: 28,
              soilTemp: 35.4,
              airTemp: 34.6,
              waterTableCm: -46,
              coPpm: 1.4,
              pm25: 70,
              rainfallMm: 0
            }
          };
        }
        return n;
      })
  }
};
