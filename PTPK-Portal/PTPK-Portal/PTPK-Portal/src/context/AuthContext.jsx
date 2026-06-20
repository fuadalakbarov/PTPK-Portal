import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ptpk_profile';

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    // 1. Supabase ilə anonim sessiya aç (RLS-in işləməsi üçün lazımdır,
    //    istifadəçi bunu görmür)
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Anonim giriş xətası:', error);
      }
    }

    // 2. Yadda saxlanmış profili oxu
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Köhnə ad/PIN axınından qalan profilləri tək giriş axınına uyğunlaşdır
        if (parsed.id !== 'admin') {
          const migrated = { id: 'admin', ad: 'Komissiya', rol: 'admin' };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          setProfile(migrated);
        } else {
          setProfile(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }

  function login(profileData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    setProfile(profileData);
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }

  const value = {
    profile,
    loading,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
