export type RiskLevel = 'Normal' | 'Waspada' | 'Siaga' | 'Awas';
export type TrustLevel = 'Rendah' | 'Sedang' | 'Tinggi';
export type ScenarioId = 'normal' | 'kemarau' | 'awas';
export type AppViewMode = 'welcome' | 'warga' | 'petugas' | 'tentang';

export interface Zone {
  id: string;
  name: string;
  regency: string; // Muaro Jambi, Tanjab Barat, Tanjab Timur, dll
  peatType: 'Gambut Dalam' | 'Gambut Dangkal' | 'Lahan Mineral';
  riskIndex: number; // 0 - 100
  riskLevel: RiskLevel;
  trustScore: number; // 0 - 100
  trustLevel: TrustLevel;
  patrolPriorityScore: number; // Risk * Exposure
  exposureFactor: number; // 0.5 - 1.5
  populationNear: number;
  farmlandHectares: number;
  nearestWaterSource: string;
  waterLevelAvg: number; // cm (e.g. -45 cm)
  soilMoistureAvg: number; // %
  soilTempAvg: number; // °C
  coAvg: number; // ppm
  pm25Avg: number; // µg/m³
  activeHotspotsCount: number;
  activeReportsCount: number;
  lastUpdated: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
}

export type NodeType = 'A_LAHAN' | 'B_UDARA' | 'C_CUACA';

export interface SensorNode {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  nodeType: NodeType;
  status: 'ONLINE' | 'WARNING' | 'ANOMALY' | 'OFFLINE';
  batteryVolt: number; // 3.2V - 4.2V
  batteryPercent: number;
  rssi: number; // -120 to -60 dBm
  lastSeen: string;
  firmwareVersion: string;
  edgeAiFlag: 'normal' | 'rate_of_change_alert' | 'anomaly_local' | 'sensor_drift';
  coordinates: { x: number; y: number; lat: number; lng: number };
  telemetry: {
    soilMoisture: number; // % (0-100)
    soilTemp: number; // °C
    airTemp: number; // °C
    airRh: number; // % (humidity)
    waterTableCm: number; // cm depth relative to surface (negative)
    coPpm: number; // ppm
    pm25: number; // µg/m³
    pm10: number; // µg/m³
    rainfallMm: number; // mm in last 24h
    windSpeedKmh: number; // km/h
    windDirection: string; // N, NE, E, etc.
  };
  healthScore: number; // 0-100
}

export interface SatelliteHotspot {
  id: string;
  satellite: 'NOAA-20 / VIIRS' | 'Terra / MODIS' | 'Aqua / MODIS';
  confidence: 'Low' | 'Nominal' | 'High';
  brightnessKelvin: number;
  frpMw: number; // Fire Radiative Power (MW)
  timestamp: string;
  zoneId: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
}

export interface CitizenReport {
  id: string;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  condition: 'Aman' | 'Asap' | 'Api';
  reporterType: 'Warga' | 'Anggota MPA' | 'Petani';
  notes: string;
  photoUrl?: string;
  status: 'Terkirim' | 'Terverifikasi' | 'Dalam Penanganan' | 'Selesai';
  coordinates: { x: number; y: number; lat: number; lng: number };
  syncStatus: 'synced' | 'pending';
}

export interface FieldTask {
  id: string;
  title: string;
  zoneId: string;
  zoneName: string;
  assignedTeam: 'Regu Manggala Agni Daops Jambi' | 'TRC BPBD Prov. Jambi' | 'MPA Desa Mandiri';
  priority: 'Biasa' | 'Tinggi' | 'Darurat';
  status: 'Ditugaskan' | 'Sedang Groundcheck' | 'Penanganan Selesai';
  reportRefId?: string;
  createdAt: string;
  targetNodeId?: string;
  notes: string;
  waterSourceUsed?: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  level: RiskLevel;
  zoneName: string;
  timestamp: string;
  message: string;
  actionRecommendation: string;
  channels: ('App Push' | 'WhatsApp Bot' | 'SMS Gateway' | 'Sirine Desa')[];
  acknowledged: boolean;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Mitigasi' | 'Kesehatan' | 'Pertanian' | 'Regulasi';
  readTime: string;
  summary: string;
  content: string;
  practicalTips: string[];
}
