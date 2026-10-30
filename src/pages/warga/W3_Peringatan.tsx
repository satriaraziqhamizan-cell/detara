import React from 'react';
import { useApp } from '../../store/appContext';
import {
  AlertTriangle,
  Clock,
  Radio,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const W3_Peringatan: React.FC = () => {
  const { alerts, confirmCondition, acknowledgeAlert, selectedZone } = useApp();

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Pusat Peringatan Dini</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Notifikasi risiko karhutla dan arahan keselamatan warga sekitar
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="text-[17px] font-bold text-slate-900">Semua wilayah aman</h3>
          <p className="text-[14px] text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada peringatan aktif saat ini. Sistem memantau jaringan sensor dan data satelit secara berkala.
          </p>
        </div>
      ) : (
        alerts.map((alert) => {
          const isAwas = alert.level === 'Awas';
          const isSiaga = alert.level === 'Siaga';

          return (
            <div
              key={alert.id}
              className={`rounded-xl p-4 border shadow-xs space-y-3 ${
                isAwas
                  ? 'bg-red-50/70 border-red-200'
                  : isSiaga
                  ? 'bg-orange-50/70 border-orange-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-lg text-white shrink-0 ${
                      isAwas ? 'bg-red-600' : isSiaga ? 'bg-orange-600' : 'bg-amber-600'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {alert.level}
                      </span>
                      <span className="text-[13px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900 mt-1 leading-snug">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 text-[13px] font-semibold bg-white text-slate-800 rounded-lg border border-slate-300 hover:bg-slate-50 min-h-[44px] flex items-center justify-center shrink-0"
                  >
                    Tandai tahu
                  </button>
                )}
              </div>

              <p className="text-[14px] text-slate-700 leading-relaxed">
                {alert.message}
              </p>

              {/* Action Recommendation Box */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-[14px]">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>Saran tindakan:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {alert.actionRecommendation}
                </p>
              </div>

              {/* Channels & Confirmation Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1 text-[13px] text-slate-500">
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kanal: {alert.channels.join(' · ')}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-slate-500 font-semibold">Konfirmasi:</span>
                  <button
                    onClick={() => confirmCondition(selectedZone.id, 'Aman')}
                    className="px-3 py-1.5 rounded-lg bg-white text-emerald-800 font-bold text-[14px] border border-emerald-300 hover:bg-emerald-50 min-h-[44px] flex items-center"
                  >
                    Aman
                  </button>
                  <button
                    onClick={() => confirmCondition(selectedZone.id, 'Api')}
                    className="px-3 py-1.5 rounded-lg bg-white text-red-800 font-bold text-[14px] border border-red-300 hover:bg-red-50 min-h-[44px] flex items-center"
                  >
                    Ada api
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
