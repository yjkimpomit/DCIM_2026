// next.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // assetPrefix는 보통 프로덕션에서만 설정하고, 끝에 / 권장
  // 예: "http://127.0.0.1:3000/"
  // assetPrefix: "http://ayjang-omnote/",
  turbopack: {
    root: path.resolve(__dirname), // ← 경고 제거 포인트
  },
};

export default nextConfig;