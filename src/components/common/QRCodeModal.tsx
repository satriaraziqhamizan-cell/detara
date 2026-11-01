import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, Copy, Check, Smartphone, Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://detara-jambi.web.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating offline QR:', err));
    }
  }, [isOpen, currentUrl]);

  // Handle Escape key to close modal (Point 5)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `detara_pwa_qr_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-600/30 p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 text-slate-800 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-700 mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Uji Coba di HP Juri (Scan QR)</h3>
          <p className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Arahkan kamera ponsel Anda ke kode QR di bawah untuk membuka prototipe PWA DETARA langsung di peramban seluler Anda.
          </p>

          {/* QR Code Container (Local Offline Generated) */}
          <div className="my-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code PWA DETARA"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-[13px] text-slate-400">
                Membuat Kode QR Lokal...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-left text-sm font-mono text-slate-700 mb-4">
            <span className="truncate flex-1">{currentUrl}</span>
            <button
              onClick={handleCopy}
              className="p-2 px-3 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-300 transition flex items-center gap-1.5 text-sm font-sans font-semibold min-h-[44px]"
              title="Salin Tautan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[15px] transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PNG</span>
            </button>
          </div>

          <div className="text-[13px] text-slate-600 text-left bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">Kode QR dibuat langsung di browser secara luring tanpa koneksi server eksternal.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
