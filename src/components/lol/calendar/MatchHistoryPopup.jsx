import Popup from "reactjs-popup";
import {FiX} from "react-icons/fi";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// TODO
//  - 닫기 버튼 컴포넌트화
function MatchHistoryPopup({team, matches, open, onClose}) {
    const contentStyle = {
        width: '90vw',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'fixed',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        paddingLeft: '20px', // 좌측 여백 확보
    };

    return (
        <Popup
            open={open}
            onClose={onClose}
            modal
            closeOnDocumentClick={false}
            contentStyle={contentStyle}
        >
            {(close) => (
                <div className="custom-event-popup text-sm py-2">
                    {/* 상단 우측 닫기 버튼 */}
                    <button
                        onClick={() => {
                            close();
                            onClose();
                        }}
                        className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
                    >
                        <FiX />
                    </button>

                    <div>
                        <span className="font-bold text-lg">{team.name} 전적</span>
                        {matches.map((match, index) => {
                            const isLive = match.state === 'inProgress';
                            const isCompleted = match.state === 'completed';
                            const hasVod = match.flags?.includes('hasVod');
                            const [teamA, teamB] = match.teams;
                            const winner = match.teams.find(t => t.result?.outcome === 'win');
                            const matchTime = format(new Date(match.startTime), 'yyyy년 M월 d일 (EEE) aaa h:mm', {locale: ko});

                            return (
                                <div
                                    key={match.matchId}
                                    className="relative border rounded-md p-4 my-2 shadow-sm bg-white flex flex-col gap-1"
                                    style={{
                                        border: `2px solid ${winner.code === team.code ? '#22c55e' : '#ef4444'}`, // green or red
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '10px',
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    {/* 번호 배지 (카드 좌상단) */}
                                    <div className="absolute -left-3 -top-3 bg-gray-300 text-gray-800 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow">
                                        {index + 1}
                                    </div>

                                    {/* 상태 + 시간 */}
                                    <div className="flex items-center text-xs text-gray-600 mb-1 gap-2">
                                        {isLive && (
                                            <span
                                                className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">LIVE</span>
                                        )}
                                        {isCompleted && (
                                            <span className="bg-gray-300 text-gray-800 px-2 py-0.5 rounded text-xs">경기 종료</span>
                                        )}
                                        <span>{matchTime}</span>
                                    </div>

                                    {/* 팀 이름 + 승자 표시 (가운데 정렬됨) */}
                                    <div
                                        className="flex justify-between items-center text-sm font-medium text-gray-800">
                                        {/* 왼쪽 팀 + 승자 */}
                                        <div className="flex items-center gap-1" style={{width: '120px'}}>
                                            <span className="text-base font-semibold"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    textAlign: 'center',
                                                    maxWidth: '100%',
                                                    width: '60px'
                                                }}
                                            >
                                                {teamA.code}
                                            </span>
                                            <span style={{
                                                backgroundColor: winner?.slug === teamA.slug ? '#22c55e' : '#e5e7eb', // 초록 / 회색
                                                color: winner?.slug === teamA.slug ? 'white' : 'black',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {winner?.slug === teamA.slug ? '승' : '패'}
                                            </span>

                                        </div>

                                        {/* 세트 스코어 */}
                                        <div className="text-base font-semibold">
                                            {teamA.result?.gameWins ?? 0} : {teamB.result?.gameWins ?? 0}
                                        </div>

                                        {/* 오른쪽 팀 + 승자 */}
                                        <div style={{position: 'relative', width: '120px'}}>
                                            <div style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                maxWidth: '100%'
                                            }}>
                                                <span style={{
                                                    backgroundColor: winner?.slug === teamB.slug ? '#22c55e' : '#e5e7eb', // 초록 / 회색
                                                    color: winner?.slug === teamB.slug ? 'white' : 'black',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {winner?.slug === teamB.slug ? '승' : '패'}
                                                </span>
                                                <span className="text-base font-semibold"
                                                      style={{
                                                          whiteSpace: 'nowrap',
                                                          overflow: 'hidden',
                                                          textOverflow: 'ellipsis',
                                                          textAlign: 'center',
                                                          maxWidth: '100%',
                                                          width: '60px'
                                                      }}>
                                                    {teamB.code}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🎥 영상보기 버튼 (오른쪽 고정) */}
                                    {hasVod && (
                                        <button
                                            className="absolute right-4 top-4 text-sm text-blue-600 hover:underline"
                                            onClick={() => window.open(`https://vod.example.com/${match.matchId}`, '_blank')}
                                        >
                                            🎥 영상 보기
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>


                    {/* 하단 닫기 버튼 */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                close();
                                onClose();
                            }}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

        </Popup>
    )

}


export default MatchHistoryPopup;