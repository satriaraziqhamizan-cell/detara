import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  Zone,
  SensorNode,
  SatelliteHotspot,
  CitizenReport,
  FieldTask,
  AlertNotification,
  ScenarioId,
  AppViewMode
} from '../types';
import {
  INITIAL_ZONES,
  INITIAL_NODES,
  INITIAL_HOTSPOTS,
  INITIAL_REPORTS,
  INITIAL_TASKS,
  INITIAL_ALERTS
} from '../data/mockDatabase';
import {
  SCENARIO_PRESETS,
  computeZoneMetrics
} from '../sim/simulationEngine';
import {
  saveOfflineReport,
  getAllOfflineReports,
  clearAllOfflineReports,
  deleteOfflineReport,
  compressImage
} from '../services/offlineStorage';
import { useAuth } from './authContext';
import {
  saveReportToFirestore,
  fetchReportsFromFirestore,
  updateReportStatusInFirestore
} from '../services/firebase';

interface AppContextType {
  mode: AppViewMode;
  setMode: (mode: AppViewMode) => void;
  scenario: ScenarioId;
  setScenario: (scenario: ScenarioId) => void;
  isTransitioningScenario: boolean;
  transitionProgress: number; // 0 to 100
  resetDemo: () => void;
  zones: Zone[];
  nodes: SensorNode[];
  hotspots: SatelliteHotspot[];
  reports: CitizenReport[];
  tasks: FieldTask[];
  alerts: AlertNotification[];
  selectedZone: Zone;
  setSelectedZoneId: (id: string) => void;
  isOnline: boolean;
  setIsOnlineManual: (online: boolean) => void;
  offlineQueueCount: number;
  addCitizenReport: (report: Omit<CitizenReport, 'id' | 'timestamp' | 'status' | 'syncStatus'>) => Promise<boolean>;
  confirmCondition: (zoneId: string, condition: 'Aman' | 'Asap' | 'Api') => void;
  updateReportStatus: (reportId: string, status: CitizenReport['status']) => Promise<void>;
  createFieldTask: (task: Omit<FieldTask, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: FieldTask['status']) => void;
  acknowledgeAlert: (alertId: string) => void;
  broadcastAlert: (alert: Omit<AlertNotification, 'id' | 'timestamp' | 'acknowledged'>) => void;
  retriggerAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  isSimulatingTime: boolean;
  toggleTimeSimulation: () => void;
  currentTimeString: string;
  isMobileFrameSimulated: boolean;
  setIsMobileFrameSimulated: (sim: boolean) => void;
  activeToast: string | null;
  showToast: (msg: string) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  isDemoSheetOpen: boolean;
  setIsDemoSheetOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authMode, user, profile } = useAuth();

  // Initial view mode: welcome screen
  const [mode, setModeState] = useState<AppViewMode>('welcome');

  // Strict route guard enforcing: Warga can NEVER access Petugas
  const setMode = useCallback((newMode: AppViewMode) => {
    if (newMode === 'petugas' && authMode === 'warga') {
      showToast('Akses dibatasi: Halaman Petugas hanya untuk akun resmi Petugas.');
      setModeState('warga');
      return;
    }
    setModeState(newMode);
  }, [authMode]);

  // Default scenario: normal
  const [scenario, setScenarioState] = useState<ScenarioId>('normal');
  const [isSimulatingTime, setIsSimulatingTime] = useState<boolean>(true);
  const [isMobileFrameSimulated, setIsMobileFrameSimulated] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isDemoSheetOpen, setIsDemoSheetOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Transition state for smooth 6-10s interpolation
  const [isTransitioningScenario, setIsTransitioningScenario] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(100);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Network connectivity state with offline test toggle
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [forceOffline, setForceOffline] = useState<boolean>(false);
  const isOnline = browserOnline && !forceOffline;

  // Base data initialized to NORMAL scenario
  const initialNormalNodes = SCENARIO_PRESETS.normal.nodesModifier(INITIAL_NODES);
  const [nodes, setNodes] = useState<SensorNode[]>(initialNormalNodes);
  const [hotspots, setHotspots] = useState<SatelliteHotspot[]>([]); // Normal = no hotspots
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);
  const [tasks, setTasks] = useState<FieldTask[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-dendang');
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Calculate dynamic zones from nodes & scenario
  const [zones, setZones] = useState<Zone[]>(() => {
    return INITIAL_ZONES.map((z) => computeZoneMetrics(z, initialNormalNodes, 1, [], INITIAL_REPORTS));
  });

  const showToast = useCallback((msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((curr) => (curr === msg ? null : curr));
    }, 4000);
  }, []);

  // Sync offline queue using idb and Firestore
  const refreshOfflineCount = useCallback(async () => {
    try {
      const offlineItems = await getAllOfflineReports();
      setOfflineQueueCount(offlineItems.length);
    } catch {
      // ignore
    }
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    try {
      const offlineItems = await getAllOfflineReports();
      if (offlineItems.length > 0) {
        if (authMode !== 'demo' && user) {
          // Sync directly to Firestore for authenticated Warga
          for (const item of offlineItems) {
            try {
              await saveReportToFirestore(
                { ...item, status: 'Terverifikasi', syncStatus: 'synced' },
                user.uid,
                profile?.name,
                profile?.phone
              );
              await deleteOfflineReport(item.id);
            } catch (fsErr) {
              console.warn('Sync to Firestore deferred:', fsErr);
            }
          }
        }

        const synced = offlineItems.map((r) => ({
          ...r,
          syncStatus: 'synced' as const,
          status: 'Terverifikasi' as const
        }));
        setReports((prev) => [...synced, ...prev]);
        await clearAllOfflineReports();
        setOfflineQueueCount(0);
        showToast(`${synced.length} laporan dari antrean offline berhasil dikirim ke Command Center!`);
      }
    } catch (e) {
      console.error('Error syncing offline reports:', e);
    }
  }, [authMode, user, profile, showToast]);

  // Load Firestore reports on auth role change
  useEffect(() => {
    let isMounted = true;
    const loadFirestoreReports = async () => {
      if (authMode === 'demo' || !authMode) {
        setReports(INITIAL_REPORTS);
        return;
      }

      if (user && (authMode === 'warga' || authMode === 'petugas')) {
        try {
          const liveReports = await fetchReportsFromFirestore(authMode, user.uid);
          if (isMounted && liveReports.length > 0) {
            // Merge with base simulation reports, keeping live ones first
            setReports((prev) => {
              const liveIds = new Set(liveReports.map((r) => r.id));
              const filteredPrev = prev.filter((r) => !liveIds.has(r.id));
              return [...liveReports, ...filteredPrev];
            });
          }
        } catch (err) {
          console.warn('Could not fetch Firestore reports:', err);
        }
      }
    };

    loadFirestoreReports();
    return () => {
      isMounted = false;
    };
  }, [authMode, user]);

  // Network listener & auto sync
  useEffect(() => {
    refreshOfflineCount();

    const handleOnline = () => {
      setBrowserOnline(true);
      showToast('Koneksi internet kembali aktif. Menyinkronkan antrean...');
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setBrowserOnline(false);
      showToast('Mode Offline aktif. Laporan akan disimpan di antrean lokal.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshOfflineCount, syncOfflineQueue, showToast]);

  useEffect(() => {
    if (isOnline) {
      syncOfflineQueue();
    }
  }, [isOnline, syncOfflineQueue]);

  // Recompute zones whenever nodes, hotspots, reports, or scenario change
  const recalculateZones = useCallback(
    (currentNodes: SensorNode[], currentHotspots: SatelliteHotspot[], currentReports: CitizenReport[], dryDays: number) => {
      setZones((prevZones) =>
        prevZones.map((z) => computeZoneMetrics(z, currentNodes, dryDays, currentHotspots, currentReports))
      );
    },
    []
  );

  // Smooth 8-second interpolation between scenarios
  const applyScenario = useCallback(
    (newScenId: ScenarioId) => {
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current);
      }

      setScenarioState(newScenId);
      const targetPreset = SCENARIO_PRESETS[newScenId];
      setSelectedZoneId(targetPreset.highlightZone);

      // Target nodes
      const targetNodes = targetPreset.nodesModifier(INITIAL_NODES);
      const targetHotspots =
        newScenId === 'normal'
          ? []
          : newScenId === 'kemarau'
          ? [INITIAL_HOTSPOTS[2]]
          : INITIAL_HOTSPOTS;

      setHotspots(targetHotspots);

      const totalSteps = 8;
      let currentStep = 0;
      setIsTransitioningScenario(true);
      setTransitionProgress(0);

      const startNodes = [...nodes];
      const startDryDays = scenario === 'normal' ? 1 : scenario === 'kemarau' ? 14 : 21;
      const targetDryDays = targetPreset.dryDays;

      transitionTimerRef.current = setInterval(() => {
        currentStep += 1;
        const progress = Math.min(1, currentStep / totalSteps);
        setTransitionProgress(Math.round(progress * 100));

        const interpolatedDryDays = Math.round(startDryDays + (targetDryDays - startDryDays) * progress);

        const updatedNodes = startNodes.map((sNode) => {
          const tNode = targetNodes.find((tn) => tn.id === sNode.id) || sNode;
          const moist = +(sNode.telemetry.soilMoisture + (tNode.telemetry.soilMoisture - sNode.telemetry.soilMoisture) * progress).toFixed(1);
          const water = +(sNode.telemetry.waterTableCm + (tNode.telemetry.waterTableCm - sNode.telemetry.waterTableCm) * progress).toFixed(1);
          const sTemp = +(sNode.telemetry.soilTemp + (tNode.telemetry.soilTemp - sNode.telemetry.soilTemp) * progress).toFixed(1);
          const aTemp = +(sNode.telemetry.airTemp + (tNode.telemetry.airTemp - sNode.telemetry.airTemp) * progress).toFixed(1);
          const co = +(sNode.telemetry.coPpm + (tNode.telemetry.coPpm - sNode.telemetry.coPpm) * progress).toFixed(1);
          const pm = Math.round(sNode.telemetry.pm25 + (tNode.telemetry.pm25 - sNode.telemetry.pm25) * progress);

          return {
            ...sNode,
            status: progress > 0.6 ? tNode.status : sNode.status,
            edgeAiFlag: progress > 0.5 ? tNode.edgeAiFlag : sNode.edgeAiFlag,
            telemetry: {
              ...sNode.telemetry,
              soilMoisture: moist,
              waterTableCm: water,
              soilTemp: sTemp,
              airTemp: aTemp,
              coPpm: co,
              pm25: pm
            }
          };
        });

        setNodes(updatedNodes);
        recalculateZones(updatedNodes, targetHotspots, reports, interpolatedDryDays);

        if (currentStep >= totalSteps) {
          if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
          setIsTransitioningScenario(false);
          setTransitionProgress(100);
          showToast(`Skenario beralih ke: ${targetPreset.name}`);
        }
      }, 1000);
    },
    [nodes, scenario, reports, recalculateZones, showToast]
  );

  // Reset Demo returns to NORMAL
  const resetDemo = useCallback(() => {
    if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
    setIsTransitioningScenario(false);
    setTransitionProgress(100);

    setScenarioState('normal');
    const normalNodes = SCENARIO_PRESETS.normal.nodesModifier(INITIAL_NODES);
    setNodes(normalNodes);
    setHotspots([]);
    setReports(INITIAL_REPORTS);
    setTasks(INITIAL_TASKS);
    setAlerts(INITIAL_ALERTS);
    recalculateZones(normalNodes, [], INITIAL_REPORTS, 1);
    clearAllOfflineReports().then(() => setOfflineQueueCount(0));
    showToast('Demo telah direset ke Skenario 1: Normal');
  }, [recalculateZones, showToast]);

  // Micro-fluctuation simulation timer
  useEffect(() => {
    if (!isSimulatingTime || isTransitioningScenario) return;

    const interval = setInterval(() => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map((node) => {
          if (node.status === 'OFFLINE' || node.status === 'ANOMALY') return node;
          const jitterMoist = (Math.random() - 0.5) * 0.3;
          const jitterTemp = (Math.random() - 0.5) * 0.15;
          const newMoist = Math.max(10, Math.min(95, +(node.telemetry.soilMoisture + jitterMoist).toFixed(1)));
          const newTemp = Math.max(24, Math.min(48, +(node.telemetry.airTemp + jitterTemp).toFixed(1)));
          return {
            ...node,
            lastSeen: 'Baru saja',
            telemetry: {
              ...node.telemetry,
              soilMoisture: newMoist,
              airTemp: newTemp
            }
          };
        });
        const dryDays = scenario === 'normal' ? 1 : scenario === 'kemarau' ? 14 : 21;
        recalculateZones(nextNodes, hotspots, reports, dryDays);
        return nextNodes;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingTime, isTransitioningScenario, scenario, hotspots, reports, recalculateZones]);

  // Selected Zone object
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Citizen Report Submission
  const addCitizenReport = async (
    data: Omit<CitizenReport, 'id' | 'timestamp' | 'status' | 'syncStatus'>
  ): Promise<boolean> => {
    let processedPhoto = data.photoUrl;
    if (processedPhoto && processedPhoto.startsWith('data:image')) {
      try {
        processedPhoto = await compressImage(processedPhoto);
      } catch (err) {
        console.warn('Compression failed, using original:', err);
      }
    }

    const newReport: CitizenReport = {
      ...data,
      photoUrl: processedPhoto,
      id: `LAP-${Date.now().toString().slice(-4)}`,
      timestamp: 'Baru saja',
      status: isOnline ? 'Terverifikasi' : 'Terkirim',
      syncStatus: isOnline ? 'synced' : 'pending'
    };

    if (!isOnline) {
      await saveOfflineReport(newReport);
      await refreshOfflineCount();
      showToast('Offline: Laporan disimpan di IndexedDB HP & akan dikirim otomatis saat tersambung sinyal.');
      return false;
    }

    // If authenticated Warga (not demo mode), persist to Firestore
    if (authMode !== 'demo' && user) {
      try {
        await saveReportToFirestore(newReport, user.uid, profile?.name, profile?.phone);
      } catch (fsErr) {
        console.error('Failed to write report to Firestore, queuing offline:', fsErr);
        await saveOfflineReport(newReport);
        await refreshOfflineCount();
        showToast('Jaringan lambat: Laporan dicadangkan ke antrean offline HP.');
        return false;
      }
    }

    const nextReports = [newReport, ...reports];
    setReports(nextReports);

    const dryDays = scenario === 'normal' ? 1 : scenario === 'kemarau' ? 14 : 21;
    recalculateZones(nodes, hotspots, nextReports, dryDays);

    if (data.condition === 'Api') {
      const autoAlert: AlertNotification = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        title: `Laporan Titik Api Terverifikasi di ${data.zoneName}`,
        level: 'Awas',
        zoneName: data.zoneName,
        timestamp: 'Baru saja',
        message: `Laporan warga MPA terverifikasi: ${data.notes}. Komponen Trust Score meningkat ke tingkat Tinggi.`,
        actionRecommendation: 'Luncurkan tim pemadam Daops Manggala Agni dan aktifkan sekat kanal terdekat.',
        channels: ['App Push', 'WhatsApp Bot', 'Sirine Desa'],
        acknowledged: false
      };
      setAlerts((prev) => [autoAlert, ...prev]);
      showToast(`Laporan Api masuk! Status zona ${data.zoneName} dieskalasi dan Trust Score meningkat.`);
    } else if (data.condition === 'Asap') {
      showToast(`Laporan Asap masuk! Komponen verifikasi warga meningkat, menaikkan tingkat kepercayaan (Trust Score).`);
    } else {
      showToast('Laporan kondisi Aman berhasil dicatat.');
    }

    return true;
  };

  // Update Report Status (for Petugas)
  const updateReportStatus = async (reportId: string, status: CitizenReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );

    // If authenticated Petugas, persist update to Firestore
    if (authMode === 'petugas') {
      try {
        await updateReportStatusInFirestore(
          reportId,
          status,
          profile?.name || 'Petugas Posko Jambi'
        );
      } catch (err) {
        console.error('Failed to update report status in Firestore:', err);
      }
    }

    showToast(`Status laporan ${reportId} diubah menjadi: ${status}`);
  };

  // 1-Tap Citizen confirmation
  const confirmCondition = (zoneId: string, condition: 'Aman' | 'Asap' | 'Api') => {
    const syntheticReport: CitizenReport = {
      id: `KONF-${Date.now().toString().slice(-4)}`,
      timestamp: 'Baru saja',
      zoneId,
      zoneName: zones.find((z) => z.id === zoneId)?.name || 'Wilayah Jambi',
      condition,
      reporterType: 'Warga',
      notes: `Konfirmasi cepat 1-ketuk: ${condition}`,
      status: 'Terverifikasi',
      coordinates: selectedZone.coordinates,
      syncStatus: 'synced'
    };

    const nextReports = [syntheticReport, ...reports];
    setReports(nextReports);
    const dryDays = scenario === 'normal' ? 1 : scenario === 'kemarau' ? 14 : 21;
    recalculateZones(nodes, hotspots, nextReports, dryDays);
    showToast(`Konfirmasi "${condition}" diterima. Komponen verifikasi Trust Score wilayah langsung terbarui.`);
  };

  const createFieldTask = (data: Omit<FieldTask, 'id' | 'createdAt'>) => {
    const newTask: FieldTask = {
      ...data,
      id: `TSK-${Date.now().toString().slice(-4)}`,
      createdAt: 'Baru saja'
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Tugas lapangan diterbitkan untuk ${newTask.assignedTeam}`);
  };

  const updateTaskStatus = (taskId: string, status: FieldTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    showToast(`Status tugas ${taskId} diperbarui: ${status}`);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    showToast('Peringatan ditandai telah diketahui (Acknowledged).');
  };

  const broadcastAlert = (data: Omit<AlertNotification, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: AlertNotification = {
      ...data,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Baru saja',
      acknowledged: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Peringatan tingkat ${data.level} disiarkan ke ${data.channels.join(', ')}`);
  };

  const retriggerAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, timestamp: 'Baru saja (Kirim Ulang)', acknowledged: false }
          : a
      )
    );
    showToast('Peringatan berhasil dikirim ulang ke seluruh kanal komunitas.');
  };

  const escalateAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const nextLevel = a.level === 'Waspada' ? 'Siaga' : 'Awas';
          return {
            ...a,
            level: nextLevel,
            title: `[ESKALASI] ${a.title.replace(/Waspada|Siaga|Awas/g, nextLevel)}`,
            timestamp: 'Baru saja (Dieskalasi)',
            actionRecommendation: 'Eskalasi darurat: Aktifkan pompa air dan kirim regu pemadam terdekat.',
            acknowledged: false
          };
        }
        return a;
      })
    );
    showToast('Peringatan berhasil dieskalasi ke tingkat yang lebih tinggi!');
  };

  const toggleTimeSimulation = () => {
    setIsSimulatingTime((prev) => !prev);
    showToast(!isSimulatingTime ? 'Stream sensor diaktifkan' : 'Stream sensor dijeda');
  };

  const currentTimeString =
    new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB';

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        scenario,
        setScenario: applyScenario,
        isTransitioningScenario,
        transitionProgress,
        resetDemo,
        zones,
        nodes,
        hotspots,
        reports,
        tasks,
        alerts,
        selectedZone,
        setSelectedZoneId,
        isOnline,
        setIsOnlineManual: setForceOffline,
        offlineQueueCount,
        addCitizenReport,
        confirmCondition,
        updateReportStatus,
        createFieldTask,
        updateTaskStatus,
        acknowledgeAlert,
        broadcastAlert,
        retriggerAlert,
        escalateAlert,
        isSimulatingTime,
        toggleTimeSimulation,
        currentTimeString,
        isMobileFrameSimulated,
        setIsMobileFrameSimulated,
        activeToast,
        showToast,
        isQRModalOpen,
        setIsQRModalOpen,
        isDemoSheetOpen,
        setIsDemoSheetOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
