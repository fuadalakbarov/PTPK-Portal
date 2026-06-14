import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Bir bölmə cədvəlindəki (bolme_b1, bolme_b2b8 və s.) usaq_id-yə bağlı
 * sətri yükləyir və saxlayır. Sətir yoxdursa, save zamanı yaradılır.
 *
 * @param {string} table - cədvəl adı (məs: 'bolme_b1')
 * @param {string} usaqId - usaqlar.id
 * @param {object} emptyForm - bütün sahələrin defolt boş dəyərləri
 */
export function useBolme(table, usaqId, emptyForm) {
  const [form, setForm] = useState(emptyForm);
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usaqId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usaqId, table]);

  async function load() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('usaq_id', usaqId)
      .maybeSingle();

    if (error) {
      setError('Yüklənmədi: ' + error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setRowId(data.id);
      const merged = { ...emptyForm };
      Object.keys(emptyForm).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          merged[key] = data[key];
        }
      });
      setForm(merged);
    } else {
      setRowId(null);
      setForm(emptyForm);
    }

    setLoading(false);
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError('');
    setSaved(false);

    let result;
    if (rowId) {
      result = await supabase
        .from(table)
        .update(form)
        .eq('id', rowId)
        .select()
        .single();
    } else {
      result = await supabase
        .from(table)
        .insert({ ...form, usaq_id: usaqId })
        .select()
        .single();
    }

    setSaving(false);

    if (result.error) {
      setError('Yadda saxlanmadı: ' + result.error.message);
      return false;
    }

    if (!rowId && result.data) {
      setRowId(result.data.id);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    return true;
  }

  return { form, setField, save, loading, saving, saved, error };
}
