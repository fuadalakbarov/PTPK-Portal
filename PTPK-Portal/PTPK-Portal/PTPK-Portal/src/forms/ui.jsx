import { IconDeviceFloppy, IconLoader2, IconCheck } from '@tabler/icons-react';

export const inputClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white';

export function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      {title && <h2 className="text-sm font-semibold text-slate-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
}

export function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function CheckboxOption({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      {label}
    </label>
  );
}

const SCORE_OPTIONS = [
  { value: 0, label: 'Tam məhdudiyyət', color: 'red' },
  { value: 1, label: 'Qismən məhdudiyyət', color: 'amber' },
  { value: 2, label: 'Normal / Məhdudiyyət yox', color: 'green' },
];

const COLOR_CLASSES = {
  red: {
    active: 'bg-red-50 border-red-300 text-red-700',
    inactive: 'border-slate-200 text-slate-500 hover:border-red-200',
  },
  amber: {
    active: 'bg-amber-50 border-amber-300 text-amber-700',
    inactive: 'border-slate-200 text-slate-500 hover:border-amber-200',
  },
  green: {
    active: 'bg-green-50 border-green-300 text-green-700',
    inactive: 'border-slate-200 text-slate-500 hover:border-green-200',
  },
};

/**
 * Bir qiymətləndirmə meyarı sətri: kod, ad və 0/1/2 seçimi.
 */
export function ScoreField({ code, label, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-xs font-mono text-slate-400 flex-shrink-0">
          {code.toUpperCase()}
        </span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        {SCORE_OPTIONS.map((opt) => {
          const active = value === opt.value;
          const cls = COLOR_CLASSES[opt.color];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              title={opt.label}
              className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                active ? cls.active : cls.inactive
              }`}
            >
              {opt.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ScoreLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
      {SCORE_OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center gap-1.5">
          <span
            className={`w-5 h-5 rounded border flex items-center justify-center text-[11px] font-semibold ${
              COLOR_CLASSES[opt.color].active
            }`}
          >
            {opt.value}
          </span>
          {opt.label}
        </div>
      ))}
    </div>
  );
}

export function SaveBar({ saving, saved, error, onSave }) {
  return (
    <div className="sticky bottom-0 bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
      <div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && (
          <p className="text-sm text-green-600 flex items-center gap-1.5">
            <IconCheck size={16} /> Məlumatlar yadda saxlanıldı
          </p>
        )}
      </div>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {saving ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconDeviceFloppy size={16} />
        )}
        Məlumatları Yadda Saxla
      </button>
    </div>
  );
}
