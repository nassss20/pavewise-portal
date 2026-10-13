import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  alert("FATAL ERROR: Supabase Environment Variables are missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel and Redeploy!");
}

export const supabase = createClient(supabaseUrl || 'https://fallback.supabase.co', supabaseAnonKey || 'fallback-key');

// Auth Functions using native Supabase Auth
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return { message: 'Logged out successfully' };
};

export const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return session;
};

// Projects CRUD Functions
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('road_projects')
    .select('*')
    .order('id', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
};

export const fetchLccaResults = async () => {
  const { data, error } = await supabase
    .from('lcca_results')
    .select('*')
    .order('ranking', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
};

export const createProject = async (projectData) => {
  // Remove id if it exists so Postgres can auto-increment
  const { id, ...payload } = projectData;
  
  const { data, error } = await supabase
    .from('road_projects')
    .insert([payload])
    .select();
    
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateProject = async (projectData) => {
  const { id, ...payload } = projectData;
  
  const { data, error } = await supabase
    .from('road_projects')
    .update(payload)
    .eq('id', id)
    .select();
    
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteProject = async (id) => {
  const { data, error } = await supabase
    .from('road_projects')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(error.message);
  return data;
};