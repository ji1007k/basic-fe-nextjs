"use client";

// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken as refreshTokenApi } from "../utils/api"; // API 로직 분리된 곳에서 import

// TODO userid, username 객체로 합치기
// 기본 값 설정
const AuthContext = createContext({
    userId: null,
    username: null,
    expirationTime: null,
    login: () => {},
    logout: () => {},
    refreshToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [expirationTime, setExpirationTime] = useState(null);

    // FIXME 서버에서 설정한 토큰 만료시간 사용하도록 수정
    // 액세스 토큰 갱신 요청
    const refreshToken = async () => {
        const result = await refreshTokenApi();
        console.log('Token Expiration Time:', result.expirationTime);
        // setExpirationTime(new Date(result.expirationTime)); // 만료 시간 업데이트
        const newExpriationDate = new Date(Date.now() + 10 * 60 * 1000);
        setExpirationTime(newExpriationDate); // 토큰 유효시간 10분 연장
        localStorage.setItem("expirationTime", newExpriationDate.toISOString());  // 문자열로 저장
    };

    // FIXME 서버에서 설정한 토큰 만료시간 사용하도록 수정
    // 로그인 처리 함수
    const login = (userId, username, expirationTimeStr) => {
        // const expirationDate = new Date(expirationTimeStr);  // 문자열을 Date 객체로 변환
        const expirationDate = new Date(Date.now() + 10 * 60 * 1000); // 유효시간 10분
        setUserId(userId);
        setUsername(username);
        setExpirationTime(expirationDate);  // ISO 형식의 문자열로 저장
        localStorage.setItem("userId", userId);
        localStorage.setItem("expirationTime", expirationDate.toISOString());  // 문자열로 저장
    };


    // 로그아웃 처리 함수
    const logout = () => {
        setUserId(null);
        setUsername(null);
        setExpirationTime(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationTime');

        window.location.href = "/"; // "/" 페이지로 이동
    };

    // 로그인 상태 초기화
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedExpirationTime = localStorage.getItem('expirationTime');

        if (storedUserId && storedExpirationTime) {
            setUserId(storedUserId);
            setExpirationTime(new Date(storedExpirationTime));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userId, username, expirationTime, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
