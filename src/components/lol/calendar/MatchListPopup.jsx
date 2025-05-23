import Popup from 'reactjs-popup';
import { format } from 'date-fns';
import 'reactjs-popup/dist/index.css';
import { FiX } from 'react-icons/fi';
import ko from "date-fns/locale/ko";

function MatchListPopup ({ open, onClose, matches, date }) {
    const matchDate = format(new Date(date), "yyyy년 M월 d일 (EEE)", { locale: ko });

    return (
        <Popup
            open={open}
            onClose={onClose}
            modal
            closeOnDocumentClick={false}
            contentStyle={{}} // contentStyle 비워두고 className으로만 조절
        >
            {(close) => (
                <div className="match-list-popup">
                    {/* 상단 제목 */}
                    <div className="popup-header">
                        <span>{matchDate} 경기 일정</span>
                        <button
                            onClick={() => {
                                close();
                                onClose();
                            }}
                            className="close-btn"
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className="popup-body">
                        {matches.length === 0 ? (
                            <p>해당 날짜에 경기가 없습니다.</p>
                        ) : (
                            matches.map((match) => {
                                const isUnstarted = match.state === "unstarted";
                                const isLive = match.state === "inProgress";
                                const isCompleted = match.state === "completed";
                                const [teamA, teamB] = match.participants;
                                const winner = !isCompleted ? null :
                                    teamA.outcome === 'win' ? teamA : teamB;

                                return (
                                    <div key={match.matchId} className="match-card">
                                        <div className="status-time-row">
                                            <div className="status-labels">
                                                {isUnstarted && <span className="label unstarted">예정</span>}
                                                {isLive && <span className="label live">LIVE</span>}
                                                {isCompleted && <span className="label completed">완료</span>}
                                                <span>{format(new Date(match.startTime), 'HH:mm')}</span>
                                            </div>
                                        </div>

                                        {isUnstarted ? (
                                                <div className="teams-row">
                                                    <div className="team team-left">
                                                        <span className="team-code">{teamA.team.code}</span>
                                                    </div>
                                                    <div className="label strategy">
                                                        {match.strategy}
                                                    </div>
                                                    <div className="team team-right">
                                                        <span className="team-code">{teamB.team.code}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="teams-row">
                                                    <div className="team team-left">
                                                        <span className="team-code">{teamA.team.code}</span>
                                                        {isCompleted &&
                                                            (<span className={`result ${winner?.team.slug === teamA.team.slug ? "win" : "lose"}`}>
                                                                {winner?.team.slug === teamA.team.slug ? "승" : "패"}
                                                            </span>)
                                                        }
                                                    </div>
                                                    <div className="score">
                                                        {teamA.gameWins ?? 0} : {teamB.gameWins ?? 0}
                                                    </div>
                                                    <div className="team team-right">
                                                        {isCompleted &&
                                                            (<span className={`result ${winner?.team.slug === teamB.team.slug ? "win" : "lose"}`}>
                                                                {winner?.team.slug === teamB.team.slug ? "승" : "패"}
                                                            </span>)
                                                        }
                                                        <span className="team-code">{teamB.team.code}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* 하단 닫기 */}
                    <div className="popup-footer">
                        <button
                            onClick={() => {
                                close();
                                onClose();
                            }}
                            className="footer-btn"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    );
};

export default MatchListPopup;