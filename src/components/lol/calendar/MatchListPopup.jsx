import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { format } from 'date-fns';
import ko from "date-fns/locale/ko";

const MatchListPopup = ({ open, onClose, matches, date }) => {
    return (
        <Popup open={open} onClose={onClose} modal closeOnDocumentClick
               contentStyle={{
                   width: '90vw',
                   maxWidth: '500px',
                   maxHeight: '90vh',
                   overflowY: 'auto',
                   position: 'fixed',
                   top: '50%',
                   left: '50%',
                   transform: 'translate(-50%, -50%)'
               }}
        >
            <div className="custom-event-popup text-sm p-4">
                {/*<h2 className="text-lg font-bold mb-2">경기 일정</h2>*/}
                <div className="text-lg font-bold mb-2 border-b py-2">
                    {format(new Date(date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
                </div>
                {matches.length === 0 ? (
                    <p>해당 날짜에 경기가 없습니다.</p>
                ) : (
                    matches.map((match, idx) => {
                        const codes = match.participants?.map(p => p.team.code);
                        return (
                            <div key={match.id || idx} className="border-b py-2">
                                { match.state === 'inProgress' &&
                                    <div className="live-badge inline-flex"></div>
                                }
                                <span>{format(new Date(match.startTime), 'HH:mm')}</span>
                                <div className="font-semibold">
                                    {codes?.map(code =>
                                        code === match.winningTeamCode ? `${code}(승)` : code
                                    ).join(' vs ')}
                                </div>
                                <div>
                                    {new Date(match.startTime) > new Date()
                                        ? match.strategy
                                        : match.participants?.map(p => p.gameWins).join(' : ')}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Popup>
    );
};

export default MatchListPopup;
