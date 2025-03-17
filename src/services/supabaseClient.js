import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://SEU-SUPABASE-URL.supabase.co";
const supabaseKey = "SEU-CHAVE-PRIVADA";

export const supabase = createClient(supabaseUrl, supabaseKey);
