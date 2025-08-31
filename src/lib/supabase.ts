import { createClient } from '@supabase/supabase-js'

// Debug: Log what environment variables we're getting
console.log('🔍 Environment variables:')
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' + import.meta.env.VITE_SUPABASE_ANON_KEY.slice(-10) : 'undefined')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

console.log('🔧 Using Supabase URL:', supabaseUrl)
console.log('🔧 Using Supabase Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : 'undefined')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
