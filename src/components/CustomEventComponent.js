import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { format } from 'date-fns';


const CustomEventComponent = ({ event }) => {
    return (
        <Popup
            trigger={
                <div className="text-xs text-white bg-red-500 px-1 py-0.5 rounded cursor-pointer">
                    {event.title}
                </div>
            }
            position="top center"
            closeOnDocumentClick
            arrow={true}
            contentStyle={{
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
        >
            <div className="text-sm">
                {/*<div><strong>{event.teams.join(' vs ')}</strong></div>*/}
                <div><strong>{event.teams
                    .map(teamCode => {
                        return event.winner === teamCode ? teamCode + '(승)' : teamCode;
                    })
                    .join(' vs ')}</strong></div>
                <div>{format(new Date(event.start), 'yyyy년 M월 d일 HH:mm')}</div>
                {/*<div>경기 ID: {event.id}</div>*/}
                {/* 필요 시 버튼도 추가 가능 */}
            </div>
        </Popup>
    );
};

export default CustomEventComponent;