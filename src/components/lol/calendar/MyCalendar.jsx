'use client';

import React from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';

import {format, getDay, parse, startOfWeek} from 'date-fns';
import ko from 'date-fns/locale/ko';

import CustomToolbar from '@/components/lol/CustomToolbar';
import CustomEventWrapper from '@/components/lol/CustomEventWrapper';
import {useCalendarLogic} from '@/components/lol/calendar/useCalendarLogic';
import {eventPropGetter} from '@/components/lol/calendar/utils/calendarEventStyles';
import {formats} from '@/components/lol/calendar/config/formats';
import LeagueAndTeamSelector from '@/components/lol/LeagueAndTeamSelector';
import {useCalandar} from "@/context/CalandarContext.js";

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
        currentDate, setCurrentDate,
        currentView, setCurrentView,
        refinedSchedules
    } = useCalendarLogic();
    const { selectedTeam, favoriteTeamIds } = useCalandar();

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
                date={currentDate}
                onNavigate={setCurrentDate}
                onView={setCurrentView}
                eventPropGetter={(event) => eventPropGetter(event, selectedTeam, favoriteTeamIds)}
                components={{
                    toolbar: CustomToolbar,
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
            />
            <LeagueAndTeamSelector leagues={leagues} />
        </div>
    );
};

export default MyCalendar;
