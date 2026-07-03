import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getPublicSupabaseConfig,
  type PublicSupabaseConfig,
} from "./env";

export type SpotKillerSupabaseClient = SupabaseClient;

export function createSpotKillerBrowserClient(
  config: PublicSupabaseConfig = getPublicSupabaseConfig(),
): SpotKillerSupabaseClient {
  return createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // OAuth callbacks are handled explicitly in the app route to keep onboarding steps predictable.
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
}
