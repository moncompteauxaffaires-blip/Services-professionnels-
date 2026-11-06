import { createClient } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'company' | 'professional';

export type AppProfile = {
  id: string;
  role: AppRole;
  display_name: string | null;
};

const validRoles: AppRole[] = ['admin', 'company', 'professional'];

export async function getCurrentProfile(): Promise<AppProfile | null> {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const role = data.role;
  if (!validRoles.includes(role as AppRole)) {
    return null;
  }

  return {
    id: data.id,
    display_name: data.display_name,
    role: role as AppRole,
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
