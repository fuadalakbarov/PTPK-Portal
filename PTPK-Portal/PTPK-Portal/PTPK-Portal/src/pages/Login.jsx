import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  function handleEnter() {
    setSubmitting(true);
    login({ id: 'admin', ad: 'Komissiya', rol: 'admin' });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b2a] px-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.10), transparent 60%)',
        }}
      />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.06)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'rgba(15,110,110,0.10)', filter: 'blur(60px)' }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div
          className="rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.25)] shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-9 pb-7 text-center border-b border-[rgba(201,168,76,0.2)]">
            <img
              src="/logo.png"
              alt="PTPK"
              className="w-16 h-16 mx-auto mb-4 drop-shadow-[0_2px_12px_rgba(201,168,76,0.5)]"
            />
            <h1 className="font-serif text-white text-lg font-bold leading-snug">
              PTPK Portalı
            </h1>
            <p className="text-[rgba(255,255,255,0.5)] text-xs mt-1.5 font-medium">
              Psixoloji-Tibbi-Pedaqoji Komissiya
            </p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#f0d080] border border-[rgba(201,168,76,0.35)]" style={{ background: 'rgba(201,168,76,0.15)' }}>
              Komissiya üzvləri üçün
            </span>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <button
              onClick={handleEnter}
              disabled={submitting}
              className="w-full text-[#0d1b2a] font-bold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #f0d080, #c9a84c)',
              }}
            >
              {submitting ? 'Daxil olunur…' : 'Panelə daxil ol'}
            </button>

            <a
              href="https://ptpk.onrender.com/komissiya.html"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-[rgba(255,255,255,0.45)] hover:text-[#f0d080] transition-colors"
            >
              ← Əsas səhifəyə qayıt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
