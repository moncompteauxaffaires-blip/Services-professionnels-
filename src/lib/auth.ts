import { supabase } from './supabase';

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
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, role')
    .eq('id', user.id)
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
