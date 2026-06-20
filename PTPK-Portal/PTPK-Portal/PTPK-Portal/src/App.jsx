import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UsaqDetay from './pages/UsaqDetay';
import { IconLoader2, IconMenu2 } from '@tabler/icons-react';

function AppContent() {
  const { profile, loading, signOut } = useAuth();
  const [view, setView] = useState({ name: 'dashboard' });
  const [selectedUsaq, setSelectedUsaq] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Seçilmiş uşağın məlumatını yüklə (sidebar başlığı üçün)
  useEffect(() => {
    if (view.name === 'usaq' && view.usaqId) {
      supabase
        .from('usaqlar')
        .select('*')
        .eq('id', view.usaqId)
        .single()
        .then(({ data, error }) => {
          if (!error) setSelectedUsaq(data);
        });
    }
  }, [view]);

  // Bölmə dəyişdikdə mobil menyunu avtomatik bağla
  function handleSetView(newView) {
    setView(newView);
    setSidebarOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <IconLoader2 size={28} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return <Login />;
  }

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
      {/* Mobil üst zolaq */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PTPK" className="w-7 h-7 flex-shrink-0" />
          <span className="font-serif text-sm font-bold text-[#0d1b2a]">
            Şagird Qiymətləndirməsi
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Menyu aç"
          className="p-2 -mr-2 text-slate-600"
        >
          <IconMenu2 size={22} />
        </button>
      </div>

      {/* Mobil arxa fon (sidebar açıq olanda) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        view={view}
        setView={handleSetView}
        selectedUsaq={selectedUsaq}
        profile={profile}
        onSignOut={signOut}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0">
        {view.name === 'dashboard' && (
          <Dashboard
            onOpenUsaq={(usaqId) => {
              handleSetView({ name: 'usaq', usaqId, section: 'C' });
            }}
          />
        )}

        {view.name === 'usaq' && (
          <UsaqDetay
            usaq={selectedUsaq}
            section={view.section}
            profile={profile}
            onSaved={(updated) => setSelectedUsaq(updated)}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
