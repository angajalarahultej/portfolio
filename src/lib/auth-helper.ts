import { supabase } from './supabase';

/**
 * Checks if the given email corresponds to the authorized administrator.
 */
export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('NEXT_PUBLIC_ADMIN_EMAIL environment variable is not defined.');
    return false;
  }
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Gets the current logged-in user from Supabase.
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

/**
 * Returns true if there is an active session and the user is the authorized admin.
 */
export async function checkAdminSession(): Promise<boolean> {
  const user = await getCurrentUser();
  return isAdminUser(user?.email);
}
