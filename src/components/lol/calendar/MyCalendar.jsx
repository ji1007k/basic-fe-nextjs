'use client';

import React from 'react';
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
 */
const MyCalendar = ({ events }) => {
    const {
        leagues,
        currentView, setCurrentView,
        refinedSchedules,
        popupMatches, setPopupMatches, popupOpen, setPopupOpen,
    } = useCalendarLogic();
    const { selectedLeague,
        selectedTeam, favoriteTeamIds,
        selectedDate, setSelectedDate
    } = useCalendar();

    return (
        <div className="calandar-container">
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
                    event: ({ event }) => {
                        const isInProgress = event.state === 'inProgress';
                        return (
                            <div className="flex items-center">
                                {isInProgress && (
                                    <span className="live-badge"></span>
                                )}
                                <span>{event.title}</span>
                            </div>
                        );
                    },
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
                onSelectSlot={async (slotInfo) => {
                    const { startDate, endDate } = getDateRange('day', slotInfo.start);
                    const response = await getMatchesByLeagueIdAndDate(selectedLeague.id, startDate, endDate);

                    setPopupMatches(response);
                    setPopupOpen(true);
                }}
            />
            {popupOpen && (
                    <MatchListPopup
                        open={popupOpen}
                        onClose={() => setPopupOpen(false)}
                        matches={popupMatches}
                        date={selectedDate}
                    />
                )
            }

            <LeagueAndTeamSelector leagues={leagues} />
        </div>
    );
};

export default MyCalendar;
