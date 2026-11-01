import React, { useState } from 'react';
import { useApp } from '../../store/appContext';
import { EDUCATION_ARTICLES } from '../../data/mockDatabase';
import { EducationArticle } from '../../types';
import {
  BookOpen,
  Award,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import mpaCommunityWebp from '../../assets/images/community_mpa_village.webp';

export const W6_Edukasi: React.FC = () => {
  const { setMode } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);

  React.useEffect(() => {
    if (!selectedArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  return (
    <div className="space-y-4 text-[15px] text-slate-800">
      <div>
        <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Edukasi & Pedoman Lahan</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Modul pencegahan karhutla, pembukaan lahan tanpa bakar, dan mitigasi gambut
        </p>
      </div>

      {/* Selected Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/30 p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl bg-white p-5 shadow-lg border border-slate-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[13px] font-semibold text-emerald-700">
                {selectedArticle.category} · {selectedArticle.readTime}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-[16px] font-bold min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <h3 className="text-[17px] font-bold text-slate-900 mt-2 mb-2">
              {selectedArticle.title}
            </h3>

            <p className="text-[14px] text-slate-600 leading-relaxed mb-3">
              {selectedArticle.content}
            </p>

            <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200 mb-4">
              <h4 className="text-[14px] font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Langkah praktis untuk warga:</span>
              </h4>
              <ul className="space-y-1.5 text-[13px] text-slate-700">
                {selectedArticle.practicalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full py-2.5 rounded-lg bg-emerald-700 text-white text-[14px] font-semibold hover:bg-emerald-800 min-h-[44px] transition"
            >
              Tutup artikel
            </button>
          </div>
        </div>
      )}

      {/* Featured Photo Banner */}
      <div className="rounded-xl overflow-hidden border border-slate-200 relative shadow-xs">
        <img
          src={mpaCommunityWebp}
          alt="Komunitas MPA Jambi"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-3.5 flex flex-col justify-end text-white">
          <span className="text-[12px] font-semibold text-emerald-300">
            Ilustrasi konsep (dibuat dengan AI)
          </span>
          <h3 className="text-[16px] font-bold text-white mt-0.5">
            Masyarakat Peduli Api (MPA) Jambi
          </h3>
          <p className="text-[13px] text-slate-200 mt-0.5 line-clamp-2">
            Peran aktif warga dalam pemantauan gambut dan konfirmasi lapangan mencegah kebakaran meluas.
          </p>
        </div>
      </div>

      {/* Articles Section */}
      <div className="space-y-2.5">
        <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Modul edukasi singkat:</span>
        </h3>

        <div className="space-y-2">
          {EDUCATION_ARTICLES.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 cursor-pointer transition shadow-xs flex items-center justify-between gap-3 min-h-[56px]"
            >
              <div>
                <span className="text-[12px] font-semibold text-emerald-700">
                  {art.category} · {art.readTime}
                </span>
                <h4 className="text-[15px] font-bold text-slate-900 mt-0.5">
                  {art.title}
                </h4>
                <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-1">
                  {art.summary}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Tentang Aplikasi Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Tentang Aplikasi & Tim
            </h3>
            <p className="text-[13px] text-slate-500">
              Yogyakarta Emerging Scientist Competition (YESC) 2026
            </p>
          </div>
        </div>

        <button
          onClick={() => setMode('tentang')}
          className="w-full py-2.5 px-3 rounded-lg bg-slate-800 text-white text-[14px] font-semibold hover:bg-slate-700 transition flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Buka halaman tentang & tim lengkap</span>
        </button>
      </div>
    </div>
  );
};
