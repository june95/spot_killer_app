import { markerPresets } from "@spot-killer/ui";
import { AuthStatus } from "./auth/auth-status";
import { NaverMap } from "./naver-map";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-app-background p-0 text-app-text md:p-6">
      <section
        className="relative min-h-screen overflow-hidden bg-app-surface shadow-panel md:min-h-[calc(100vh-48px)] md:rounded-panel md:border md:border-app-border"
        aria-label="Spot Killer 지도 화면"
      >
        <NaverMap clientId={process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID} />

        <header className="absolute left-3 right-3 top-5 z-20 flex flex-col items-start gap-4 md:left-map-gutter md:right-map-gutter md:flex-row md:justify-between">
          <div className="rounded-panel border border-app-border bg-white/95 px-4 py-3 shadow-marker">
            <p className="mb-1.5 text-[13px] font-bold text-brand">
              Spot Killer
            </p>
            <h1 className="m-0 max-w-[520px] text-2xl font-bold leading-tight md:text-[28px]">
              우리만의 장소를 지도에 기록하세요.
            </h1>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <button
              className="min-h-11 w-full rounded-control bg-brand px-4 text-[15px] font-bold text-white shadow-marker md:w-auto"
              type="button"
            >
              Spot 추가
            </button>
            <AuthStatus />
          </div>
        </header>

        <aside
          className="absolute bottom-5 left-3 right-3 z-20 flex flex-col gap-5 rounded-panel border border-app-border bg-white/95 p-4 shadow-[0_14px_36px_rgba(23,33,27,0.12)] md:left-map-gutter md:right-map-gutter md:flex-row md:items-center md:justify-between"
          aria-label="선택된 장소 미리보기"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-control bg-app-surface-raised text-[26px]">
              ❤️
            </span>
            <div>
              <h2 className="m-0 mb-1 text-lg font-bold">첫 번째 Spot</h2>
              <p className="m-0 text-sm text-app-muted">
                지도, 메모, 사진 갤러리가 붙을 기본 화면입니다.
              </p>
            </div>
          </div>
          <ul
            className="m-0 flex max-w-[460px] list-none flex-wrap gap-2 p-0 md:justify-end"
            aria-label="초기 이모티콘 마커"
          >
            {markerPresets.map((preset) => (
              <li
                className="inline-flex min-h-8 items-center gap-1.5 rounded-control border border-app-border px-2.5 text-[13px] text-app-muted"
                key={preset.key}
              >
                <span>{preset.emoji}</span>
                {preset.label}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
