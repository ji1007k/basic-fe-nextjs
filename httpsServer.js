import { createServer } from "https";
import next from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import * as https from "node:https";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// 현재 모듈의 디렉토리 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSL 인증서 옵션
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "app/config/https/localhost-key.pem")),   // 개인 키
    cert: fs.readFileSync(path.join(__dirname, "app/config/https/localhost.pem")),      // 인증서
    ca: fs.readFileSync(path.join(__dirname, "app/config/https/ec2-public-ip.crt")),    // EC2 인증서 (필요하면 추가)
};

// Express 서버 생성
const httpsServer = express();

// 모든 요청에 대해 요청 정보 로그를 출력하는 미들웨어 설정 (이게 프록시 설정보다 먼저 선언돼야 함)
httpsServer.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);  // 요청 메서드와 URL 출력
    next(); // 요청을 다음 미들웨어 또는 라우터로 전달
});

// Express는 기본적으로 마운트 경로(/api)를 제거
// app.use('/api', middleware)로 미들웨어를 등록하면, 미들웨어 내부에서 req.url은 /api가 제거된 나머지 경로로 나타남.
// 예: 클라이언트 요청 /api/auth/login → 미들웨어 내부 req.url은 /auth/login
httpsServer.use("/api", (req, res, next) => {
    // req.url = "/api" + req.url;
    console.log("🔥 /path :", req.method, req.url);
    console.log("🔥 /api/path :", req.originalUrl);
    next();
});

// 🔥 **프록시 설정** (배포환경에서 비활성화)
const proxyOptions = {
    target: process.env.NEXT_PUBLIC_API_URL || 'https://ec2-3-36-70-95.ap-northeast-2.compute.amazonaws.com', // API 서버
    changeOrigin: true,  // 프록시 요청의 Origin 헤더를 타겟 서버의 도메인으로 바꿈
    // pathRewrite: { "^/api": "/api" },
    pathRewrite: (path, req) => {
        // req.originalUrl는 "/api/auth/login"을 포함함.
        return req.originalUrl;
    },
    logLevel: 'debug',  // 로그 레벨을 설정하여 프록시 로그 확인 가능,
    secure: false, // SSL 인증서 검증 비활성화 (로컬 개발용)
    agent: new https.Agent({ rejectUnauthorized: false }), // 자체 서명 SSL 허용
}

console.log(process.env.NODE_ENV, dev);

if (dev) {
    httpsServer.use(
        "/api",
        createProxyMiddleware(proxyOptions)
    );
}

// Next.js의 기본 라우팅을 처리
httpsServer.all("*", (req, res) => {
    return handle(req, res);    // Next.js에서 클라이언트 요청을 처리하는 기본 함수
});

// HTTPS 서버 실행
app.prepare().then(() => {
    createServer(httpsOptions, httpsServer).listen(3000, (err) => {
        if (err) throw err;
        console.log("🚀 Server running at https://localhost:3000");
    });
});



