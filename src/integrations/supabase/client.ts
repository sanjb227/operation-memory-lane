// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://epukqhdfdoxvowyflral.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdWtxaGRmZG94dm93eWZscmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjcwMjIsImV4cCI6MjA2NDMwMzAyMn0.1qVeLYo8e8Nt-u5yQsGcEmrTfqlCitpbpOm-b1NRtNQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);