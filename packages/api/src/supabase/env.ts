export const publicSupabaseEnvKeys = {
  url: "NEXT_PUBLIC_SUPABASE_URL",
  publishableKey: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  legacyAnonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
} as const;

export const serverSupabaseEnvKeys = {
  secretKey: "SUPABASE_SECRET_KEY",
  legacyServiceRoleKey: "SUPABASE_SERVICE_ROLE_KEY",
} as const;

export type PublicSupabaseConfig = Readonly<{
  url: string;
  publishableKey: string;
}>;

type PublicSupabaseEnv = Partial<
  Record<(typeof publicSupabaseEnvKeys)[keyof typeof publicSupabaseEnvKeys], string>
>;

export function getPublicSupabaseConfig(
  env: PublicSupabaseEnv = process.env,
): PublicSupabaseConfig {
  const url = env[publicSupabaseEnvKeys.url];
  const publishableKey =
    env[publicSupabaseEnvKeys.publishableKey] ??
    env[publicSupabaseEnvKeys.legacyAnonKey];

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase public config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}
