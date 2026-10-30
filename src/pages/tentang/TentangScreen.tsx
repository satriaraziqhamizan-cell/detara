import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import {
  Award,
  ArrowLeft,
  Users,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  Info,
  Sparkles,
  QrCode,
  Lock,
  FileText
} from 'lucide-react';
import { KebijakanPrivasi } from './KebijakanPrivasi';

export const TentangScreen: React.FC = () => {
  const { setMode, setIsQRModalOpen } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'tentang' | 'privasi'>('tentang');

  return (
    <div className="min-h-screen bg-white text-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation back & QR */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMode('welcome')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Layar Awal</span>
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 transition min-h-[44px]"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR di HP</span>
          </button>
        </div>

        {/* Tab switch between Tentang Tim and Kebijakan Privasi */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('tentang')}
            className={`py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 min-h-[44px] ${
              activeSubTab === 'tentang'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Tentang DETARA & Tim</span>
          </button>

          <button
            onClick={() => setActiveSubTab('privasi')}
            className={`py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 min-h-[44px] ${
              activeSubTab === 'privasi'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kebijakan Privasi & Data</span>
          </button>
        </div>

        {activeSubTab === 'privasi' ? (
          <KebijakanPrivasi />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                <Award className="w-4 h-4" />
                <span>Dokumen Resmi & Transparansi Inovasi</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Tentang DETARA
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Prototipe PWA Sistem Peringatan Dini Kebakaran Hutan dan Lahan Berbasis IoT, Edge AI, dan SIG dengan Verifikasi Berlapis serta Respons Komunitas di Provinsi Jambi.
              </p>
            </div>

            {/* 1. Nama Tim & Lembaga */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Identitas Tim Pengembang</span>
              </h2>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nama Tim:</span>
                  <strong className="text-slate-900 font-mono">bissmilah juara</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Ketua Pengembang:</span>
                  <strong className="text-slate-900">Anggota 1 (Ketua / Lead Developer)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Ajang Kompetisi:</span>
                  <strong className="text-slate-900">Yogyakarta Emerging Scientist Competition (YESC) 2026</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Subtema Esai:</span>
                  <strong className="text-emerald-700">Environmental Sustainability</strong>
                </div>
              </div>
            </div>

            {/* 2. Tujuan Aplikasi */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Tujuan Aplikasi</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menyediakan prototipe fungsional yang dapat langsung diuji coba oleh dewan juri tanpa perlu proses instalasi yang rumit. Aplikasi memperlihatkan siklus respons bencana lengkap:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-bold pt-2">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                  1. Sensor IoT LoRa Lapangan
                </div>
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                  2. Edge AI & Peringatan Dini
                </div>
                <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
                  3. Laporan Cepat Warga Desa
                </div>
                <div className="p-3 bg-purple-50 text-purple-800 rounded-xl border border-purple-200">
                  4. Tindakan Patroli & Groundcheck
                </div>
              </div>
            </div>

            {/* 3. Penjelasan Label Simulasi & Catatan Ambang Skor */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm space-y-3 text-amber-950">
              <h2 className="text-base font-bold flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Transparansi Data Simulasi & Pernyataan Ilmiah</span>
              </h2>
              <p className="text-sm leading-relaxed">
                <strong>Penjelasan Label Simulasi:</strong> Seluruh data sensor, grafik telemetri waktu, citra satelit, dan formulir laporan pada aplikasi ini berstatus <em>"Data simulasi untuk demonstrasi"</em>. Data dirancang secara realistis sesuai kondisi hidrologis gambut Jambi (Muaro Jambi dan Tanjung Jabung), namun bukan merupakan hasil pengukuran instrumen langsung di lapangan pada saat ini.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 font-medium">
                <strong>Catatan Kalibrasi Skor:</strong> Bobot dan ambang skor adalah asumsi awal untuk demonstrasi dan akan dikalibrasi dengan data nyata.
              </div>
            </div>

            {/* 4. Kontak Asli Tim */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-700" />
                <span>Kontak Narahubung Tim</span>
              </h2>
              <p className="text-sm text-slate-600">
                Untuk keperluan penjurian booth exhibition atau pertanyaan teknis esai, silakan hubungi:
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm font-mono">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    WhatsApp / Telepon:{' '}
                    <a
                      href="https://wa.me/62895620029379"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 underline hover:text-emerald-800"
                    >
                      0895620029379
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
