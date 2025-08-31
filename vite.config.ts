import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9001,
    host: true
  },
  define: {
    // Force the correct environment variables
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('http://localhost:54321'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'),
    'import.meta.env.VITE_SNAPTRADE_CLIENT_ID': JSON.stringify('MY-ORG-TEST-LWFXD'),
    'import.meta.env.VITE_SNAPTRADE_CONSUMER_KEY': JSON.stringify('hEOBJ8yEdqFxg61hs3LNWNIf0OxRyeeYLs4cV8ijMVMd1H81BY'),
    'import.meta.env.VITE_SNAPTRADE_REDIRECT_URL': JSON.stringify('http://localhost:9001/snaptrade-callback')
  }
})
