import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://whtxanwhprwxahgwiorg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodHhhbndocHJ3eGFoZ3dpb3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjc3NzcsImV4cCI6MjA5NDgwMzc3N30.8fDl6UPOIML7abawFrEH-JUkln-q244MEcVsLtrloeo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
