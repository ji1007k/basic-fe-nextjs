import { createServer } from "http";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Express 서버 생성
const server = express();

// 요청 정보 로그 출력 (이게 프록시 설정보다 먼저 선언돼야 함)
server.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);  // 요청 메서드와 URL 출력
    next();
});

// 🔥 **프록시 설정**
server.use(
    "/api",
    createProxyMiddleware({
        target: process.env.NEXT_PUBLIC_API_URL || 'https://ec2-3-36-70-95.ap-northeast-2.compute.amazonaws.com', // API 서버
        // changeOrigin: true,  // 프록시 요청의 Origin 헤더를 타겟 서버의 도메인으로 바꿈
        crossOrigin: true,
        secure: false, // 자체 서명 인증서 허용
        pathRewrite: { "^/api": "" }, // `/api/path` → `/path`
        logLevel: 'debug',  // 로그 레벨을 설정하여 프록시 로그 확인 가능,
        agent: new https.Agent({ rejectUnauthorized: false }), // 🔥 SSL 인증서 검증 무시
        onProxyReq: (proxyReq, req, res) => {
            // 요청 URL을 로그로 출력하여 확인
            console.log('Original URL:', req.url);
            console.log('Request URL after Proxy:', proxyReq.url);
        },
    })
);

// Next.js 기본 요청 처리
server.all("*", (req, res) => {
    return handle(req, res);
});

// HTTPS 서버 실행
app.prepare().then(() => {
    createServer(server).listen(3000, (err) => {
        if (err) throw err;
        console.log("🚀 Server running at http://localhost:3000");
    });
});



