import { useState, useEffect } from 'react';
import FavoriteTeamButton from "@components/FavoriteTeamButton.js";
import {useCalandar} from "@/context/CalandarContext.js";

const FavoriteTeamList = () => {
    const [teams, setTeams] = useState([]);
    const { favoriteTeamIds } = useCalandar();

    // 팀 정보 불러오기 (fetch)
    useEffect(() => {
        const leagueId = '98767991310872058';   // LCK 1군
        const fetchTeams = async () => {
            try {
                const response = await fetch(`/api/lol/teams?leagueId=${leagueId}`, {
                    method: 'GET'
                }); // 실제 API URL로 변경 필요
                const data = await response.json();

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
            } catch (error) {
                console.error("팀 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchTeams();
    }, [favoriteTeamIds]); // 🔁 즐겨찾기 바뀌면 다시 fetch & 정렬

    return (
        <div className="team-btn-container">
            {teams.map((team) => (
                <FavoriteTeamButton
                    key={team.teamId}
                    teamId={team.teamId}
                    // code={team.code}
                    name={team.name}
                    slug={team.slug}
                    image={team.image}
                />
            ))}
        </div>
    );
};

export default FavoriteTeamList;
