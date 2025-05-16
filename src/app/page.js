"use client";

import "@/styles/css/chat.css";
import "@/styles/css/standings.css";
import {useEffect, useRef, useState} from "react";
import { useAuth } from "@/context/AuthContext.js";
import { useRouter } from "next/navigation";
import { CalandarProvider } from "@/context/CalandarContext.js";
import MyCalendar from "@components/lol/calendar/MyCalendar";
import Standings from "@components/lol/standings/Standings.jsx";
import Chat from "@/components/Chat";
import Loading from "@components/common/Loading.js";
import { apiFetchTournaments } from "@utils/api-lol.js";

export default function Home({ Component, pageProps }) {
    const { userId, devLogin } = useAuth();
    const router = useRouter();

    const [tournaments, setTournaments] = useState([]);
    const [activeTournamentId, setActiveTournamentId] = useState('');
    const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가
    const lastTap = useRef(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            setIsLoading(true); // ✅ 로딩 시작
            const response = await apiFetchTournaments();
            setTournaments(response);
            if (response.length > 0) {
                const ongoingTournament = response.find(data => data.active);
                setActiveTournamentId(ongoingTournament ? ongoingTournament.id : response[0].id);
            }
            setIsLoading(false); // ✅ 로딩 끝
        };
        fetchTournaments();
    }, []);

    const handleChatBtnClick = () => {
        setTimeout(() => {
            router.push("/auth/login");
        }, 1000); // ← 더블탭 감지보다 살짝 늦게 이동
    };

    const handleChatBtnDoubleClick = () => {
        devLogin();
    };

    const handleTouchStart = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < 500) {
            handleChatBtnDoubleClick(); // 더블탭 처리
        }
        lastTap.current = now;
    };

    const handleTournamentBtnClick = (tournamentId) => {
        setActiveTournamentId(tournamentId);
    };

    return (
        <main className="home-container">
            <div className="section" id="section1">
                <CalandarProvider>
                    <MyCalendar />
                </CalandarProvider>
            </div>

            <div className="section" id="section2">
                {isLoading ? (
                    <Loading message="토너먼트 불러오는 중..." />
                ) : (
                    <div className="tournament-container">
                        <div className="tournament-select-wrapper">
                            <span>Standings</span>
                            <select
                                className="tournament-select"
                                value={activeTournamentId}
                                onChange={(e) => handleTournamentBtnClick(e.target.value)}
                            >
                                {tournaments.map(t => (
                                    <option
                                        key={t.id}
                                        value={t.id}
                                        title={`${t.startDate} ~ ${t.endDate}`}
                                    >
                                        {t.slug}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Standings tournamentId={activeTournamentId} />
                    </div>
                )}
            </div>

            {userId ? (
                <Chat />
            ) : (
                <button
                    onClick={handleChatBtnClick}
                    onDoubleClick={handleChatBtnDoubleClick}
                    onTouchStart={handleTouchStart}   // 모바일용
                    className="chat-toggle-button"
                    title="로그인 필요"
                >
                    🔒
                </button>
            )}
        </main>
    );
}
