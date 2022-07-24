import { createClient } from "@supabase/supabase-js";

export default createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.VUE_APP_SUPABASE_ANON_KEY
);
