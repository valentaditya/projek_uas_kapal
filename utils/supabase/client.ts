import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Cek apakah NEXT_PUBLIC_SUPABASE_URL dan Kunci anon tersedia
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
