"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext.js";  // useAuth 훅을 사용
import UserInfo from "./UserInfo.js";  // UserInfo 컴포넌트
import LoginLink from "./LoginLink.js"; // LoginLink 컴포넌트

export default function Header() {
    const { username, expirationTime } = useAuth();  // AuthContext에서 값 가져오기

    return (
        <header>
            <div className="header-container">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <div>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" className="main-link">My Website</a>
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
