'use client';

import React, {useState} from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';

import {format, getDay, parse, startOfWeek} from 'date-fns';
import ko from 'date-fns/locale/ko';

import CustomToolbar from '@components/lol/calendar/CustomToolbar';
import CustomEventWrapper from '@components/lol/calendar/CustomEventWrapper';
import {useCalendarLogic} from '@/components/lol/calendar/hooks/useCalendarLogic';
import {eventPropGetter} from '@/components/lol/calendar/utils/calendarEventStyles';
import {formats} from '@/components/lol/calendar/config/formats';
import LeagueAndTeamSelector from '@components/lol/calendar/LeagueAndTeamSelector';
import {useCalendar} from "@/context/CalendarContext.js";
import {getMatchesByLeagueIdAndDate} from "@utils/api-lol.js";
import {getDateRange} from "@utils/date-util.js";
import MatchListPopup from "@components/lol/calendar/MatchListPopup.jsx";

const localizer = dateFnsLocalizer({
    format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), getDay,
    locales: { ko }
});


/**
 * [React 컴포넌트 파일] 대문자 시작
 * 컴포넌트는 명시적으로 함수로 작성 (선언식 함수)
 */
function MyCalendar ({ events }) {
    const [isLoading, setIsLoading] = useState(true);
    const {
        leagues,
        currentView, setCurrentView,
        refinedSchedules,
        popupMatches, setPopupMatches, popupOpen, setPopupOpen, popupDate, setPopupDate,
    } = useCalendarLogic();
    const { selectedLeague,
        selectedTeam, favoriteTeamIds,
        selectedDate, setSelectedDate
    } = useCalendar();


    function CalendarEvent({ event }) {
        const isInProgress = event.state === 'inProgress';
        return (
            <div className="flex items-center">
                {isInProgress && <span className="live-badge" />}
                <span>{event.title}</span>
            </div>
        );
    }

    // 경기 일정 팝업 핸들러
    const handlePrevDate = async () => {
        const newDate = new Date(popupDate);
        newDate.setDate(newDate.getDate() - 1);
        await fetchMatchesForDate(newDate);
    };

    const handleNextDate = async () => {
        const newDate = new Date(popupDate);
        newDate.setDate(newDate.getDate() + 1);
        await fetchMatchesForDate(newDate);
    };

    const fetchMatchesForDate = async (date) => {
        const { startDate, endDate } = getDateRange('day', date);
        setPopupDate(date);
        setIsLoading(true);
        setPopupOpen(true);

        try {
            const response = await getMatchesByLeagueIdAndDate(
                selectedLeague?.id,
                startDate,
                endDate
            );
            setPopupMatches(response || []);
        } catch (err) {
            console.error('Error fetching matches:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                formats={formats}
                events={events || refinedSchedules}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={['month', 'week', 'day']}
                /*views={{
                    month: true,        // 기본 월간 뷰
                    day: true,          // 기본 일간 뷰
                    week: CustomVerticalWeekView, // 커스텀 주간 뷰 (요일 세로)
                }}*/
                date={selectedDate}
                onNavigate={setSelectedDate}
                onView={setCurrentView}
                eventPropGetter={(event) => eventPropGetter(event, selectedTeam, favoriteTeamIds)}
                components={{
                    toolbar: CustomToolbar,
                    event: CalendarEvent,
                    eventWrapper: CustomEventWrapper,
                    month: {
                        dateHeader: ({ date, label }) => (
                            <div style={{ color: date.getDay() === 0 ? 'red' : undefined }}>
                                {label}
                            </div>
                        ),
                    },
                    header: ({ date, label }) => (
                        <div style={{ color: date.getDay() === 0 ? 'red' : 'inherit' }}>
                            {label}
                        </div>
                    ),
                }}
                selectable
                longPressThreshold={100} // 터치로 인정할 시간. 기본 250
                onSelectSlot={async (slotInfo) => {
                    if (!slotInfo?.start) return;
                    fetchMatchesForDate(slotInfo.start);
                }}
            />
            {popupOpen && (
                    <MatchListPopup
                        open={popupOpen}
                        onClose={() => setPopupOpen(false)}
                        matches={popupMatches}
                        date={popupDate}
                        isLoading={isLoading}
                        onPrevDate={handlePrevDate}
                        onNextDate={handleNextDate}
                    />
                )
            }

            <LeagueAndTeamSelector leagues={leagues} />
        </div>
    );
};

export default MyCalendar;
