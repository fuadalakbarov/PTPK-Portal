import { useState } from 'react';
import { useBolme } from '../hooks/useBolme';
import { Card, Field, ScoreField, ScoreLegend, SaveBar, inputClass } from './ui';
import { IconLoader2, IconSchool, IconUsersGroup } from '@tabler/icons-react';

// ---------------- D Bölməsi (Pedaqoq) ----------------

const D_GROUPS = [
  {
    title: 'D1 — Biliklərin Öyrənilməsi və Tətbiqi',
    items: [
      { code: 'd120', label: 'Digər məqsədli hiss etmə (eşitmə, görmə ilə öyrənmə)' },
      { code: 'd130', label: 'Köçürmə / Kopyalama' },
      { code: 'd133', label: 'Dil bacarıqlarının qazanılması' },
      { code: 'd137', label: 'Anlayışların qazanılması (rəng, ölçü, say və s.)' },
      { code: 'd140', label: 'Oxumağı öyrənmə' },
      { code: 'd145', label: 'Yazmağı öyrənmə' },
      { code: 'd150', label: 'Hesablamağı öyrənmə' },
      { code: 'd160', label: 'Diqqəti cəmləmə' },
      { code: 'd175', label: 'Problemləri həll etmə' },
      { code: 'd176', label: 'Qərar vermə' },
    ],
  },
  {
    title: 'D2 — Ümumi Tapşırıqlar və Tələblər',
    items: [
      { code: 'd210', label: 'Tək tapşırığı yerinə yetirmə' },
      { code: 'd220', label: 'Çoxsaylı tapşırıqları yerinə yetirmə' },
      { code: 'd230', label: 'Gündəlik fəaliyyəti planlaşdırma və icra etmə' },
      { code: 'd250', label: 'Öz davranışını idarə etmə' },
    ],
  },
  {
    title: 'D3 — Ünsiyyət',
    items: [
      { code: 'd310', label: 'Şifahi mesajları başa düşmə' },
      { code: 'd315', label: 'Qeyri-şifahi mesajları başa düşmə (jest, mimika)' },
      { code: 'd330', label: 'Danışma' },
      { code: 'd335', label: 'Qeyri-şifahi mesajların istehsalı (jest, işarə)' },
    ],
  },
  {
    title: 'D4 — Hərəkətlilik',
    items: [
      { code: 'd410', label: 'Bədən vəziyyətini dəyişdirmə (oturma, qalxma)' },
      { code: 'd415', label: 'Bədən vəziyyətini saxlama' },
      { code: 'd430', label: 'Əşyaları qaldırma və daşıma' },
      { code: 'd435', label: 'Aşağı ətraflarla əşyaları hərəkət etdirmə' },
      { code: 'd445', label: 'Əl və qolun istifadəsi (tutma, əşya ilə işləmə)' },
      { code: 'd450', label: 'Gəzmə / yeriş' },
    ],
  },
  {
    title: 'D5 — Özünə Qulluq',
    items: [
      { code: 'd510', label: 'Özünü yumaq' },
      { code: 'd530', label: 'Tualet ehtiyaclarını ödəmə' },
      { code: 'd540', label: 'Geyinmə' },
      { code: 'd550', label: 'Yemək' },
      { code: 'd560', label: 'İçmək' },
      { code: 'd571', label: 'Öz sağlamlığına nəzarət' },
    ],
  },
  {
    title: 'D7 — Şəxsiyyətlərarası Münasibətlər',
    items: [
      { code: 'd710', label: 'Əsas şəxsiyyətlərarası münasibətlər (yaşıdları ilə)' },
      { code: 'd720', label: 'Mürəkkəb şəxsiyyətlərarası münasibətlər (qrup daxilində)' },
    ],
  },
  {
    title: 'D8 — Əsas Həyat Sahələri',
    items: [
      { code: 'd815', label: 'Məktəbəqədər təhsilə cəlb olunma' },
      { code: 'd880', label: 'Oyun fəaliyyətinə cəlb olunma' },
    ],
  },
];

const D_ALL_ITEMS = D_GROUPS.flatMap((g) => g.items);

const D_EMPTY_FORM = {
  h12_qiymet_cedveli: '',
  ...Object.fromEntries(D_ALL_ITEMS.map((i) => [i.code, null])),
};

function PedaqoqForm({ usaqId, profile }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_d',
    usaqId,
    D_EMPTY_FORM
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
        <IconLoader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card title="H.12 — Qiymətləndirmə cədvəli">
        <div className="grid grid-cols-1 gap-4">
          <Field label="İstifadə olunan qiymətləndirmə cədvəli">
            <input
              type="text"
              value={form.h12_qiymet_cedveli || ''}
              onChange={(e) => setField('h12_qiymet_cedveli', e.target.value)}
              placeholder="Məs: Portage inkişaf cədvəli"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <ScoreLegend />

      {D_GROUPS.map((group) => (
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

// ---------------- E1 Bölməsi (Sosial İşçi) ----------------

const E_ITEMS = [
  { code: 'e100', label: 'Ailənin maddi-məişət şəraiti (yaşayış sahəsi, şərait)' },
  { code: 'e110', label: 'Ailənin gəlir səviyyəsi və maliyyə vəziyyəti' },
  { code: 'e120', label: 'Uşağın yaşadığı mühitin təhlükəsizliyi' },
  { code: 'e130', label: 'Ailədaxili münasibətlər və emosional dəstək' },
  { code: 'e140', label: 'Valideyn nəzarəti və qayğısı' },
  { code: 'e145', label: 'Sosial xidmətlərdən (müavinət, reabilitasiya) istifadə imkanları' },
  { code: 'e146', label: 'Məktəblə əlaqə və davamiyyət vəziyyəti' },
];

const E_EMPTY_FORM = {
  qeyd: '',
  ...Object.fromEntries(E_ITEMS.map((i) => [i.code, null])),
};

function SosialIsciForm({ usaqId, profile }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_e1',
    usaqId,
    E_EMPTY_FORM
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
        <IconLoader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScoreLegend />

      <Card title="E1 — Ailə və Mühit Faktorları">
        <div>
          {E_ITEMS.map((item) => (
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

      <Card title="Əlavə qeydlər">
        <textarea
          value={form.qeyd || ''}
          onChange={(e) => setField('qeyd', e.target.value)}
          rows={4}
          placeholder="Ailə vəziyyəti, məişət şəraiti və digər müşahidələr haqqında qeydlər..."
          className={inputClass}
        />
      </Card>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}

// ---------------- Əsas komponent ----------------

export default function SectionDE({ usaq, profile }) {
  const [tab, setTab] = useState('pedaqoq');

  return (
    <div className="max-w-3xl">
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('pedaqoq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'pedaqoq'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <IconSchool size={16} />
          D — Pedaqoq Qiymətləndirməsi
        </button>
        <button
          onClick={() => setTab('sosial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'sosial'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <IconUsersGroup size={16} />
          E1 — Sosial İşçi Qiymətləndirməsi
        </button>
      </div>

      {tab === 'pedaqoq' ? (
        <PedaqoqForm usaqId={usaq?.id} profile={profile} />
      ) : (
        <SosialIsciForm usaqId={usaq?.id} profile={profile} />
      )}
    </div>
  );
}
