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
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Dokumentasi Konsep & Metodologi YESC 2026</span>
          </h1>
          <p className="text-xs text-slate-500 ">
            Arsitektur teknis 5 lapis, keunikan inovasi DETARA, dan panduan presentasi booth
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('tentang')}
            className="px-3.5 py-2 rounded-xl bg-slate-100  text-slate-800  text-xs font-bold hover:bg-slate-200 transition"
          >
            Halaman Tentang & Tim
          </button>
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Tampilkan QR HP Juri</span>
          </button>
        </div>
      </div>

      {/* Featured Hardware Concept Card (Points 1, 2, 3) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200  relative shadow-sm">
        <img
          src={heroPeatlandSensorWebp}
          alt="Ilustrasi konsep perangkat sensor"
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-end text-white">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Ilustrasi konsep perangkat (dibuat dengan AI), bukan foto pengujian lapangan
          </span>
          <h2 className="text-lg md:text-xl font-bold mt-1">
            Konsep Tiang Stasiun IoT Mandiri Surya (Edge Node LoRaWAN)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Rancangan perangkat lapangan hemat daya berbasis mikrokontroler dengan deep sleep, panel surya pengisi baterai, antena LoRa frekuensi regulasi Indonesia (AS923 Komdigi), probe kelembapan tanah, dan pipa pemantau muka air gambut.
          </p>
        </div>
      </div>

      {/* Point 6: Satu Kartu Keunikan DETARA (Tanpa membandingkan dengan sistem lain) */}
      <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900  flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Keunikan DETARA</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Empat pilar kebaruan gagasan yang dirancang untuk perlindungan ekosistem lahan gambut di Jambi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Pilar 1: Risk x Confidence Matrix */}
          <div className="p-4 rounded-2xl bg-slate-50  border border-slate-200  space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 ">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Matriks 3×3 Risk × Confidence</span>
            </div>
            <p className="text-slate-600  leading-relaxed">
              Tindakan operasional ditentukan bukan semata dari besaran risiko (Risk Index), melainkan dikalikan dengan tingkat kepercayaan data. Status eskalasi dan groundcheck hanya dipicu saat kedua dimensi terkonfirmasi secara bersamaan.
            </p>
          </div>

          {/* Pilar 2: Trust Score Multi-Parameter */}
          <div className="p-4 rounded-2xl bg-slate-50  border border-slate-200  space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 ">
              <Cpu className="w-4 h-4 text-amber-600" />
              <span>2. Verifikasi Berlapis (Trust Score)</span>
            </div>
            <p className="text-slate-600  leading-relaxed">
              Mengevaluasi kesehatan fisik sensor, konsistensi spasial antarnode tetangga, kelogisan tren waktu, dan konfirmasi silang citra satelit serta laporan warga. Hal ini mengeliminasi alarm palsu dari sensor yang rusak atau drift.
            </p>
          </div>

          {/* Pilar 3: Patrol Priority Score */}
          <div className="p-4 rounded-2xl bg-slate-50  border border-slate-200  space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 ">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>3. Patrol Priority Score (Sadar Dampak)</span>
            </div>
            <p className="text-slate-600  leading-relaxed">
              Membantu komandan lapangan menentukan prioritas rute armada pemadam dengan mengalikan indeks risiko api terhadap faktor keterpaparan sosial (kedekatan permukiman, kebun pangan, akses jalan, dan sekolah).
            </p>
          </div>

          {/* Pilar 4: Mode Offline & Ketahanan Lapangan */}
          <div className="p-4 rounded-2xl bg-slate-50  border border-slate-200  space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 ">
              <WifiOff className="w-4 h-4 text-cyan-600" />
              <span>4. Arsitektur Offline-First & Resiliensi Sinyal</span>
            </div>
            <p className="text-slate-600  leading-relaxed">
              Memanfaatkan transmisi radio LoRa jarak jauh di lapangan serta aplikasi PWA warga yang dapat menyimpan antrean laporan di IndexedDB lokal saat berada di area tanpa sinyal seluler (blank spot) dan tersinkron otomatis saat daring.
            </p>
          </div>
        </div>
      </div>

      {/* Arsitektur 5 Lapis IoT */}
      <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900  flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-600" />
          <span>Arsitektur Sistem Lima Lapis (5-Layer IoT & Analytics Architecture)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 font-bold block">LAPISAN 1</span>
            <h4 className="font-bold text-slate-900 ">Sensing Layer</h4>
            <p className="text-[11px] text-slate-500">
              Sensor tanah RS485, suhu DS18B20, dipwell ultrasonik, gas CO, laser PM2.5.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 font-bold block">LAPISAN 2</span>
            <h4 className="font-bold text-slate-900 ">Edge Layer</h4>
            <p className="text-[11px] text-slate-500">
              ESP32 low-power, rate-of-change, isolasi outlier, modulasi interval kirim LoRa.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 font-bold block">LAPISAN 3</span>
            <h4 className="font-bold text-slate-900 ">Network Layer</h4>
            <p className="text-[11px] text-slate-500">
              LoRa SX1262 (AS923 920-923 MHz) ke Gateway desa, diteruskan via MQTT/4G.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 font-bold block">LAPISAN 4</span>
            <h4 className="font-bold text-slate-900 ">Data & Analytics</h4>
            <p className="text-[11px] text-slate-500">
              Integrasi hotspot VIIRS, kalkulasi dinamis Risk Index dan Trust Score.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50  border border-slate-200  space-y-1">
            <span className="font-mono text-[10px] text-emerald-600 font-bold block">LAPISAN 5</span>
            <h4 className="font-bold text-slate-900 ">Application Layer</h4>
            <p className="text-[11px] text-slate-500">
              Command Center Petugas + PWA DETARA Warga (lapor cepat & offline).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
