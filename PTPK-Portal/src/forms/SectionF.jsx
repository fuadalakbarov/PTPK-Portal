import { useBolme } from '../hooks/useBolme';
import { Card, Field, CheckboxOption, SaveBar, inputClass } from './ui';
import { IconLoader2 } from '@tabler/icons-react';

const EMPTY_FORM = {
  dolduran_ad: '',
  f1_1_diaqnoz: '',
  f1_1_kod: '',
  f1_2_diaqnoz: '',
  f1_2_kod: '',
  f1_3_diaqnoz: '',
  f1_3_kod: '',
  f2_tibbi_arayish_var: false,
};

export default function SectionF({ usaq, profile }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_f',
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

      <Card title="F.1 — Tibbi Diaqnozlar (XBT-10)">
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <Field label={`F.1.${n} — Diaqnoz`} full={false}>
                <input
                  type="text"
                  value={form[`f1_${n}_diaqnoz`] || ''}
                  onChange={(e) => setField(`f1_${n}_diaqnoz`, e.target.value)}
                  placeholder={n === 1 ? 'Əsas diaqnoz' : 'Əlavə diaqnoz'}
                  className={`${inputClass} md:col-span-2`}
                />
              </Field>
              <Field label="XBT-10 kodu">
                <input
                  type="text"
                  value={form[`f1_${n}_kod`] || ''}
                  onChange={(e) => setField(`f1_${n}_kod`, e.target.value)}
                  placeholder="Məs: F70"
                  className={inputClass}
                />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card title="F.2 — Sənədlər">
        <CheckboxOption
          checked={form.f2_tibbi_arayish_var}
          onChange={(v) => setField('f2_tibbi_arayish_var', v)}
          label="Tibbi arayış (xəstəlik tarixçəsi) təqdim olunub"
        />
      </Card>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}
