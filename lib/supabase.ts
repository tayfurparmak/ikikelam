import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for storage and administrative actions.
 * NOTE: NEVER call this from client-side code to avoid exposing the service role key.
 */
export const getSupabaseServerClient = () => {
  if (import.meta.client) {
    throw new Error('Supabase admin client cannot be instantiated in client-side code.')
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL
  const supabaseKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is undefined.')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export const getSupabaseStorageBucket = () => {
  const config = useRuntimeConfig()
  return config.supabaseStorageBucket || process.env.SUPABASE_STORAGE_BUCKET || 'gallery'
}
