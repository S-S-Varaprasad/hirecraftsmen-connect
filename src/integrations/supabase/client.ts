// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://myrztsvambwrkusxxatm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnp0c3ZhbWJ3cmt1c3h4YXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjExMjMsImV4cCI6MjA1NzU5NzEyM30.e4ZArV9YTi84rsQu9hXqVVlGAVCPu2e88_rrng49Yes";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);