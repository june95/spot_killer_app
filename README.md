# Spot Killer App

Spot Killer는 장소에 대한 리뷰와 기억을 지도 위에 저장하는 개인/소그룹용 지도형 기록 앱입니다.

## Workspace

이 저장소는 웹앱을 먼저 출시하고 이후 Android/iOS 앱으로 확장하기 위한 pnpm workspace 기반 모노레포입니다.

```txt
apps/
  web/        Next.js 웹앱 예정
  mobile/     Expo Android/iOS 앱 예정
packages/
  api/        Supabase client, query hooks, data mappers 예정
  config/     공유 TypeScript 설정
  domain/     Zod schema와 domain type 예정
  ui/         공유 UI 컴포넌트와 디자인 토큰 예정
```

## Requirements

- Node.js 20 이상 권장
- pnpm

pnpm이 없다면 Corepack이 제공되는 Node.js 환경에서 다음처럼 준비할 수 있습니다.

```sh
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

현재 사용하는 Node.js 배포판에서 Corepack이 PATH에 없다면 pnpm 공식 설치 방법에 따라 pnpm을 먼저 설치한 뒤 아래 명령어를 실행합니다.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

현재 `apps/web`과 `apps/mobile`은 다음 task에서 실제 앱으로 부트스트랩될 placeholder 상태입니다.
