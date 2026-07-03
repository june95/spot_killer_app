import type { Provider, SupabaseClient, User } from "@supabase/supabase-js";

export const socialAuthProviders = ["kakao", "google"] as const;

export type SocialAuthProvider = (typeof socialAuthProviders)[number];

export type SocialAuthProviderConfig = Readonly<{
  id: SocialAuthProvider;
  label: string;
  description: string;
}>;

export const socialAuthProviderConfigs: readonly SocialAuthProviderConfig[] = [
  {
    id: "kakao",
    label: "Kakao",
    description: "카카오 계정으로 계속하기",
  },
  {
    id: "google",
    label: "Google",
    description: "Google 계정으로 계속하기",
  },
] as const;

export function getOAuthRedirectTo(origin: string): string {
  return new URL("/auth/callback", origin).toString();
}

export async function signInWithSocialProvider(
  client: SupabaseClient,
  provider: SocialAuthProvider,
  origin: string,
) {
  return client.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: getOAuthRedirectTo(origin),
    },
  });
}

export type EnsureUserProfileOptions = Readonly<{
  contactEmail?: string;
}>;

export async function ensureUserProfile(
  client: SupabaseClient,
  user: User,
  options: EnsureUserProfileOptions = {},
) {
  const metadata = user.user_metadata;
  const displayName = getSocialDisplayName(user);
  const avatarUrl = getStringMetadata(metadata.avatar_url) ?? getStringMetadata(metadata.picture);
  const contactEmail = options.contactEmail ?? user.email ?? undefined;
  const profile = {
    id: user.id,
    display_name: displayName,
    avatar_url: avatarUrl ?? null,
    ...(contactEmail ? { contact_email: contactEmail } : {}),
  };

  // Profiles are owned by auth.users; upsert keeps repeated OAuth callbacks idempotent.
  return client.from("profiles").upsert(profile, { onConflict: "id" });
}

function getSocialDisplayName(user: User): string {
  const metadata = user.user_metadata;
  const metadataName =
    getStringMetadata(metadata.full_name) ??
    getStringMetadata(metadata.name) ??
    getStringMetadata(metadata.nickname);

  if (metadataName) {
    return metadataName;
  }

  if (user.email) {
    return user.email.split("@")[0] || "Spot Killer User";
  }

  return "Spot Killer User";
}

function getStringMetadata(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}
