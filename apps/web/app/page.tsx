const markerPresets = [
  { emoji: "❤️", label: "강력 추천", color: "red" },
  { emoji: "🧡", label: "좋음", color: "orange" },
  { emoji: "💛", label: "괜찮음", color: "yellow" },
  { emoji: "💚", label: "추억", color: "green" },
  { emoji: "💙", label: "다시 검토", color: "blue" },
  { emoji: "💜", label: "특별한 날", color: "purple" },
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="map-surface" aria-label="Spot Killer 지도 준비 화면">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Spot Killer</p>
            <h1>우리만의 장소 지도를 준비 중입니다.</h1>
          </div>
          <button className="primary-action" type="button">
            Spot 추가
          </button>
        </header>

        <div className="map-placeholder">
          <div className="map-grid" aria-hidden="true" />
          <div className="marker marker-red">❤️</div>
          <div className="marker marker-green">💚</div>
          <div className="marker marker-purple">💜</div>
          <p>task_0009에서 Naver Maps가 이 영역에 연결됩니다.</p>
        </div>

        <aside className="spot-preview" aria-label="선택된 장소 미리보기">
          <div>
            <span className="spot-emoji">❤️</span>
            <div>
              <h2>첫 번째 Spot</h2>
              <p>지도, 메모, 사진 갤러리가 붙을 기본 화면입니다.</p>
            </div>
          </div>
          <ul className="marker-list" aria-label="초기 이모티콘 마커">
            {markerPresets.map((preset) => (
              <li key={preset.color}>
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
