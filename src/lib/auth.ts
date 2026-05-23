import { supabase } from "./supabase";

// ✅ REGISTER
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("SignUp error:", error.message);
    return null;
  }

  return data;
}

// ✅ LOGIN
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("SignIn error:", error.message);
    return null;
  }

  return data;
}

// ✅ LOGOUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("SignOut error:", error.message);
  }
}

// ✅ SAFE SESSION (CRUCIAAL)
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log("Session error:", error.message);
    return null;
  }

  if (!data?.session) {
    // ✅ GEEN fout → gewoon geen sessie
    return null;
  }

  return data.session;
}

// ✅ SAFE USER
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("User error:", error.message);
    return null;
  }

  return data.user ?? null;
}

// ✅ AUTH LISTENER
export function onAuthStateChange(callback: (email: string | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.email ?? null);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
