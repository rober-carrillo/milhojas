// Supabase client factory. Apps read their own env vars and pass them in, so
// this package never touches process.env and never sees a service_role key.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function createSupabaseClient(
  config: SupabaseConfig,
  options?: Parameters<typeof createClient>[2],
): SupabaseClient {
  if (!config.url || !config.anonKey) {
    throw new Error("Supabase URL and anon key are required");
  }
  return createClient(config.url, config.anonKey, options);
}
