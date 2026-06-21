import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IconDeviceFloppy, IconLoader2, IconCheck } from '@tabler/icons-react';
import { SCHOOL_GROUPS } from '../utils/schoolList';

const SINIF_OPTIONS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
];

const TEDRIS_DILI_OPTIONS = [
  { value: 'azerbaycan', label: 'Azərbaycan dili' },
  { value: 'rus', label: 'Rus dili' },
  { value: 'diger', label: 'Digər' },
];

const YASAYIS_TIPI_OPTIONS = [
  { value: 'seher', label: 'Şəhər' },
  { value: 'rayon_merkezi', label: 'Rayon mərkəzi' },
  { value: 'kend', label: 'Kənd' },
];

const HIMAYE_OPTIONS = [
  { value: 'her_iki_valideyn', label: 'Hər iki valideyn' },
  { value: 'tek_ana', label: 'Tək ana' },
  { value: 'tek_ata', label: 'Tək ata' },
  { value: 'resmi_qeyyum', label: 'Rəsmi qəyyum' },
  { value: 'kimsesiz', label: 'Kimsəsiz' },
];

const EMPTY_FORM = {
  a1_tarix: '',
  a2_qeydiyyat_nomresi: '',
  a3_ptpk: 'PTPK',
  c1_saa: '',
  c2_cinsi: '',
  c3_dogum_tarixi: '',
  c4_seher: '',
  c5_yasayis_yeri_tipi: '',
  c6_qeydiyyat_unvan: '',
  c7_yasadigi_unvan: '',
  c8_shadahatname_var: false,
  c9_yasayis_arayish_var: false,
  g1_himaye_statusu: '',
  g2_valideyn_saa: '',
  g3_telefon: '',
  g4_arize_var: false,
  g5_vesiqe_var: false,
  h6_sinif: '',
  h7_tedris_dili: '',
  mekteb_adi: '',
};

