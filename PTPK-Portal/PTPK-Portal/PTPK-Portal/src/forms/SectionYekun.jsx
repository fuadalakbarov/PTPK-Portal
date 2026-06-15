import { useState } from 'react';
import { useBolme } from '../hooks/useBolme';
import { supabase } from '../lib/supabase';
import { Card, Field, SaveBar, inputClass } from './ui';
import { IconLoader2, IconGavel, IconFileTypePdf } from '@tabler/icons-react';
import { generateUsaqPdf } from '../utils/exportPdf';

const TEHSIL_FORMASI_OPTIONS = [
  { value: 'evde', label: 'Evdə təhsil' },
  { value: 'umumi', label: 'Ümumi təhsil' },
  { value: 'reabilitasiya', label: 'Reabilitasiya' },
];

const MUESSISE_TIPI_OPTIONS = [
  { value: 'umumi', label: 'Ümumi təhsil müəssisəsi' },
  { value: 'xususi', label: 'Xüsusi təhsil müəssisəsi' },
  
];

const TEHSIL_PROQRAMI_OPTIONS = [
  { value: 'xususi', label: 'Xüsusi təhsil proqramı' },
  { value: 'umumi', label: 'Ümumi təhsil proqramı' },
];

const EMPTY_FORM = {
  komissiya_seheri: '',
  j1_qarar_tarixi: '',
  j2_qarar_nomresi: '',
  k1_tehsil_muessisesi: '',
  k5_quvveden_dusme: '',
  k6_esas: '',
  h8_tehsil_formasi: '',
  h9_muessise_tipi: '',
  h10_tehsil_proqrami: '',
  sedr_ad: '',
  katib_ad: '',
  uzv1_ad: '',
  uzv2_ad: '',
  uzv3_ad: '',
};

export default function SectionYekun({ usaq, profile, onSaved }) {
  const { form, setField, save, loading, saving, saved, error } = useBolme(
    'bolme_yekunlar',
    usaq?.id,
    EMPTY_FORM
  );
  const [statusMsg, setStatusMsg] = useState('');

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
        <IconLoader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  async function handleSave() {
    const ok = await save();
    if (!ok) return;

    // Yekun qərar verildikdə uşağın statusunu "tamamlandı" et
    const { error: statusError } = await supabase
      .from('usaqlar')
      .update({ status: 'tamamlandi' })
      .eq('id', usaq.id);

    if (!statusError) {
      setStatusMsg('Status "Tamamlandı" olaraq yeniləndi');
      setTimeout(() => setStatusMsg(''), 3000);
      if (onSaved) onSaved({ ...usaq, status: 'tamamlandi' });
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card title="J Bölməsi — Komissiya Qərarı">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Komissiyanın şəhəri/rayonu" full>
            <input
              type="text"
              value={form.komissiya_seheri || ''}
              onChange={(e) => setField('komissiya_seheri', e.target.value)}
              placeholder="Məs: Gəncə, Daşkəsən, Goranboy, Samux..."
              className={inputClass}
            />
          </Field>
          <Field label="J.1 Qərar tarixi">
            <input
              type="date"
              value={form.j1_qarar_tarixi || ''}
              onChange={(e) => setField('j1_qarar_tarixi', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="J.2 Qərar nömrəsi">
            <input
              type="text"
              value={form.j2_qarar_nomresi || ''}
              onChange={(e) => setField('j2_qarar_nomresi', e.target.value)}
              placeholder="Məs: 45/2026"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="K Bölməsi — Tövsiyə Edilən Təhsil">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="K.1 Təhsil müəssisəsi" full>
            <input
              type="text"
              value={form.k1_tehsil_muessisesi || ''}
              onChange={(e) => setField('k1_tehsil_muessisesi', e.target.value)}
              placeholder="Müəssisənin adı"
              className={inputClass}
            />
          </Field>

          <Field label="H.8 Təhsil forması">
            <select
              value={form.h8_tehsil_formasi || ''}
              onChange={(e) => setField('h8_tehsil_formasi', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {TEHSIL_FORMASI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="H.9 Müəssisə tipi">
            <select
              value={form.h9_muessise_tipi || ''}
              onChange={(e) => setField('h9_muessise_tipi', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {MUESSISE_TIPI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="H.10 Təhsil proqramı" full>
            <select
              value={form.h10_tehsil_proqrami || ''}
              onChange={(e) => setField('h10_tehsil_proqrami', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {TEHSIL_PROQRAMI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="K.5 Qərarın qüvvədən düşmə tarixi">
            <input
              type="date"
              value={form.k5_quvveden_dusme || ''}
              onChange={(e) => setField('k5_quvveden_dusme', e.target.value)}
              className={inputClass}
            />
          </Field>

          <div />

          <Field label="K.6 Əsas (qərarın əsaslandırılması)" full>
            <textarea
              value={form.k6_esas || ''}
              onChange={(e) => setField('k6_esas', e.target.value)}
              rows={4}
              placeholder="Komissiyanın qərarının əsaslandırılması..."
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Komissiya Üzvləri (İmza üçün)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Sədr">
            <input
              type="text"
              value={form.sedr_ad || ''}
              onChange={(e) => setField('sedr_ad', e.target.value)}
              placeholder="S.A.A"
              className={inputClass}
            />
          </Field>
          <Field label="Katib">
            <input
              type="text"
              value={form.katib_ad || ''}
              onChange={(e) => setField('katib_ad', e.target.value)}
              placeholder="S.A.A"
              className={inputClass}
            />
          </Field>
          <Field label="Üzv 1">
            <input
              type="text"
              value={form.uzv1_ad || ''}
              onChange={(e) => setField('uzv1_ad', e.target.value)}
              placeholder="S.A.A"
              className={inputClass}
            />
          </Field>
          <Field label="Üzv 2">
            <input
              type="text"
              value={form.uzv2_ad || ''}
              onChange={(e) => setField('uzv2_ad', e.target.value)}
              placeholder="S.A.A"
              className={inputClass}
            />
          </Field>
          <Field label="Üzv 3">
            <input
              type="text"
              value={form.uzv3_ad || ''}
              onChange={(e) => setField('uzv3_ad', e.target.value)}
              placeholder="S.A.A"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {statusMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          <IconGavel size={16} />
          {statusMsg}
        </div>
      )}

      {usaq?.status === 'tamamlandi' && (
        <button
          onClick={() => generateUsaqPdf(usaq.id)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-fit"
        >
          <IconFileTypePdf size={16} />
          Yekun PDF-i Endir / Çap Et
        </button>
      )}

      <SaveBar saving={saving} saved={saved} error={error} onSave={handleSave} />
    </div>
  );
}
