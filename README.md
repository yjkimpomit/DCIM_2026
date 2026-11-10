This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## CSS 로딩 정책

- 공통 CSS는 `src/app/layout.js`에서 `variables.css → reset.css → components.css → layout.css` 순서로 한 번만 로딩합니다.
- 폰트 CSS는 `reset.css`에서만 import합니다.
- 화면 CSS는 해당 페이지 또는 Frame 한 곳에서 로딩하며, 공통 CSS나 다른 화면 CSS를 import하지 않습니다.
- 로그인·회원가입 공유 폼 스타일은 `components.css`에 정의합니다.
- 사용자 화면 CSS는 `UserFrame`, 관리자 화면 CSS는 `AdminFrame`에서 관리합니다.
- 사용자 공통 스타일은 `user-layout.css`에서 로딩하고, `server-dashboard.css`는 서버 대시보드에서만 추가로 로딩합니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