export default function SectionC({ usaq, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [eyniUnvan, setEyniUnvan] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usaq) {
      const merged = { ...EMPTY_FORM };
      Object.keys(EMPTY_FORM).forEach((key) => {
        if (usaq[key] !== null && usaq[key] !== undefined) {
          merged[key] = usaq[key];
        }
      });
      setForm(merged);
      if (
        merged.c6_qeydiyyat_unvan &&
        merged.c6_qeydiyyat_unvan === merged.c7_yasadigi_unvan
      ) {
        setEyniUnvan(true);
      }
    }
  }, [usaq]);

  function handleChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'c6_qeydiyyat_unvan' && eyniUnvan) {
        next.c7_yasadigi_unvan = value;
      }
      return next;
    });
    setSaved(false);
  }

  function handleEyniUnvanToggle(checked) {
    setEyniUnvan(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, c7_yasadigi_unvan: prev.c6_qeydiyyat_unvan }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const { error } = await supabase
      .from('usaqlar')
      .update(form)
      .eq('id', usaq.id);

    setSaving(false);

    if (error) {
      setError('Yadda saxlanmadı: ' + error.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (onSaved) onSaved({ ...usaq, ...form });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* A Bölməsi */}
      <Card title="A Bölməsi — Ümumi qeydiyyat">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="A.1 Tarix">
            <input
              type="date"
              value={form.a1_tarix || ''}
              onChange={(e) => handleChange('a1_tarix', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="A.2 Qeydiyyat nömrəsi">
            <input
              type="text"
              value={form.a2_qeydiyyat_nomresi || ''}
              onChange={(e) => handleChange('a2_qeydiyyat_nomresi', e.target.value)}
              placeholder="Məs: 123/2026"
              className={inputClass}
            />
          </Field>
          <Field label="A.3 Müayinə aparan PTPK">
            <input
              type="text"
              value={form.a3_ptpk || ''}
              onChange={(e) => handleChange('a3_ptpk', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Məktəb (uşağın təhsil aldığı müəssisə)" full>
            <select
              value={form.mekteb_adi || ''}
              onChange={(e) => handleChange('mekteb_adi', e.target.value)}
              className={inputClass}
            >
              <option value="">— Məktəb seçin —</option>
              {SCHOOL_GROUPS.map((group) => (
                <optgroup key={group.label} label={`📍 ${group.label}`}>
                  {group.schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      {/* C Bölməsi */}
      <Card title="C Bölməsi — Uşaq haqqında məlumat">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="C.1 S.A.A (Uşağın tam adı)" full>
            <input
              type="text"
              value={form.c1_saa || ''}
              onChange={(e) => handleChange('c1_saa', e.target.value)}
              placeholder="Soyadı Adı Atasının adı"
              className={inputClass}
            />
          </Field>

          <Field label="C.2 Cinsi">
            <div className="flex gap-4 pt-1">
              <RadioOption
                name="c2_cinsi"
                value="qadin"
                checked={form.c2_cinsi === 'qadin'}
                onChange={() => handleChange('c2_cinsi', 'qadin')}
                label="Qadın"
              />
              <RadioOption
                name="c2_cinsi"
                value="kisi"
                checked={form.c2_cinsi === 'kisi'}
                onChange={() => handleChange('c2_cinsi', 'kisi')}
                label="Kişi"
              />
            </div>
          </Field>

          <Field label="C.3 Doğum tarixi">
            <input
              type="date"
              value={form.c3_dogum_tarixi || ''}
              onChange={(e) => handleChange('c3_dogum_tarixi', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="C.4 Yaşadığı şəhər/rayon">
            <input
              type="text"
              value={form.c4_seher || ''}
              onChange={(e) => handleChange('c4_seher', e.target.value)}
              placeholder="Məs: Gəncə"
              className={inputClass}
            />
          </Field>

          <Field label="C.5 Yaşayış yerinin tipi">
            <select
              value={form.c5_yasayis_yeri_tipi || ''}
              onChange={(e) => handleChange('c5_yasayis_yeri_tipi', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {YASAYIS_TIPI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <div />

          <Field label="C.6 Qeydiyyat olduğu ünvan" full>
            <input
              type="text"
              value={form.c6_qeydiyyat_unvan || ''}
              onChange={(e) => handleChange('c6_qeydiyyat_unvan', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="C.7 Hazırda yaşadığı ünvan" full>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={eyniUnvan}
                  onChange={(e) => handleEyniUnvanToggle(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Qeydiyyat ünvanı ilə eynidir
              </label>
              <input
                type="text"
                value={form.c7_yasadigi_unvan || ''}
                onChange={(e) => handleChange('c7_yasadigi_unvan', e.target.value)}
                disabled={eyniUnvan}
                className={`${inputClass} ${eyniUnvan ? 'bg-slate-50 text-slate-400' : ''}`}
              />
            </div>
          </Field>

          <Field label="Sənədlər" full>
            <div className="flex flex-wrap gap-4">
              <CheckboxOption
                checked={form.c8_shadahatname_var}
                onChange={(v) => handleChange('c8_shadahatname_var', v)}
                label="C.8 Doğum şəhadətnaməsinin surəti var"
              />
              <CheckboxOption
                checked={form.c9_yasayis_arayish_var}
                onChange={(v) => handleChange('c9_yasayis_arayish_var', v)}
                label="C.9 Yaşayış yeri arayışı var"
              />
            </div>
          </Field>
        </div>
      </Card>

      {/* G Bölməsi */}
      <Card title="G Bölməsi — Himayədar / Valideyn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="G.1 Himayə statusu">
            <select
              value={form.g1_himaye_statusu || ''}
              onChange={(e) => handleChange('g1_himaye_statusu', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {HIMAYE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <div />

          <Field label="G.2 Valideynin/Qəyyumun S.A.A" full>
            <input
              type="text"
              value={form.g2_valideyn_saa || ''}
              onChange={(e) => handleChange('g2_valideyn_saa', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="G.3 Valideynin telefon nömrəsi">
            <input
              type="tel"
              value={form.g3_telefon || ''}
              onChange={(e) => handleChange('g3_telefon', e.target.value)}
              placeholder="+994 XX XXX XX XX"
              className={inputClass}
            />
          </Field>

          <div />

          <Field label="Sənədlər" full>
            <div className="flex flex-wrap gap-4">
              <CheckboxOption
                checked={form.g4_arize_var}
                onChange={(v) => handleChange('g4_arize_var', v)}
                label="G.4 Ərizə var"
              />
              <CheckboxOption
                checked={form.g5_vesiqe_var}
                onChange={(v) => handleChange('g5_vesiqe_var', v)}
                label="G.5 Vəsiqə var"
              />
            </div>
          </Field>
        </div>
      </Card>

      {/* H Bölməsi */}
      <Card title="H Bölməsi — Təhsil">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="H.6 Təhsil aldığı sinif">
            <select
              value={form.h6_sinif || ''}
              onChange={(e) => handleChange('h6_sinif', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {SINIF_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === '0' ? 'Hazırlıq (0)' : `${s}-ci sinif`}
                </option>
              ))}
            </select>
          </Field>

          <Field label="H.7 Tədris dili">
            <select
              value={form.h7_tedris_dili || ''}
              onChange={(e) => handleChange('h7_tedris_dili', e.target.value)}
              className={inputClass}
            >
              <option value="">Seçin...</option>
              {TEDRIS_DILI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-0 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <IconCheck size={16} /> Məlumatlar yadda saxlanıldı
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {saving ? (
            <IconLoader2 size={16} className="animate-spin" />
          ) : (
            <IconDeviceFloppy size={16} />
          )}
          Məlumatları Yadda Saxla
        </button>
      </div>
    </div>
  );
}

// --- Köməkçi komponentlər ---

const inputClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white';

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="text-blue-600 focus:ring-blue-500"
      />
      {label}
    </label>
  );
}

function CheckboxOption({ checked, onChange, label }) {
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
