import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { P1_Beranda } from './P1_Beranda';
import { P2_PetaSIG } from './P2_PetaSIG';
import { P3_Sensor } from './P3_Sensor';
import { P4_AnalisisRisiko } from './P4_AnalisisRisiko';
import { P5_PusatPeringatan } from './P5_PusatPeringatan';
import { P6_LaporanTugas } from './P6_LaporanTugas';
import { P7_PrioritasPatroli } from './P7_PrioritasPatroli';
import { P8_AgriDampak } from './P8_AgriDampak';
import { P9_DokumenLomba } from './P9_DokumenLomba';
import {
  LayoutDashboard,
  MapPin,
  Radio,
  Brain,
  Bell,
  FileCheck,
  Compass,
  Leaf,
  Award,
  Menu,
  X,
  Activity,
  ArrowLeft,
  Info
} from 'lucide-react';

export const PetugasLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { alerts, reports, tasks, currentTimeString, setMode } = useApp();

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const menuItems = [
    { id: 'beranda', label: 'Ringkasan Utama', code: 'P1', icon: LayoutDashboard },
    { id: 'peta', label: 'Peta SIG Jambi', code: 'P2', icon: MapPin },
    { id: 'sensor', label: 'Monitoring Sensor', code: 'P3', icon: Radio },
    { id: 'analisis', label: 'Analisis Risiko & AI', code: 'P4', icon: Brain },
    { id: 'peringatan', label: 'Pusat Peringatan', code: 'P5', icon: Bell, badge: unreadAlerts },
    { id: 'laporan', label: 'Laporan & Tugas', code: 'P6', icon: FileCheck, badge: reports.length },
    { id: 'patroli', label: 'Prioritas Patroli', code: 'P7', icon: Compass },
    { id: 'agri', label: 'Advisory & Karbon', code: 'P8', icon: Leaf },
    { id: 'lomba', label: 'Dokumen ThinkLab 2026', code: 'P9', icon: Award }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'beranda':
        return <P1_Beranda onNavigate={setActiveTab} />;
      case 'peta':
        return <P2_PetaSIG />;
      case 'sensor':
        return <P3_Sensor />;
      case 'analisis':
        return <P4_AnalisisRisiko />;
      case 'peringatan':
        return <P5_PusatPeringatan />;
      case 'laporan':
        return <P6_LaporanTugas />;
      case 'patroli':
        return <P7_PrioritasPatroli />;
      case 'agri':
        return <P8_AgriDampak />;
      case 'lomba':
        return <P9_DokumenLomba />;
      default:
        return <P1_Beranda onNavigate={setActiveTab} />;
    }
  };

  React.useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white border-b border-slate-200">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-bold text-slate-800">
          DETARA Command Center
        </span>
        <span className="text-xs text-emerald-700 font-mono font-bold">{currentTimeString}</span>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Sidebar Header Brand */}
          <div className="px-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo DETARA" className="w-9 h-9 object-contain mix-blend-multiply" />
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Command Center
                </h2>
                <span className="text-xs text-slate-500 block font-mono">Provinsi Jambi</span>
              </div>
            </div>
          </div>

          {/* Quick back to Layar Awal button */}
          <button
            onClick={() => setMode('welcome')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-100 transition min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>Kembali ke Layar Awal</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-emerald-800' : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="font-mono text-xs opacity-50">{item.code}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Tentang Link */}
        <div className="pt-3 border-t border-slate-200 text-sm text-slate-400 space-y-2">
          <button
            onClick={() => setMode('tentang')}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 font-bold transition min-h-[44px]"
          >
            <Info className="w-4 h-4" />
            <span>Tentang Aplikasi & Tim</span>
          </button>

          <div className="px-2">
            <span className="text-sm text-slate-500 block font-semibold">
              Data simulasi untuk demonstrasi
            </span>
            <span className="text-xs text-slate-400">ThinkLab 2026 Prototype</span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {/* Permanent simulation label banner under header */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm font-bold text-amber-900">
          Data simulasi untuk demonstrasi · ThinkLab 2026
        </div>

        <div className="p-4 md:p-8 pb-32 md:pb-8">
          {/* Contextual Breadcrumb Top Bar */}
          <div className="hidden md:flex items-center justify-between pb-4 mb-4 border-b border-slate-200 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Command Center</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 capitalize">
                {menuItems.find((m) => m.id === activeTab)?.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-emerald-700 font-bold">
                {currentTimeString}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium border border-slate-200">
                Daops Manggala Agni & TRC BPBD Jambi
              </span>
            </div>
          </div>

          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};
