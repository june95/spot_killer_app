"use client";

import {
  signInWithSocialProvider,
  socialAuthProviderConfigs,
  type SocialAuthProvider,
} from "@spot-killer/api";
import { useState } from "react";
import { getBrowserSupabaseClient } from "../auth/client";

export function SocialLoginButtons() {
  const [pendingProvider, setPendingProvider] = useState<SocialAuthProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function startLogin(provider: SocialAuthProvider) {
    setPendingProvider(provider);
    setErrorMessage(null);

    const { error } = await signInWithSocialProvider(
      getBrowserSupabaseClient(),
      provider,
      window.location.origin,
    );

    if (error) {
      setErrorMessage(error.message);
      setPendingProvider(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {socialAuthProviderConfigs.map((provider) => (
        <button
          className={getProviderButtonClassName(provider.id)}
          disabled={pendingProvider !== null}
          key={provider.id}
          onClick={() => startLogin(provider.id)}
          type="button"
        >
          <span aria-hidden="true" className="text-lg font-black">
            {provider.id === "kakao" ? "K" : "G"}
          </span>
          {pendingProvider === provider.id ? "연결 중" : provider.description}
        </button>
      ))}
      {errorMessage ? (
        <p className="m-0 rounded-control border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function getProviderButtonClassName(provider: SocialAuthProvider): string {
  const base =
    "inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-control px-4 text-[15px] font-bold transition disabled:cursor-not-allowed disabled:opacity-70";

  if (provider === "kakao") {
    return `${base} bg-[#FEE500] text-[#191919]`;
  }

  return `${base} border border-[#DADCE0] bg-white text-[#3C4043]`;
}
