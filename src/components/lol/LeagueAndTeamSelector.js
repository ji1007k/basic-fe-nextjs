import {useEffect, useState} from "react";
import FavoriteTeamButton from "@components/lol/FavoriteTeamButton";
import {useCalandar} from "@/context/CalandarContext";
import {useAuth} from "@/context/AuthContext.js";
import LeagueDropdown from "@components/lol/LeagueDropdown.js";

const LeagueAndTeamSelector = () => {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState('');
    const [rawTeams, setRawTeams] = useState([]); // 👈 fetch 결과만 보관
    const [teams, setTeams] = useState([]);       // 👈 정렬된 최종 데이터

    const {favoriteTeamIds} = useCalandar();
    const {userId} = useAuth();

    // 🎯 리그 목록 가져오기
    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const res = await fetch(`/api/lol/leagues`);
                const data = await res.json();
                setLeagues(data);

                if (!selectedLeagueId && data.length > 0) {
                    setSelectedLeagueId(data[0].id);
                }
            } catch (e) {
                console.error("리그 로딩 실패", e);
            }
        };

        fetchLeagues();
    }, []);

    // 🎯 리그 변경 시 팀 fetch
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch(`/api/lol/teams?leagueId=${selectedLeagueId}`);
                const data = await res.json();
                setRawTeams(data); // fetch만 담당
            } catch (e) {
                console.error("팀 정보를 불러오는 데 실패했습니다.", e);
            }
        };

        if (selectedLeagueId) {
            fetchTeams();
        }
    }, [selectedLeagueId]);

    // 🎯 즐겨찾기 or rawTeams 변경 시 정렬
    useEffect(() => {
        if (!rawTeams.length) return;

        const sortedData = [...rawTeams].sort((a, b) => {
            const aIndex = favoriteTeamIds.indexOf(a.teamId);
            const bIndex = favoriteTeamIds.indexOf(b.teamId);

            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return 0;
        });

        setTeams(sortedData);
    }, [favoriteTeamIds, rawTeams]);

    // ✅ 즐겨찾기 팀 분리
    const favoriteTeams = teams.filter(team =>
        favoriteTeamIds.includes(team.teamId)
    );
    const nonFavoriteTeams = teams.filter(
        team => !favoriteTeamIds.includes(team.teamId)
    );

    return (
        <div className="team-selector-wrapper">
            <LeagueDropdown
                leagues={leagues}
                selectedLeague={selectedLeagueId}
                onChange={setSelectedLeagueId}
            />

            {userId && (
                <div
                    className={`favorite-teams-section scroll-hidden${favoriteTeams.length === 0 ? ' empty' : ''}`}
                >
                    <div className="team-btn-container">
                        {favoriteTeams.map(team => (
                            <FavoriteTeamButton key={team.teamId} {...team} />
                        ))}
                    </div>
                </div>
            )}

            <div
                className={`nonfavorite-teams-section scroll-hidden${nonFavoriteTeams.length === 0 ? ' empty' : ''}`}
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

export default LeagueAndTeamSelector;
