import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UsaqDetay from './pages/UsaqDetay';
import { IconLoader2 } from '@tabler/icons-react';

function AppContent() {
  const { profile, loading, signOut } = useAuth();
  const [view, setView] = useState({ name: 'dashboard' });
  const [selectedUsaq, setSelectedUsaq] = useState(null);

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
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar
        view={view}
        setView={setView}
        selectedUsaq={selectedUsaq}
        profile={profile}
        onSignOut={signOut}
      />
      <main className="flex-1">
        {view.name === 'dashboard' && (
          <Dashboard
            onOpenUsaq={(usaqId) => {
              setView({ name: 'usaq', usaqId, section: 'C' });
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
