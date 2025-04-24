import { createServer } from "http";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import * as https from "node:https";
import dotenv from 'dotenv';
import nextConfig from "../../next.config.mjs";

// 1. 항상  .env.local 파일을 로드 (EXPRESS)
dotenv.config({ path: '.env.local' });

// 2. 환경별 `.env` 파일 추가 로드
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const useRemoteAPI = process.env.USE_REMOTE_API == 'true';
const API_URL = useRemoteAPI ? process.env.API_URL_PROD : process.env.API_URL_LOCAL;
const WS_URL = useRemoteAPI ? process.env.WS_URL_PROD : process.env.WS_URL_LOCAL;

console.log("Mode: ", process.env.NODE_ENV);
console.log(`Loaded .env.local and ${envFile}`);
console.log("API Server: ", API_URL);
console.log("WebSocket URL: ", WS_URL);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Express 서버 생성
const server = express();

// 모든 요청에 대해 요청 정보 로그를 출력하는 미들웨어 설정 (이게 프록시 설정보다 먼저 선언돼야 함)
server.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);  // 요청 메서드와 URL 출력
    next(); // 요청을 다음 미들웨어 또는 라우터로 전달
});

// Express는 기본적으로 마운트 경로(/api)를 제거
// app.use('/api', middleware)로 미들웨어를 등록하면, 미들웨어 내부에서 req.url은 /api가 제거된 나머지 경로로 나타남.
// 예: 클라이언트 요청 /api/auth/login → 미들웨어 내부 req.url은 /auth/login
server.use("/api", (req, res, next) => {
    // req.url = "/api" + req.url;
    console.log("🔥 /path :", req.method, req.url);
    console.log("🔥 /api/path :", req.originalUrl);
    next();
});

// 🔥 **프록시 설정** (배포환경에서 비활성화)
const proxyOptions = {
    target: API_URL, // API 서버
    changeOrigin: true,  // 프록시 요청의 Origin 헤더를 타겟 서버의 도메인으로 바꿈
    logLevel: 'debug',  // 로그 레벨을 설정하여 프록시 로그 확인 가능,
};

if (API_URL.startsWith("https")) {
    Object.assign(proxyOptions, {
        pathRewrite: (path, req) => {
            return req.originalUrl; // req.originalUrl는 "/api/auth/login"을 포함함.
        },
        secure: false,  // SSL 인증서 검증 비활성화 (로컬 개발용)
        agent: new https.Agent({ rejectUnauthorized: false }),  // 자체 서명 SSL 허용
    });
} else {
    Object.assign(proxyOptions, {
        pathRewrite: (path, req) => {
            // swagger 관련 요청에선 그대로 사용
            if (["swagger", "/v3/api-docs"].some(keyword => path.includes(keyword))) {
                return req.originalUrl;
            }
            // 그 외 url에서 api 제거
            return path.replace(/^\/api/, "");
        }
    });
}

server.use(
    "/api",
    createProxyMiddleware(proxyOptions)
);


// ==========================================
// WebSocket 프록시 설정
const wsProxyOptions = {
    target: WS_URL,         // 실제 WebSocket 서버 주소
    pathFilter: '/ws/',     // 프록시할 경로
    ws: true,               // WebSocket 연결을 처리
}

if (useRemoteAPI) {
    Object.assign(wsProxyOptions, {
        secure: false,                              // SSL 인증서 검증 비활성화 (로컬 개발용)
        pathRewrite: (path, req) => req.originalUrl  // 원래 경로 그대로 사용 (배포 서버)
    });
} else {
    Object.assign(wsProxyOptions, {
        pathRewrite: { "^/ws/": "/chat" },           // 로컬 개발 시 '/ws/'를 '/chat'으로 변경
    });
}

const wsProxyMiddleware = createProxyMiddleware(wsProxyOptions);

// HTTP 'upgrade' 요청을 처리하여 WebSocket 연결을 허용
server.on('upgrade', wsProxyMiddleware.upgrade);

// WebSocket 요청을 처리하는 미들웨어 설정
server.use(wsProxyMiddleware);


// ==========================================
// Next.js의 기본 라우팅을 처리
server.all("*", (req, res) => {
    return handle(req, res);    // Next.js에서 클라이언트 요청을 처리하는 기본 함수
});

// HTTPS 서버 실행
const PORT = process.env.PORT || 3000;

// 💡 basePath 접근
const basePath = nextConfig.basePath || '/';

app.prepare().then(() => {
    createServer(server).listen(PORT, (err) => {
        if (err) throw err;
        console.log(`🚀 Server running at http://localhost:${PORT}${basePath}`);
    });
});



