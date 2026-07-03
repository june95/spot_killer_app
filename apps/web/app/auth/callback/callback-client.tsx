"use client";

import { ensureUserProfile } from "@spot-killer/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "../client";

const emailOnboardingPath = "/onboarding/email" as Parameters<
  ReturnType<typeof useRouter>["replace"]
>[0];

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("로그인 정보를 확인하고 있습니다.");

  useEffect(() => {
    let isMounted = true;

    async function completeLogin() {
      const client = getBrowserSupabaseClient();
      const errorDescription = searchParams.get("error_description");

      if (errorDescription) {
        setMessage(errorDescription);
        return;
      }

      const code = searchParams.get("code");

      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          return;
        }
      }

      const { data, error } = await client.auth.getUser();

      if (error || !data.user) {
        setMessage(error?.message ?? "로그인 사용자를 찾을 수 없습니다.");
        return;
      }

      const { error: profileError } = await ensureUserProfile(client, data.user);

      if (profileError) {
        setMessage(profileError.message);
        return;
      }

      if (!data.user.email) {
        router.replace(emailOnboardingPath);
        return;
      }

      if (isMounted) {
        router.replace("/");
      }
    }

    completeLogin();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <main className="grid min-h-screen place-items-center bg-app-background px-4 text-app-text">
      <section className="w-full max-w-[420px] rounded-panel border border-app-border bg-app-surface p-6 text-center shadow-panel">
        <p className="m-0 text-sm font-bold text-brand">Spot Killer</p>
        <h1 className="mb-0 mt-3 text-xl font-bold">로그인 처리 중</h1>
        <p className="mb-0 mt-3 text-sm leading-6 text-app-muted">{message}</p>
      </section>
    </main>
  );
}
