"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext.js";  // useAuth 훅을 사용
import UserInfo from "./UserInfo.js";  // UserInfo 컴포넌트
import LoginLink from "./LoginLink.js"; // LoginLink 컴포넌트
import Link from 'next/link';

export default function Header() {
    const { username, expirationTime } = useAuth();  // AuthContext에서 값 가져오기

    return (
        <header>
            <div className="header-container">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <div>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <Link href="/" className="main-link">My Website</Link>
                    {/*<a> 태그는 브라우저의 기본 HTML 동작을 따르기 때문에, Next.js가 제공하는 라우팅 기능 (next/link)을 우회함
                        -> basePath 적용 안됨*/}
                    <a href="/api/swagger-ui/index.html" className="api-docs-link">API Docs</a>
                </div>
                <div className="user-info">
                    {username ? (
                        <UserInfo username={username} expirationTime={expirationTime} />
                    ) : (
                        <LoginLink />
                    )}
                </div>
            </div>
        </header>
    );
}
