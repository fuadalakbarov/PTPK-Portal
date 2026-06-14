import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { exportUsaqlarToExcel } from '../utils/exportExcel';
import { generateUsaqPdf } from '../utils/exportPdf';
import {
  IconUsers,
  IconPlus,
  IconSearch,
  IconFileSpreadsheet,
  IconLoader2,
  IconTrash,
  IconChevronRight,
  IconFileTypePdf,
} from '@tabler/icons-react';

const STATUS_LABEL = {
  yeni: 'Yeni',
  hekim_gozleyir: 'Həkim gözləyir',
  psixoloq_gozleyir: 'Psixoloq gözləyir',
  pedaqoq_gozleyir: 'Pedaqoq gözləyir',
  sosial_gozleyir: 'Sosial işçi gözləyir',
  yekunlasdirilir: 'Yekunlaşdırılır',
  tamamlandi: 'Tamamlandı',
};

const STATUS_COLOR = {
  yeni: 'bg-slate-100 text-slate-600',
  hekim_gozleyir: 'bg-amber-50 text-amber-700',
  psixoloq_gozleyir: 'bg-amber-50 text-amber-700',
  pedaqoq_gozleyir: 'bg-amber-50 text-amber-700',
  sosial_gozleyir: 'bg-amber-50 text-amber-700',
  yekunlasdirilir: 'bg-blue-50 text-blue-700',
  tamamlandi: 'bg-green-50 text-green-700',
};

export default function Dashboard({ onOpenUsaq }) {
  const [usaqlar, setUsaqlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('hamisi');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsaqlar();
  }, []);

  async function fetchUsaqlar() {
    setLoading(true);
    const { data, error } = await supabase
      .from('usaqlar')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Siyahı yüklənmədi: ' + error.message);
    } else {
      setUsaqlar(data || []);
    }
    setLoading(false);
  }

  async function handleYeniUsaq() {
    setCreating(true);
    setError('');

    const { data, error } = await supabase
      .from('usaqlar')
      .insert({
        a1_tarix: new Date().toISOString().slice(0, 10),
        a3_ptpk: 'PTPK',
        status: 'yeni',
      })
      .select()
      .single();

    setCreating(false);

    if (error) {
      setError('Yeni qeydiyyat yaradılmadı: ' + error.message);
      return;
    }

    onOpenUsaq(data.id);
  }

  async function handleSil(e, id) {
    e.stopPropagation();
    if (!confirm('Bu qeydiyyatı silmək istədiyinizə əminsiniz?')) return;

    const { error } = await supabase.from('usaqlar').delete().eq('id', id);
    if (error) {
      setError('Silinmədi: ' + error.message);
      return;
    }
    setUsaqlar((prev) => prev.filter((u) => u.id !== id));
  }

  const filtered = usaqlar.filter((u) => {
    const matchesSearch =
      !search ||
      (u.c1_saa || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.a2_qeydiyyat_nomresi || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'hamisi' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Uşaqlar Siyahısı
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            PTPK-da qeydiyyatdan keçən uşaqların ümumi siyahısı
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportUsaqlarToExcel(usaqlar)}
            disabled={usaqlar.length === 0}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <IconFileSpreadsheet size={16} />
            Excel-ə ixrac et
          </button>

          <button
            onClick={handleYeniUsaq}
            disabled={creating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {creating ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconPlus size={16} />
            )}
            Yeni Uşaq
          </button>
        </div>
      </div>

      {/* Axtarış və filtrlər */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad və ya qeydiyyat № üzrə axtar..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="hamisi">Bütün statuslar</option>
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Siyahı */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex items-center justify-center">
          <IconLoader2 size={24} className="animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <IconUsers size={26} className="text-slate-400" />
          </div>
          <h2 className="text-sm font-medium text-slate-700">
            {usaqlar.length === 0
              ? 'Hələ heç bir uşaq qeydiyyatdan keçməyib'
              : 'Axtarışa uyğun nəticə tapılmadı'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            {usaqlar.length === 0 &&
              '"Yeni Uşaq" düyməsinə basaraq qeydiyyata başlayın.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Qeydiyyat №</th>
                <th className="px-4 py-3">S.A.A</th>
                <th className="px-4 py-3">Doğum tarixi</th>
                <th className="px-4 py-3">Sinif</th>
                <th className="px-4 py-3">Şəhər/Rayon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => onOpenUsaq(u.id)}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">
                    {u.a2_qeydiyyat_nomresi || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.c1_saa || 'Adsız qeydiyyat'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {u.c3_dogum_tarixi || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {u.h6_sinif || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {u.c4_seher || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLOR[u.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {STATUS_LABEL[u.status] || u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); generateUsaqPdf(u.id); }}
                        className="text-slate-300 hover:text-blue-500 p-1 transition-colors"
                        title="PDF endir"
                      >
                        <IconFileTypePdf size={15} />
                      </button>
                      <button
                        onClick={(e) => handleSil(e, u.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                        title="Sil"
                      >
                        <IconTrash size={15} />
                      </button>
                      <IconChevronRight size={15} className="text-slate-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
