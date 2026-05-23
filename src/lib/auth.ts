import { supabase } from "./supabase";

// ✅ REGISTER
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ✅ LOGIN
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ✅ LOGOUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ✅ CURRENT SESSION
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ✅ CURRENT USER (dit miste bij jou)
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user; // kan null zijn als niet ingelogd
}

// ✅ AUTH STATE LISTENER
export function onAuthStateChange(callback: (email: string | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.email ?? null);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}