export {
  ensureUserProfile,
  getOAuthRedirectTo,
  signInWithSocialProvider,
  socialAuthProviderConfigs,
  socialAuthProviders,
  type EnsureUserProfileOptions,
  type SocialAuthProvider,
  type SocialAuthProviderConfig,
} from "./auth/oauth";
export {
  createSpotKillerBrowserClient,
  type SpotKillerSupabaseClient,
} from "./supabase/browser";
export type { Session as SupabaseAuthSession } from "@supabase/supabase-js";
export {
  getPublicSupabaseConfig,
  publicSupabaseEnvKeys,
  serverSupabaseEnvKeys,
  type PublicSupabaseConfig,
} from "./supabase/env";
export { storageBuckets, storagePathPatterns } from "./supabase/storage";
