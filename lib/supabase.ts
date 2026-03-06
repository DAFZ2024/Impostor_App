import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = "https://zsbyzneeqqxayiyparok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzYnl6bmVlcXF4YXlpeXBhcm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDI0MDUsImV4cCI6MjA4Nzk3ODQwNX0.rmfRMNULX4cpsGVsyqfhX-pL8KeLI3gpMeRd2BzCgRQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // No aplica en React Native
  },
});
