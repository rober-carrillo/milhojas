// Supabase client for Server Components, Server Actions and Route Handlers.
// The session lives in cookies; middleware.ts keeps it fresh.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database, MilhojasClient } from "@milhojas/core";
import { supabaseEnv } from "./env";

export async function createClient(): Promise<MilhojasClient> {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseEnv();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Server Components cannot write cookies; middleware refreshes the session instead.
        }
      },
    },
  });
}
