import Link from "next/link";
import { SocialLoginButtons } from "./social-login-buttons";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-app-background px-4 py-10 text-app-text">
      <section className="w-full max-w-[420px] rounded-panel border border-app-border bg-app-surface p-6 shadow-panel">
        <div className="mb-8">
          <p className="mb-2 text-[13px] font-bold text-brand">Spot Killer</p>
          <h1 className="m-0 text-2xl font-bold leading-tight">로그인</h1>
          <p className="mb-0 mt-3 text-sm leading-6 text-app-muted">
            카카오 또는 Google 계정으로 그룹 지도와 저장한 장소를 이어서 관리하세요.
          </p>
        </div>

        <SocialLoginButtons />

        <p className="mb-0 mt-6 text-center text-sm text-app-muted">
          <Link className="font-bold text-brand" href="/">
            지도로 돌아가기
          </Link>
        </p>
      </section>
    </main>
  );
}
