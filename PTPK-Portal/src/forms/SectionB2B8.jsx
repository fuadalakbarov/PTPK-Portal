import { useBolme } from '../hooks/useBolme';
import { Card, Field, ScoreField, ScoreLegend, SaveBar, inputClass } from './ui';
import { IconLoader2 } from '@tabler/icons-react';

const GROUPS = [
  {
    title: 'B2 — Sensor Funksiyalar və Ağrı',
    items: [
      { code: 'b210', label: 'Görmə funksiyaları' },
      { code: 'b230', label: 'Eşitmə funksiyaları' },
      { code: 'b235', label: 'Vestibulyar funksiyalar (tarazlıq)' },
      { code: 'b250', label: 'Dad bilmə funksiyası' },
      { code: 'b255', label: 'İy bilmə funksiyası' },
      { code: 'b260', label: 'Proprioseptiv funksiya (bədən vəziyyətini hiss etmə)' },
      { code: 'b265', label: 'Toxunma funksiyası' },
      { code: 'b280', label: 'Ağrı hissi' },
    ],
  },
  {
    title: 'B3 — Səs və Nitq Funksiyaları',
    items: [
      { code: 'b310', label: 'Səs funksiyaları' },
      { code: 'b320', label: 'Artikulyasiya funksiyaları' },
      { code: 'b330', label: 'Nitqin rəvanlığı və ritmi' },
    ],
  },
  {
    title: 'B4 — Ürək-damar, Hematoloji, İmmun və Tənəffüs',
    items: [
      { code: 'b410', label: 'Ürək funksiyaları' },
      { code: 'b420', label: 'Qan təzyiqi funksiyaları' },
      { code: 'b430', label: 'Hematoloji sistem funksiyaları' },
      { code: 'b435', label: 'İmmun sistem funksiyaları' },
      { code: 'b440', label: 'Tənəffüs funksiyaları' },
    ],
  },
  {
    title: 'B5 — Həzm, Metabolizm, Endokrin',
    items: [
      { code: 'b510', label: 'Qida qəbulu funksiyaları' },
      { code: 'b515', label: 'Həzm funksiyaları' },
      { code: 'b525', label: 'Defekasiya (bağırsaq boşalması) funksiyaları' },
      { code: 'b540', label: 'Ümumi metabolik funksiyalar' },
    ],
  },
  {
    title: 'B6 — Sidik-Cinsiyyət və Reproduktiv',
    items: [
      { code: 'b610', label: 'Sidik ifrazı funksiyaları' },
      { code: 'b620', label: 'Sidik atma funksiyaları' },
      { code: 'b640', label: 'Cinsi funksiyalar' },
    ],
  },
  {
    title: 'B7 — Neyro-əzələ-skelet və Hərəkətlə Bağlı Funksiyalar',
    items: [
      { code: 'b710', label: 'Oynaqların hərəkətliliyi (mobillik)' },
      { code: 'b730', label: 'Əzələ gücü funksiyaları' },
      { code: 'b735', label: 'Əzələ tonusu funksiyaları' },
      { code: 'b750', label: 'Motor refleks funksiyaları' },
      { code: 'b755', label: 'İxtiyarsız hərəkət reaksiyaları' },
      { code: 'b760', label: 'İxtiyari hərəkətlərin idarə olunması' },
    ],
  },
  {
    title: 'B8 — Dəri və Əlaqədar Strukturlar',
    items: [
      { code: 'b810', label: 'Dərinin qoruyucu funksiyaları' },
      { code: 'b850', label: 'Tüklərin funksiyaları' },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

const EMPTY_FORM = {
  dolduran_ad: '',
  ...Object.fromEntries(ALL_ITEMS.map((i) => [i.code, null])),
};

export default function SectionB2B8({ usaq, profile }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_b2b8',
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
      <Card title="Qiymətləndirməni dolduran">
        <Field label="Həkimin S.A.A">
          <input
            type="text"
            value={form.dolduran_ad || ''}
            onChange={(e) => setField('dolduran_ad', e.target.value)}
            placeholder={profile?.ad || 'Ad Soyad'}
            className={inputClass}
          />
        </Field>
      </Card>

      <ScoreLegend />

      {GROUPS.map((group) => (
        <Card key={group.title} title={group.title}>
          <div>
            {group.items.map((item) => (
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
      ))}

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}
