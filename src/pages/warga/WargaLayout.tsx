import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { W1_Beranda } from './W1_Beranda';
import { W2_Peta } from './W2_Peta';
import { W3_Peringatan } from './W3_Peringatan';
import { W4_Lapor } from './W4_Lapor';
import { W5_Udara } from './W5_Udara';
import { W6_Edukasi } from './W6_Edukasi';
import {
  Home,
  MapPin,
  Bell,
  Plus,
  MoreHorizontal,
  Wind,
  BookOpen,
  WifiOff,
  Flame,
  X
} from 'lucide-react';

export const WargaLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isLainnyaOpen, setIsLainnyaOpen] = useState<boolean>(false);
  const { alerts, isOnline, offlineQueueCount, setMode } = useApp();

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return <W1_Beranda onNavigate={setActiveTab} />;
      case 'peta':
        return <W2_Peta />;
      case 'peringatan':
        return <W3_Peringatan />;
      case 'lapor':
        return <W4_Lapor onSuccess={() => setActiveTab('beranda')} />;
      case 'udara':
        return <W5_Udara />;
      case 'edukasi':
        return <W6_Edukasi />;
      default:
        return <W1_Beranda onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'peta', label: 'Peta', icon: MapPin },
    { id: 'lapor', label: 'Lapor', icon: Plus, isCenter: true },
    { id: 'peringatan', label: 'Peringatan', icon: Bell, badge: unreadAlerts },
    { id: 'lainnya', label: 'Lainnya', icon: MoreHorizontal, isAction: true }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between w-full box-border overflow-x-hidden">
      {/* Offline Status Sticky Banner */}
      {!isOnline && (
        <div className="sticky top-14 z-30 bg-amber-500 text-white px-4 py-2 text-[14px] font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Mode offline · Laporan tersimpan di perangkat</span>
          </div>
          {offlineQueueCount > 0 && (
            <span className="bg-amber-700 px-2 py-0.5 rounded-full text-[12px] font-bold">
              {offlineQueueCount} antre
            </span>
          )}
        </div>
      )}

      {/* Main Tab Content with pb-28 (Item 16) */}
      <main className="max-w-[420px] mx-auto w-full p-4 pb-28 flex-1 box-border">
        {renderContent()}
      </main>

      {/* Popover / Sheet for "Lainnya" */}
      {isLainnyaOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsLainnyaOpen(false)}
          />
          <div className="fixed bottom-16 inset-x-0 z-50 max-w-[420px] mx-auto bg-white border border-slate-200 rounded-t-2xl shadow-xl p-4 space-y-2 animate-in slide-in-from-bottom-4 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-[15px] text-slate-800">Menu Lainnya</span>
              <button
                onClick={() => setIsLainnyaOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setActiveTab('udara');
                setIsLainnyaOpen(false);
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-left min-h-[44px]"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[15px] text-slate-800 block">Kualitas Udara & ISPU</span>
                <span className="text-[13px] text-slate-500">Pantauan PM2.5 dan CO di desa sekitar</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('edukasi');
                setIsLainnyaOpen(false);
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-left min-h-[44px]"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[15px] text-slate-800 block">Edukasi Gambut & PLTB</span>
                <span className="text-[13px] text-slate-500">Panduan pembukaan lahan tanpa bakar</span>
              </div>
            </button>
          </div>
        </>
      )}

      {/* Ergonomic 5-Tab Fixed Bottom Bar (Item 17) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200">
        <div className="max-w-[420px] mx-auto grid grid-cols-5 items-center h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab('lapor');
                    setIsLainnyaOpen(false);
                  }}
                  className="flex flex-col items-center justify-center -mt-5 group min-h-[44px] min-w-[44px]"
                  aria-label={item.label}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[12px] font-bold text-emerald-800 mt-0.5">
                    {item.label}
                  </span>
                </button>
              );
            }

            if (item.isAction) {
              const isOtherActive = activeTab === 'udara' || activeTab === 'edukasi';
              return (
                <button
                  key={item.id}
                  onClick={() => setIsLainnyaOpen(!isLainnyaOpen)}
                  className={`flex flex-col items-center justify-center py-1 rounded-lg transition min-h-[44px] min-w-[44px] ${
                    isOtherActive || isLainnyaOpen
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[12px] font-medium tracking-tight mt-0.5">
                    {isOtherActive ? (activeTab === 'udara' ? 'Udara' : 'Edukasi') : item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsLainnyaOpen(false);
                }}
                className={`relative flex flex-col items-center justify-center py-1 rounded-lg transition min-h-[44px] min-w-[44px] ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge ? (
                    <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white" />
                  ) : null}
                </div>
                <span className="text-[12px] font-medium tracking-tight mt-0.5 truncate">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-700 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
