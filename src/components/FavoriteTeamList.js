import { useState, useEffect } from 'react';
import FavoriteTeamButton from "@components/FavoriteTeamButton.js";

const FavoriteTeamList = () => {
    const [teams, setTeams] = useState([]);

    // 팀 정보 불러오기 (fetch)
    useEffect(() => {
        const homeLeague = 'LCK';
        const fetchTeams = async () => {
            try {
                const response = await fetch(`/api/lol/teams?homeLeague=${homeLeague}`, {
                    method: 'GET'
                }); // 실제 API URL로 변경 필요
                const data = await response.json();
                setTeams(data); // 데이터 설정
            } catch (error) {
                console.error("팀 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div className="team-btn-container">
            {teams.map((team) => (
                <FavoriteTeamButton
                    key={team.id}
                    teamId={team.id}
                    teamCode={team.teamCode}
                    teamName={team.teamName}
                    slug={team.slug}
                    image={team.image}
                />
            ))}
        </div>
    );
};

export default FavoriteTeamList;
