import React, {useEffect, useRef, useState} from 'react';
import { apiFetchStandings } from "@utils/api-lol.js";
import Loading from "@components/Loading.js";

const Standings = ({ tournamentId }) => {
    const [stages, setStages] = useState([]);
    const [activeStageId, setActiveStageId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const gridContainerRef = useRef(null); // useRef를 사용하여 DOM에 접근

    useEffect(() => {
        const fetchData = async () => {
            if (!tournamentId) return;
            setIsLoading(true);
            const response = await apiFetchStandings(tournamentId);
            setStages(response);
            setIsLoading(false);
        };
        fetchData();
    }, [tournamentId]);

    useEffect(() => {
        if (stages.length > 0) {
            setActiveStageId(stages[0].id);
        }
    }, [stages]);

    const activeStage = stages.find(stage => stage.id === activeStageId);

    if (isLoading) {
        return <Loading message="순위 데이터를 불러오는 중입니다..." />;
    }

    if (!activeStage) {
        return <div className="no-ranking">표시할 순위 정보가 없습니다.</div>;
    }

    return (
        <div className="ranking-container">
            {tournamentId && (
                <div className="stage-buttons">
                    {stages.map(stage => (
                        <button
                            key={stage.id}
                            onClick={() => setActiveStageId(stage.id)}
                            className={activeStageId === stage.id ? 'active' : ''}
                        >
                            {stage.name}
                        </button>
                    ))}
                </div>
            )}

            {activeStage.rankings?.length > 0 ? (
                <div className="ranking-grid" ref={gridContainerRef}>
                    {activeStage.rankings.map((team) => {
                        const [wins, losses] = team.record.split(',');

                        return (
                            <div className="team-card" key={team.teamId}>
                                <div className="team-rank-badge">
                                    <span>{team.rank}</span>
                                    {activeStage.rankings.filter(t => t.rank === team.rank).length > 1
                                        && <span> 공동</span>
                                    }
                                </div>
                                <div className="team-icon">
                                    <img src={team.image} alt={team.teamName} />
                                </div>
                                <div className="team-info">
                                    <div className="team-name">{team.teamCode}</div>
                                    <div className="team-record">
                                        <span className="win">승: {wins}</span>
                                        <span className="loss">패: {losses}</span>
                                        {/*TODO*/}
                                        <span>득실: 10</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-ranking">순위 정보가 없습니다.</div>
            )}
        </div>
    );
};

export default Standings;
