import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { format } from 'date-fns';

// TODO CODE -> SLUG 또는 TEAM_ID 사용
/**
 * 일정 클릭 팝업 이벤트
 */
const CustomEventWrapper = ({ event, children }) => {
    const codes = event.participants?.map(participant => participant.team.code);

    return (
        <Popup
            trigger={<div>{children}</div>}
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
            <div className="text-sm">
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
                <div>{format(new Date(event.start), 'yyyy년 M월 d일 HH:mm')}</div>
                {/*<div>경기 ID: {event.id}</div>*/}
                {/* 필요 시 버튼도 추가 가능 */}
            </div>
        </Popup>
    );
};

export default CustomEventWrapper;