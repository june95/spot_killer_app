"use client";

import type { SupabaseAuthSession } from "@spot-killer/api";
import { useEffect, useState } from "react";
import { getBrowserSupabaseClient } from "./client";

export function AuthStatus() {
  const [session, setSession] = useState<SupabaseAuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const client = getBrowserSupabaseClient();

    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsReady(true);
    });

    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    setIsSigningOut(true);
    const client = getBrowserSupabaseClient();
    await client.auth.signOut();
    setSession(null);
    setIsSigningOut(false);
  }

  if (!isReady) {
    return (
      <span className="min-h-11 rounded-control border border-app-border bg-white/80 px-4 py-2.5 text-[15px] font-bold text-app-muted">
        로그인 확인 중
      </span>
    );
  }

  if (!session) {
    return (
      <a
        className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-brand px-4 text-[15px] font-bold text-white md:w-auto"
        href="/login"
      >
        로그인
      </a>
    );
  }

  return (
    <button
      className="min-h-11 w-full rounded-control border border-app-border bg-white px-4 text-[15px] font-bold text-app-text md:w-auto"
      disabled={isSigningOut}
      onClick={signOut}
      type="button"
    >
      {isSigningOut ? "로그아웃 중" : "로그아웃"}
    </button>
  );
}
