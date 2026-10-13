import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, login as apiLogin, logout as apiLogout } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(err => {
      console.error("Session check error:", err);
      setSession(null);
      setLoading(false);
    });

    // Listen to Supabase auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setSession(data.session);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);