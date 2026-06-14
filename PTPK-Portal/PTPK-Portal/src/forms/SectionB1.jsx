import { useBolme } from '../hooks/useBolme';
import { Card, ScoreField, ScoreLegend, SaveBar } from './ui';
import { IconLoader2 } from '@tabler/icons-react';

const ITEMS = [
  { code: 'b110', label: 'Şüur funksiyaları' },
  { code: 'b117', label: 'İntellektual funksiyalar (zehni inkişaf səviyyəsi)' },
  { code: 'b134', label: 'Yuxu funksiyaları' },
  { code: 'b140', label: 'Diqqət funksiyaları (diqqəti cəmləmə, davam etdirmə)' },
  { code: 'b144', label: 'Yaddaş funksiyaları (qısa və uzun müddətli)' },
  { code: 'b147', label: 'Psixomotor funksiyalar' },
  { code: 'b152', label: 'Emosional funksiyalar (emosiyaların idarə olunması)' },
  { code: 'b156', label: 'Perseptiv funksiyalar (qavrayış)' },
  { code: 'b164', label: 'Yüksək səviyyəli koqnitiv funksiyalar (planlaşdırma, problem həlli, qərar vermə)' },
];

const EMPTY_FORM = {
  ...Object.fromEntries(ITEMS.map((i) => [i.code, null])),
};

export default function SectionB1({ usaq, profile }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_b1',
    usaq?.id,
    EMPTY_FORM
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
        <IconLoader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card title="B1 — Psixi Funksiyalar">
        <ScoreLegend />
        <div>
          {ITEMS.map((item) => (
            <ScoreField
              key={item.code}
              code={item.code}
              label={item.label}
              value={form[item.code]}
              onChange={(v) => setField(item.code, v)}
            />
          ))}
        </div>
      </Card>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}
