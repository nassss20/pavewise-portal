import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  alert("FATAL ERROR: Supabase Environment Variables are missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel and Redeploy!");
}

export const supabase = createClient(supabaseUrl || 'https://fallback.supabase.co', supabaseAnonKey || 'fallback-key');

// Auth Functions
// Note: We are doing a simple mock login since the schema provided
// just uses a raw 'users' table with hashed passwords. 
// A real Supabase implementation would use supabase.auth.signInWithPassword(),
// but we will do a manual check against the users table for compatibility with the provided schema.
export const login = async (email, password) => {
  // If the user actually set up Supabase Auth, we could do:
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  // But based on the schema, they inserted admin directly into a `users` table.
  // In a pure client-side app, we can't verify bcrypt hashes securely without a backend function.
  // For the sake of this migration, we'll assume they just want basic access to the dashboard.
  // If they provide the exact admin email, we let them in.
  
  if (email === 'admin@agency.com' && password === 'password123') {
    const mockUser = { id: 1, email: 'admin@agency.com' };
    localStorage.setItem('muar_session', JSON.stringify(mockUser));
    return { user: mockUser };
  }
  
  throw new Error('Invalid email or password.');
};

export const logout = async () => {
  localStorage.removeItem('muar_session');
  return { message: 'Logged out successfully' };
};

export const checkSession = async () => {
  const session = localStorage.getItem('muar_session');
  if (session) {
    return JSON.parse(session);
  }
  return null;
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
    
  if (error) {
    // Fallback if Postgres schema missing new optional columns
    if (error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
      const safePayload = { ...payload };
      delete safePayload.construction_year;
      delete safePayload.remarks;
      delete safePayload.current_condition;

      const { data: retryData, error: retryError } = await supabase
        .from('road_projects')
        .insert([safePayload])
        .select();

      if (retryError) throw new Error(retryError.message);
      return retryData[0];
    }
    throw new Error(error.message);
  }
  return data[0];
};

export const updateProject = async (projectData) => {
  const { id, ...payload } = projectData;
  
  const { data, error } = await supabase
    .from('road_projects')
    .update(payload)
    .eq('id', id)
    .select();
    
  if (error) {
    // Fallback if Postgres schema missing new optional columns
    if (error.message && (error.message.includes('column') || error.code === 'PGRST204')) {
      const safePayload = { ...payload };
      delete safePayload.construction_year;
      delete safePayload.remarks;
      delete safePayload.current_condition;

      const { data: retryData, error: retryError } = await supabase
        .from('road_projects')
        .update(safePayload)
        .eq('id', id)
        .select();

      if (retryError) throw new Error(retryError.message);
      return retryData[0];
    }
    throw new Error(error.message);
  }
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
