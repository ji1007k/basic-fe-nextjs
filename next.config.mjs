/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
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
