import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wrmwabyfumykykkxqrm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybXdhYnlmdW15a3lra3hxcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMzAwODMsImV4cCI6MjEwODYwNjA4M30.3nQxqUkRJSZpwpX6S8t2ECM5v3IixrCf53LwVAMxixE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
