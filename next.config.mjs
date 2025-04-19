/** @type {import('next').NextConfig} */
// import path from 'path';

const nextConfig = {
    // 개발환경에서 렌더링을 2번 유도 -> 잠재적 버그 발견 용이성. nextjs 에선 기본적으로 활성화됨
    reactStrictMode: true,

    // ✅ 서브 경로 설정 추가
    basePath: '/jikimi',
    assetPrefix: '/jikimi/',

    /* async rewrites() {
         return [
             {
                 // 프론트APP HOST/api/... 요청 시 EC2 서버 HOST/api/... 로 리디렉션
                 source: '/api/:path*',
                 destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
             },
             {
                 // 프론트APP HOST/user/... 요청 시 EC2 서버 HOST/auth/... 로 리디렉션
                 source: '/user/:path*',
                 destination: process.env.NEXT_PUBLIC_API_URL + '/auth/:path*',
             },
         ];
     },*/
};

export default nextConfig;
