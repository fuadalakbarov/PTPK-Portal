import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('istifadeciler')
      .select('id, ad, rol')
      .order('ad');

    if (error) {
      console.error('İstifadəçi siyahısı yüklənmədi:', error);
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedId) {
      setError('Adınızı seçin');
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from('istifadeciler')
      .select('id, ad, rol')
      .eq('id', selectedId)
      .single();

    setSubmitting(false);

    if (error || !data) {
      setError('Xəta baş verdi, yenidən cəhd edin');
      return;
    }

    login({ id: data.id, ad: data.ad, rol: data.rol });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">PTPK Portalı</h1>
          <p className="text-sm text-slate-500 mt-1">
            Psixoloji-Tibbi-Pedaqoji Komissiya
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Adınız
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
            >
              <option value="">
                {loadingUsers ? 'Yüklənir...' : 'Seçin...'}
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.ad} — {ROL_LABEL[u.rol] || u.rol}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {submitting ? 'Yoxlanılır...' : 'Daxil ol'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <a
          href="https://ptpk.onrender.com/komissiya.html"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← Əsas səhifəyə qayıt
        </a>
      </div>
    </div>
  );
}

const ROL_LABEL = {
  admin: 'Admin',
  katib: 'Katib',
  hekim: 'Həkim',
  psixoloq: 'Psixoloq',
  pedaqoq: 'Pedaqoq',
  sosial_isci: 'Sosial işçi',
  sedr: 'Sədr',
};
