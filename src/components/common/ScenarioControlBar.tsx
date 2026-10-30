import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import {
  RotateCcw,
  Flame,
  Sun,
  ShieldCheck,
  X,
  Sliders,
  Sparkles
} from 'lucide-react';

export const ScenarioControlBar: React.FC = () => {
  const {
    scenario,
    setScenario,
    resetDemo,
    isTransitioningScenario,
    transitionProgress
  } = useApp();

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);

  return (
    <>
      {/* Desktop View: Thin white bar (max height 44px / h-11) */}
      <div className="hidden md:flex h-11 bg-white border-b border-slate-200 px-4 text-[13px] text-slate-700 w-full items-center justify-between">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 w-full">
          {/* Left: Scenario Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 whitespace-nowrap">
              Skenario Demo:
            </span>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setScenario('normal')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition text-[13px] font-medium min-h-[32px] ${
                  scenario === 'normal'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>1. Normal</span>
              </button>

              <button
                onClick={() => setScenario('kemarau')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition text-[13px] font-medium min-h-[32px] ${
                  scenario === 'kemarau'
                    ? 'bg-white text-amber-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>2. Kemarau</span>
              </button>

              <button
                onClick={() => setScenario('awas')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition text-[13px] font-medium min-h-[32px] ${
                  scenario === 'awas'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>3. Awas</span>
              </button>
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={resetDemo}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1 text-[13px] font-medium min-h-[32px]"
              title="Kembalikan semua nilai ke skenario normal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Mulai Ulang Demo</span>
            </button>
          </div>

          {/* Right: Simulation notice */}
          <div className="flex items-center gap-3">
            {isTransitioningScenario && (
              <span className="text-[13px] text-emerald-700 font-semibold animate-pulse">
                Transisi skenario: {transitionProgress}%
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[12px] font-medium">
              Data simulasi untuk demonstrasi
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View: Floating button at bottom-left */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileSheetOpen(true)}
          className="fixed bottom-20 left-3 z-40 px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-800 shadow-sm flex items-center gap-1.5 text-[13px] font-bold min-h-[38px] active:scale-95"
          aria-label="Buka Panel Demo"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-700" />
          <span>Demo</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
        </button>

        {/* Mobile Bottom Sheet */}
        {isMobileSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 animate-in fade-in duration-150">
            <div
              className="w-full bg-white border-t border-slate-200 rounded-t-2xl p-4 shadow-xl space-y-3.5 max-w-lg mx-auto animate-in slide-in-from-bottom-5 duration-200 text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-[16px] text-slate-900">Panel Demo Simulasi</span>
                </div>
                <button
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Tutup Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Disclaimer */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[13px] text-slate-600">
                Data sensor dan laporan adalah simulasi untuk demonstrasi prototipe.
              </div>

              {/* Scenario options */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-500 block">
                  Pilih Skenario:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setScenario('normal');
                      setIsMobileSheetOpen(false);
                    }}
                    className={`py-2 px-2 rounded-lg border text-[13px] font-bold flex flex-col items-center justify-center gap-1 transition min-h-[44px] ${
                      scenario === 'normal'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>1. Normal</span>
                  </button>

                  <button
                    onClick={() => {
                      setScenario('kemarau');
                      setIsMobileSheetOpen(false);
                    }}
                    className={`py-2 px-2 rounded-lg border text-[13px] font-bold flex flex-col items-center justify-center gap-1 transition min-h-[44px] ${
                      scenario === 'kemarau'
                        ? 'bg-amber-50 border-amber-600 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>2. Kemarau</span>
                  </button>

                  <button
                    onClick={() => {
                      setScenario('awas');
                      setIsMobileSheetOpen(false);
                    }}
                    className={`py-2 px-2 rounded-lg border text-[13px] font-bold flex flex-col items-center justify-center gap-1 transition min-h-[44px] ${
                      scenario === 'awas'
                        ? 'bg-red-50 border-red-600 text-red-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>3. Awas</span>
                  </button>
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  resetDemo();
                  setIsMobileSheetOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[14px] font-semibold transition flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Mulai Ulang Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
