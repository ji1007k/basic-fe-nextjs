import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { format } from 'date-fns';

// TODO 
//  - CODE -> SLUG 또는 TEAM_ID 사용
//  - 날짜 칸 클릭 시 해당 날짜의 전체 경기 일정 정보 팝업으로 표시
/**
 * 일정 클릭 팝업 이벤트
 */
const CustomEventWrapper = ({ event, children }) => {
    const codes = event.participants?.map(participant => participant.team.code);

    return (
        <Popup
            trigger={
                <div>
                    {children}  {/*refineTeamSchedule > title*/}
                </div>
            }
            modal
            closeOnDocumentClick
            contentStyle={{
                width: '90vw',
                maxWidth: '400px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className="custom-event-popup text-sm">
                <div>{format(new Date(event.start), 'yyyy년 M월 d일 HH:mm')}</div>
                { event.state === 'inProgress' &&
                    <div className="live-badge"></div>
                }
                <div>
                    <strong>{codes
                        .map(code => {
                            return event.winningTeamCode === code
                                ? code + '(승)'
                                : code;
                        })
                        .join(' vs ')}
                    </strong>
                </div>
                { new Date(event.start) > new Date()
                    ? <div>{event.strategy}</div>
                    : <div>{event.participants?.map(participant => participant.gameWins).join(" : ")}</div>
                }
            </div>
        </Popup>
    );
};

export default CustomEventWrapper;