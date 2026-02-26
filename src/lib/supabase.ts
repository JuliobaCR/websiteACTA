import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Placeholder values – used when env vars are missing or look like templates.
// The app will start without throwing; calls against the placeholder URL will
// simply fail (acceptable for dev without Docker / Supabase running).
// ---------------------------------------------------------------------------
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  if (v === "") return true;
  if (v.includes("your_supabase")) return true;
  if (v.includes("placeholder")) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Resolve env vars with fallbacks
// ---------------------------------------------------------------------------
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const rawServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseUrl = isPlaceholder(rawUrl) ? PLACEHOLDER_URL : rawUrl!;
const supabaseAnonKey = isPlaceholder(rawAnonKey)
  ? PLACEHOLDER_ANON_KEY
  : rawAnonKey!;

/**
 * Public (anon) Supabase client – safe to use in both client and server code.
 * When env vars are missing the client is created with placeholder values;
 * requests will fail gracefully but the app will not crash on startup.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

/**
 * Server-only Supabase client with the service-role key.
 * Falls back to the anon client when SUPABASE_SERVICE_ROLE_KEY is not set.
 *
 * **Never import this in client components / bundles.**
 */
export function getServiceSupabase(): SupabaseClient {
  if (!rawServiceRoleKey || isPlaceholder(rawServiceRoleKey)) {
    if (typeof window === "undefined") {
      console.warn(
        "[supabase] SUPABASE_SERVICE_ROLE_KEY is missing – falling back to anon client. " +
          "Waitlist inserts will use RLS policies. Set the key in .env.local for full access.",
      );
    }
    return supabase;
  }

  return createClient(supabaseUrl, rawServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
