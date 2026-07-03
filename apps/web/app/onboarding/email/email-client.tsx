"use client";

import { ensureUserProfile } from "@spot-killer/api";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { getBrowserSupabaseClient } from "../../auth/client";

export function EmailOnboardingClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const client = getBrowserSupabaseClient();
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
      setErrorMessage(error?.message ?? "로그인 사용자를 찾을 수 없습니다.");
      setIsSubmitting(false);
      return;
    }

    const { error: profileError } = await ensureUserProfile(client, data.user, {
      contactEmail: email,
    });

    if (profileError) {
      setErrorMessage(profileError.message);
      setIsSubmitting(false);
      return;
    }

    router.replace("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-app-background px-4 py-10 text-app-text">
      <section className="w-full max-w-[420px] rounded-panel border border-app-border bg-app-surface p-6 shadow-panel">
        <p className="mb-2 text-[13px] font-bold text-brand">Spot Killer</p>
        <h1 className="m-0 text-2xl font-bold leading-tight">이메일 확인</h1>
        <p className="mb-6 mt-3 text-sm leading-6 text-app-muted">
          소셜 계정에서 이메일을 받지 못했습니다. 초대와 알림에 사용할 이메일을 입력하세요.
        </p>

        <form className="flex flex-col gap-3" onSubmit={submitEmail}>
          <label className="text-sm font-bold" htmlFor="contact-email">
            이메일
          </label>
          <input
            className="min-h-12 rounded-control border border-app-border px-3 text-base outline-brand"
            id="contact-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <button
            className="mt-2 min-h-12 rounded-control bg-brand px-4 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "저장 중" : "계속하기"}
          </button>
        </form>

        {errorMessage ? (
          <p className="mb-0 mt-4 rounded-control border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
