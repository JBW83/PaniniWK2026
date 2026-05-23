import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://ftmpfcjztwztcpmrzhqr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bXBmY2p6dHd6dGNwbXJ6aHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTAzNTEsImV4cCI6MjA5NTAyNjM1MX0.5t0UT1A0jAOzJ6NRZdGtgzhTv49JZ5X2Wf7Au7Ndc1A";

// ✅ kies juiste storage per platform
const storage =
  Platform.OS === "web" ? undefined : AsyncStorage;

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);