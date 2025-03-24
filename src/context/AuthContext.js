"use client";

// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken as refreshTokenApi } from "../utils/api"; // API 로직 분리된 곳에서 import

// 기본 값 설정
const AuthContext = createContext({
    username: null,
    expirationTime: null,
    login: () => {},
    logout: () => {},
    refreshToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [expirationTime, setExpirationTime] = useState(null);

    // 액세스 토큰 갱신 요청
    const refreshToken = async () => {
        const result = await refreshTokenApi();
        console.log('Token Expiration Time:', result.expirationTime);
        // setExpirationTime(new Date(result.expirationTime)); // 만료 시간 업데이트
        const newExpriationDate = new Date(Date.now() + 10 * 60 * 1000);
        setExpirationTime(newExpriationDate); // 토큰 유효시간 10분 연장
        localStorage.setItem("expirationTime", newExpriationDate.toISOString());  // 문자열로 저장
    };

    // 로그인 처리 함수
    const login = (username, expirationTimeStr) => {
        // const expirationDate = new Date(expirationTimeStr);  // 문자열을 Date 객체로 변환
        const expirationDate = new Date(Date.now() + 10 * 60 * 1000); // 유효시간 10분
        setUsername(username);
        setExpirationTime(expirationDate);  // ISO 형식의 문자열로 저장
        localStorage.setItem("username", username);
        localStorage.setItem("expirationTime", expirationDate.toISOString());  // 문자열로 저장
    };


    // 로그아웃 처리 함수
    const logout = () => {
        setUsername(null);
        setExpirationTime(null);
        localStorage.removeItem('username');
        localStorage.removeItem('expirationTime');

        window.location.href = "/"; // "/" 페이지로 이동
    };

    // 로그인 상태 초기화
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedExpirationTime = localStorage.getItem('expirationTime');

        if (storedUsername && storedExpirationTime) {
            setUsername(storedUsername);
            setExpirationTime(new Date(storedExpirationTime));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ username, expirationTime, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
