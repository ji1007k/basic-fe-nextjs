import {useEffect, useState} from "react";
import FavoriteTeamButton from "@components/FavoriteTeamButton";
import {useCalandar} from "@/context/CalandarContext";
import {useAuth} from "@/context/AuthContext.js";
import LeagueDropdown from "@components/LeagueDropdown.js";

const TeamSelector = () => {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState('');
    const [teams, setTeams] = useState([]);
    const {favoriteTeamIds} = useCalandar();
    const {userId} = useAuth();


    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const res = await fetch(`/api/lol/leagues`);
                const data = await res.json();
                setLeagues(data);

                // ✅ 여기서 초기 선택값 설정
                if (!selectedLeagueId && data.length > 0) {
                    setSelectedLeagueId(data[0].id);
                }
            } catch (e) {
                console.error("리그 로딩 실패", e);
            }
        };

        fetchLeagues();
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch(`/api/lol/teams?leagueId=${selectedLeagueId}`);
                const data = await res.json();

                // 🎯 즐겨찾기 팀 먼저 정렬
                const sortedData = [...data].sort((a, b) => {
                    const aIndex = favoriteTeamIds.indexOf(a.teamId);
                    const bIndex = favoriteTeamIds.indexOf(b.teamId);

                    // 둘 다 즐겨찾기에 있음 → 순서 비교
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

                    // 하나만 즐겨찾기임 → 즐겨찾기 먼저
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;

                    return 0; // 둘 다 즐겨찾기 아님 → 원래 순서 유지
                });

                setTeams(sortedData);
            } catch (e) {
                console.error("팀 정보를 불러오는 데 실패했습니다.", e);
            }
        };

        fetchTeams();
    }, [favoriteTeamIds, selectedLeagueId]);


    const favoriteTeams = teams.filter(team =>
        favoriteTeamIds.includes(team.teamId)
    );
    const nonFavoriteTeams = teams.filter(
        team => !favoriteTeamIds.includes(team.teamId)
    );

    return (
        <div className="team-selector-wrapper">
            {/* 🔽 리그 셀렉트박스 영역 */}
            <LeagueDropdown
                leagues={leagues}
                selectedLeague={selectedLeagueId}
                onChange={setSelectedLeagueId}
            />

            {/* ⭐ 즐겨찾기 고정 팀 영역 (리그 변경 시에도 유지) */}
            {userId &&
                (
                    <div
                        className={`favorite-teams-section scroll-hidden${favoriteTeams.length === 0 ? ' empty' : ''}`}
                    >
                        <div className="team-btn-container">
                            {favoriteTeams.map(team => (
                                <FavoriteTeamButton key={team.teamId} {...team} />
                            ))}
                        </div>
                    </div>
                )
            }

            {/* 📅 리그별 팀 목록 영역 */}
            <div
                className={`nonfavorite-teams-section scroll-hidden${nonFavoriteTeams.length === 0 ? ' empty' : ''}`}
                style={userId ? {} : { maxWidth: 'calc(100% - 90px)' }}
            >
                <div className="team-btn-container">
                    {nonFavoriteTeams.map(team => (
                        <FavoriteTeamButton key={team.teamId} {...team} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamSelector;
