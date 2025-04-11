"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.js";
import TokenExpiration from "@/components/TokenExpiration";
import { logout as apiLogout } from "@/utils/api.js";

export default function UserInfo({ username, expirationTime }) {
    const [dropdownActive, setDropdownActive] = useState(false);
    const { logout } = useAuth();  // AuthContext에서 logout 함수 가져오기

    const toggleDropdown = () => {
        setDropdownActive((prev) => !prev);
    };

    const hideDropdown = (event) => {
        if (!event.target.closest("#dropdown") && !event.target.closest(".username")) {
            setDropdownActive(false);
        }
    };

    // 페이지 클릭 시 드롭다운 숨기기
    useEffect(() => {
        window.addEventListener("click", hideDropdown);
        return () => {
            window.removeEventListener("click", hideDropdown);
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault(); // a 태그 기본 동작을 방지 (페이지 이동 방지)

        await apiLogout();

        logout();  // 로그아웃 처리
    };

    return (
        <span id="username-area">
            <span className="username username-clickable" onClick={toggleDropdown}>
                {username}
            </span>
            <TokenExpiration />

            {dropdownActive && (
                <div id="dropdown" className="dropdown-content">
                    <a href="/mypage">마이페이지</a>
                    <a onClick={handleLogout} className="logout-btn">
                        로그아웃
                    </a>
                </div>
            )}
        </span>
    );
}
