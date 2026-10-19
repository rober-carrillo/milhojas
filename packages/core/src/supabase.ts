// Supabase client factory. Apps read their own env vars and pass them in, so
// this package never touches process.env and never sees a service_role key.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/** Client typed against the schema in supabase/migrations (regenerate with `pnpm db:types`). */
export type MilhojasClient = SupabaseClient<Database>;

export function createSupabaseClient(
  config: SupabaseConfig,
  options?: Parameters<typeof createClient<Database>>[2],
): MilhojasClient {
  if (!config.url || !config.anonKey) {
    throw new Error("Supabase URL and anon key are required");
  }
  return createClient<Database>(config.url, config.anonKey, options);
}
