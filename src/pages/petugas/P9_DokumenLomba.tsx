import React from 'react';
import { useApp } from '../../store/appContext';
import {
  FileText,
  Award,
  Layers,
  Cpu,
  Radio,
  Server,
  Smartphone,
  CheckCircle,
  QrCode,
  ShieldCheck,
  Compass,
  Sparkles,
  WifiOff
} from 'lucide-react';
import heroPeatlandSensorWebp from '../../assets/images/hero_peatland_sensor.webp';

export const P9_DokumenLomba: React.FC = () => {
  const { setIsQRModalOpen, setMode } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Dokumentasi Konsep & Metodologi ThinkLab 2026</span>
          </h1>
          <p className="text-sm text-slate-500">
            Arsitektur teknis 5 lapis, keunikan inovasi DETARA, dan pemetaan ke 3 kriteria penilaian ThinkLab 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('tentang')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition min-h-[44px]"
          >
            Halaman Tentang & Tim
          </button>
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-2 shadow-sm min-h-[44px]"
          >
            <QrCode className="w-4 h-4" />
            <span>Tampilkan QR Juri ThinkLab</span>
          </button>
        </div>
      </div>

      {/* Featured Hardware Concept Card (Points 1, 2, 3) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 relative shadow-sm">
        <img
          src={heroPeatlandSensorWebp}
          alt="Ilustrasi konsep perangkat sensor"
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Ilustrasi konsep perangkat (dibuat dengan AI), bukan foto pengujian lapangan
          </span>
          <h2 className="text-lg md:text-xl font-bold mt-1">
            Konsep Tiang Stasiun IoT Mandiri Surya (Edge Node LoRaWAN)
          </h2>
          <p className="text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            Rancangan perangkat lapangan hemat daya berbasis mikrokontroler dengan deep sleep, panel surya pengisi baterai, antena LoRa frekuensi regulasi Indonesia (AS923 Komdigi), probe kelembapan tanah, dan pipa pemantau muka air gambut.
          </p>
        </div>
      </div>

      {/* Point 6: Satu Kartu Keunikan DETARA (Tanpa membandingkan dengan sistem lain) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Keunikan DETARA</span>
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Empat pilar kebaruan gagasan yang dirancang untuk perlindungan ekosistem lahan gambut di Jambi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Pilar 1: Risk x Confidence Matrix */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>1. Matriks 3×3 Risk × Confidence</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Tindakan operasional ditentukan bukan semata dari besaran risiko (Risk Index), melainkan dikalikan dengan tingkat kepercayaan data. Status eskalasi dan groundcheck hanya dipicu saat kedua dimensi terkonfirmasi secara bersamaan.
            </p>
          </div>

          {/* Pilar 2: Trust Score Multi-Parameter */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Cpu className="w-4 h-4 text-amber-600" />
              <span>2. Verifikasi Berlapis (Trust Score)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Mengevaluasi kesehatan fisik sensor, konsistensi spasial antarnode tetangga, kelogisan tren waktu, dan konfirmasi silang citra satelit serta laporan warga. Hal ini mengeliminasi alarm palsu dari sensor yang rusak atau drift.
            </p>
          </div>

          {/* Pilar 3: Patrol Priority Score */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>3. Patrol Priority Score (Sadar Dampak)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Membantu komandan lapangan menentukan prioritas rute armada pemadam dengan mengalikan indeks risiko api terhadap faktor keterpaparan sosial (kedekatan permukiman, kebun pangan, akses jalan, dan sekolah).
            </p>
          </div>

          {/* Pilar 4: Mode Offline & Ketahanan Lapangan */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <WifiOff className="w-4 h-4 text-cyan-700" />
              <span>4. Arsitektur Offline-First & Resiliensi Sinyal</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Memanfaatkan transmisi radio LoRa jarak jauh di lapangan serta aplikasi PWA warga yang dapat menyimpan antrean laporan di IndexedDB lokal saat berada di area tanpa sinyal seluler (blank spot) dan tersinkron otomatis saat daring.
            </p>
          </div>
        </div>
      </div>

      {/* Pemetaan 3 Kriteria Penilaian ThinkLab 2026 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Rubrik Penilaian Kompetisi</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-900 mt-1">
            Pemetaan Fitur DETARA terhadap 3 Kriteria Penilaian ThinkLab 2026
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            ThinkLab Coding Competition 2026 (HIMASI UNJA) — Tema: &ldquo;Digital Innovation for a Better Life&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kriteria 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Identifikasi Masalah & Kreativitas Ide</span>
            </div>
            <p className="text-xs font-semibold text-amber-800">
              Fokus: Problem statement nyata & kebaruan pendekatan
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mengidentifikasi krisis kebakaran lahan gambut bawah tanah (smoldering) di Jambi yang terlambat dideteksi satelit dan tingginya alarm palsu pada sensor tunggal. DETARA menggabungkan multi-sensor IoT LoRaWAN mandiri surya, Edge AI rate-of-change, dan Matriks 3×3 Risk × Confidence yang menyelaraskan indeks risiko dengan skor kepercayaan data.
            </p>
          </div>

          {/* Kriteria 2 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Keaktifan & Dokumentasi Diskusi</span>
            </div>
            <p className="text-xs font-semibold text-emerald-800">
              Fokus: Kolaborasi komunitas, keterlibatan warga, & transparansi
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mendorong partisipasi aktif warga desa dan Masyarakat Peduli Api (MPA) melalui verifikasi cepat 1-ketuk (Aman/Asap/Api), pelaporan lapangan bergeotag dan foto terkompresi, antrean offline IndexedDB saat di blank spot, serta alur penerbitan surat tugas groundcheck lapangan yang terdokumentasi rapi bagi petugas posko.
            </p>
          </div>

          {/* Kriteria 3 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Relevansi Solusi</span>
            </div>
            <p className="text-xs font-semibold text-purple-800">
              Fokus: Dampak aplikatif, kemudahan guna, & keselarasan tema
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menerapkan tema &ldquo;Digital Innovation for a Better Life&rdquo; secara nyata: Patrol Priority Score mengarahkan armada pompa ke zona berisiko paling mendesak (dekat permukiman, kebun pangan, sekolah), diseminasi peringatan multikanal dengan lead-time 4 jam pencegahan ISPA, serta rekomendasi sumber air kanal rewetting sesuai regulasi PP 57/2016.
            </p>
          </div>
        </div>
      </div>

      {/* Arsitektur 5 Lapis IoT */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-700" />
          <span>Arsitektur Sistem Lima Lapis (5-Layer IoT & Analytics Architecture)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs text-emerald-700 font-bold block">LAPISAN 1</span>
            <h4 className="font-bold text-slate-900 text-sm">Sensing Layer</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sensor tanah RS485, suhu DS18B20, dipwell ultrasonik, gas CO, laser PM2.5.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs text-emerald-700 font-bold block">LAPISAN 2</span>
            <h4 className="font-bold text-slate-900 text-sm">Edge Layer</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              ESP32 low-power, rate-of-change, isolasi outlier, modulasi interval kirim LoRa.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs text-emerald-700 font-bold block">LAPISAN 3</span>
            <h4 className="font-bold text-slate-900 text-sm">Network Layer</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              LoRa SX1262 (AS923 920-923 MHz) ke Gateway desa, diteruskan via MQTT/4G.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs text-emerald-700 font-bold block">LAPISAN 4</span>
            <h4 className="font-bold text-slate-900 text-sm">Data & Analytics</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Integrasi hotspot VIIRS, kalkulasi dinamis Risk Index dan Trust Score.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-xs text-emerald-700 font-bold block">LAPISAN 5</span>
            <h4 className="font-bold text-slate-900 text-sm">Application Layer</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Command Center Petugas + PWA DETARA Warga (lapor cepat & offline).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
