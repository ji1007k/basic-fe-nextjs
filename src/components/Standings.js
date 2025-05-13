import React, { useEffect, useRef, useState } from 'react';
import { apiFetchStandings } from "@utils/api-lol.js";
import Loading from "@components/Loading.js";

const Standings = ({ tournamentId }) => {
    const [standings, setStandings] = useState([]);
    const [activeStageId, setActiveStageId] = useState('');
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const gridContainerRef = useRef(null);
    const [rankings, setRankings] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!tournamentId) return;
            setIsLoading(true);
            const response = await apiFetchStandings(tournamentId);
            setStandings(response);
            setIsLoading(false);
        };
        fetchData();
    }, [tournamentId]);

    useEffect(() => {
        const defaultStage = standings?.[0]?.stages?.[0];
        if (defaultStage) {
            setActiveStageId(defaultStage.id);
            setActiveSectionIndex(0); // 기본은 첫 번째 섹션
        }
    }, [standings]);

    useEffect(() => {
        const stage = standings?.[0]?.stages?.find(stage => stage.id === activeStageId);
        const section = stage?.sections?.[activeSectionIndex];
        if (section?.rankings) {
            setRankings(section.rankings);
        } else {
            setRankings([]);
        }
    }, [standings, activeStageId, activeSectionIndex]);

    useEffect(() => {
        const updateRowCount = () => {
            const containerWidth = gridContainerRef.current ? gridContainerRef.current.offsetWidth : window.innerWidth; // container의 너비를 확인
            const isMobile = containerWidth <= 450;
            const rows = isMobile ? rankings.length : Math.ceil(rankings.length / 2);
            setRowCount(rows);
            // console.log("Container Width: ", containerWidth); // 상태 변경 후 확인
            // console.log("Row Count Updated: ", rows); // 상태 변경 후 확인
        };

        updateRowCount(); // 초기 실행

        window.addEventListener('resize', updateRowCount); // 윈도우 크기 변경 감지

        return () => {
            window.removeEventListener('resize', updateRowCount); // 정리
        };
    }, [rankings]);

    const stages = standings?.[0]?.stages || [];
    const activeStage = stages.find(stage => stage.id === activeStageId);
    const sections = activeStage?.sections || [];
    const activeSection = sections[activeSectionIndex] || null;
    // const rankings = activeSection?.rankings || [];

    if (isLoading) {
        return <Loading message="순위 데이터를 불러오는 중입니다..." />;
    }

    return (
        <div className="ranking-container">
            {/* Stage 선택 */}
            <div className="stage-buttons">
                {stages.map(stage => (
                    <button
                        key={stage.id}
                        onClick={() => {
                            setActiveStageId(stage.id);
                            setActiveSectionIndex(0); // 스테이지 바꾸면 섹션도 초기화
                        }}
                        className={activeStageId === stage.id ? 'active' : ''}
                    >
                        {stage.name}
                    </button>
                ))}
            </div>

            {/* Section 선택 */}
            {sections.length > 1 && (
                <div className="section-buttons">
                    {sections.map((section, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSectionIndex(idx)}
                            className={activeSectionIndex === idx ? 'active' : ''}
                        >
                            {section.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Rankings */}
            {activeSection && rankings.length > 0 ? (
                <div
                    className="ranking-grid"
                    ref={gridContainerRef}
                    style={{
                        gridTemplateRows: `repeat(${rowCount}, auto)`
                    }}
                >
                {rankings.map((team) => {
                        const [wins, losses, gameDiff] = team.record?.split(',') ?? [0, 0, 0];
                        const isSharedRank = rankings.filter(t => t.rank === team.rank).length > 1;

                        return (
                            <div className="team-card" key={team.teamId}>
                                <div className="team-rank-badge">
                                    <span>{team.rank}</span>
                                    {isSharedRank && <span> 공동</span>}
                                </div>
                                <div className="team-icon">
                                    <img src={team.image} alt={team.name} />
                                </div>
                                <div className="team-info">
                                    <div className="team-name">{team.code}</div>
                                    <div className="team-record">
                                        <span className="win">승: {wins}</span>
                                        <span className="loss">패: {losses}</span>
                                        <span>득실: {gameDiff}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-ranking">표시할 순위 정보가 없습니다.</div>
            )}
        </div>
    );
};

export default Standings;
