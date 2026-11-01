import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { CitizenReport, FieldTask } from '../../types';
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Send,
  Shield,
  MapPin,
  ChevronRight,
  Flame,
  Wind
} from 'lucide-react';

export const P6_LaporanTugas: React.FC = () => {
  const { reports, tasks, createFieldTask, updateTaskStatus, updateReportStatus, zones } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'tasks'>('reports');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  // Form states for new task
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [assignedTeam, setAssignedTeam] = useState<FieldTask['assignedTeam']>(
    'Regu Manggala Agni Daops Jambi'
  );
  const [priority, setPriority] = useState<FieldTask['priority']>('Tinggi');
  const [targetZone, setTargetZone] = useState<string>(zones[0].id);
  const [taskNotes, setTaskNotes] = useState<string>('');

  const openCreateTaskForReport = (rep: CitizenReport) => {
    setSelectedReport(rep);
    setTaskTitle(`Groundcheck Lapangan: Laporan ${rep.condition} di ${rep.zoneName}`);
    setTargetZone(rep.zoneId);
    setPriority(rep.condition === 'Api' ? 'Darurat' : 'Tinggi');
    setTaskNotes(rep.notes);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const zoneObj = zones.find((z) => z.id === targetZone) || zones[0];

    createFieldTask({
      title: taskTitle || `Groundcheck Wilayah ${zoneObj.name}`,
      zoneId: zoneObj.id,
      zoneName: zoneObj.name,
      assignedTeam,
      priority,
      status: 'Ditugaskan',
      reportRefId: selectedReport?.id,
      notes: taskNotes || 'Lakukan verifikasi visual dan pemeriksaan kelembapan gambut.',
      waterSourceUsed: zoneObj.nearestWaterSource
    });

    setIsTaskModalOpen(false);
    setSelectedReport(null);
    setTaskTitle('');
    setTaskNotes('');
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 ">
            Laporan Warga & Penugasan Groundcheck Lapangan
          </h1>
          <p className="text-sm text-slate-500">
            Alur verifikasi darat: Laporan warga diverifikasi silang dengan sensor, lalu diterbitkan surat tugas patroli
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition min-h-[40px] ${
              activeTab === 'reports'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Laporan Komunitas ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition min-h-[40px] ${
              activeTab === 'tasks'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tugas Patroli Lapangan ({tasks.length})
          </button>
        </div>
      </div>

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/30 p-4 animate-in fade-in duration-150"
          onClick={() => setIsTaskModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Terbitkan Surat Penugasan Groundcheck
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5 text-sm">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">
                  Judul Penugasan:
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Regu Pelaksana:
                  </label>
                  <select
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value as any)}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-semibold"
                  >
                    <option value="Regu Manggala Agni Daops Jambi">Regu Manggala Agni Daops Jambi</option>
                    <option value="TRC BPBD Prov. Jambi">TRC BPBD Prov. Jambi</option>
                    <option value="MPA Desa Mandiri">MPA Desa Mandiri</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Prioritas:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-semibold"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Darurat">Darurat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">
                  Instruksi & Logistik Operasional:
                </label>
                <textarea
                  rows={3}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Instruksi peralatan (pompa apung, selang, sekat kanal terdekat)..."
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition text-sm min-h-[44px]"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 1: Citizen Reports Feed */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.map((rep) => {
            const isApi = rep.condition === 'Api';
            const isAsap = rep.condition === 'Asap';

            return (
              <div
                key={rep.id}
                className="bg-white  p-5 rounded-3xl border border-slate-200  shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold text-xs">{rep.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        isApi
                          ? 'bg-red-100 text-red-700'
                          : isAsap
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {rep.condition}
                    </span>
                    <span className="text-xs text-slate-500">
                      Pelapor: <strong className="text-slate-800">{rep.reporterType}</strong> · {rep.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {rep.zoneName}
                  </h3>
                  <p className="text-sm text-slate-600 italic">
                    "{rep.notes}"
                  </p>

                  {rep.photoUrl && (
                    <div className="pt-1">
                      <img
                        src={rep.photoUrl}
                        alt="Foto Laporan Warga"
                        className="h-20 w-32 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 self-end md:self-auto">
                  {/* Petugas status selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-600">Status:</span>
                    <select
                      value={rep.status}
                      onChange={(e) => updateReportStatus(rep.id, e.target.value as any)}
                      className={`text-sm font-bold py-1.5 px-2.5 rounded-xl border transition min-h-[44px] ${
                        rep.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : rep.status === 'Dalam Penanganan'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : rep.status === 'Terverifikasi'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="Terkirim">Terkirim</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Dalam Penanganan">Dalam Penanganan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  <button
                    onClick={() => openCreateTaskForReport(rep)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs min-h-[44px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Tugas Groundcheck</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Tasks Feed */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-500 text-xs">{task.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      task.priority === 'Darurat'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    Prioritas {task.priority}
                  </span>
                  <span className="text-xs text-slate-500">Dibuat: {task.createdAt}</span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-slate-600 font-semibold text-sm mr-1">Status:</span>
                  {(['Ditugaskan', 'Sedang Groundcheck', 'Penanganan Selesai'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateTaskStatus(task.id, st)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition min-h-[40px] ${
                        task.status === st
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {task.title}
                </h3>
                <span className="text-sm text-emerald-700 font-semibold">
                  {task.assignedTeam} · Wilayah: {task.zoneName}
                </span>
                <p className="text-sm text-slate-600 mt-1">
                  Catatan Lapangan: {task.notes}
                </p>
              </div>

              {task.waterSourceUsed && (
                <div className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Akses Sumber Air Utama: <strong>{task.waterSourceUsed}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
