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
  Record<
    (typeof publicSupabaseEnvKeys)[keyof typeof publicSupabaseEnvKeys],
    string | undefined
  >
>;

declare const process:
  | {
      env: PublicSupabaseEnv;
    }
  | undefined;

export function getPublicSupabaseConfig(env?: PublicSupabaseEnv): PublicSupabaseConfig {
  const source = env ?? getRuntimePublicEnv();
  const url = source[publicSupabaseEnvKeys.url];
  const publishableKey =
    source[publicSupabaseEnvKeys.publishableKey] ??
    source[publicSupabaseEnvKeys.legacyAnonKey];

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase public config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}

function getRuntimePublicEnv(): PublicSupabaseEnv {
  // Next.js only exposes public env vars to client bundles when they are statically referenced.
  return {
    NEXT_PUBLIC_SUPABASE_URL:
      typeof process === "undefined" ? undefined : process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      typeof process === "undefined"
        ? undefined
        : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      typeof process === "undefined" ? undefined : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
