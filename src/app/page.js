"use client";

import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext.js";
import { useRouter } from "next/navigation";
import MyCalendar from "@components/MyCalendar.js";
import { CalandarProvider } from "@/context/CalandarContext.js";
import Standings from "@components/Standings.js";
import { useEffect, useState } from "react";
import { apiFetchTournaments } from "@utils/api-lol.js";
import Loading from "@components/Loading.js";
import "@/styles/css/chat.css";
import "@/styles/css/standings.css";

export default function Home({ Component, pageProps }) {
    const { userId } = useAuth();
    const router = useRouter();

    const [tournaments, setTournaments] = useState([]);
    const [activeTournamentId, setActiveTournamentId] = useState('');
    const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가

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
        router.push("/auth/login");
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
                    className="chat-toggle-button"
                    title="로그인 필요"
                >
                    🔒
                </button>
            )}
        </main>
    );
}
