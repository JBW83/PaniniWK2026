import { createClient } from "@supabase/supabase-js";

// ✅ stabiele setup (later kunnen we env weer netjes doen)
const SUPABASE_URL = "https://ftmpfcjztwztcpmrzhqr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bXBmY2p6dHd6dGNwbXJ6aHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTAzNTEsImV4cCI6MjA5NTAyNjM1MX0.5t0UT1A0jAOzJ6NRZdGtgzhTv49JZ5X2Wf7Au7Ndc1A"; // <-- vervang met jouw echte key

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
