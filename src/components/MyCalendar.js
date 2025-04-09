'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { getFavoritTeamSchedule } from "@utils/api-lol.js";

const locales = { ko };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const MyCalendar = ({ events }) => {
    const [currentView, setCurrentView] = useState('month');
    const [teamSchedules, setTeamSchedules] = useState([]);

    // ✅ useCallback으로 currentView 안정적으로 전달
    const initFavoriteTeamSchedule = useCallback(async (view) => {
        const schedules = await getFavoritTeamSchedule();
        console.log(schedules);

        const mapped =
            view === 'month'
                ? schedules.map((schedule) => ({
                    ...schedule,
                    title: schedule.teams.join(' vs '),
                    start: new Date(schedule.startTime),
                    end: new Date(schedule.startTime),  // allDay: true 이면 end 없어도 상단 표시 가능
                    allDay: true,
                }))
                : schedules.flatMap((schedule) => {
                    const startTime = new Date(schedule.startTime);
                    return [
                        {
                            ...schedule,
                            title: schedule.teams.join(' vs '),
                            start: startTime,
                            end: new Date(startTime.getTime() + 60 * 60 * 1000),
                            allDay: true,
                        },
                        {
                            ...schedule,
                            title: schedule.teams.join(' vs '),
                            start: startTime,
                            end: new Date(startTime.getTime() + 60 * 60 * 1000), // 시간 기반
                            allDay: false,
                        },
                    ];
                });

        setTeamSchedules(mapped);
    }, []);

    // ✅ 최초 로드
    useEffect(() => {
        initFavoriteTeamSchedule(currentView);
    }, []);

    // ✅ 뷰 바뀔 때만 다시 요청
    useEffect(() => {
        initFavoriteTeamSchedule(currentView);
    }, [currentView, initFavoriteTeamSchedule]);

    const getDayStyle = (date) => {
        const day = date.getDay(); // 0: SUN, 6: SAT
        // TODO T1 경기 있는 날에 배경색 설정하기
        /*if (day === 0) {
            return { style: {backgroundColor: '#ffe5e5'} };    // SUN: 연한 빨강
        } else if (day === 6) {
            return { style: {backgroundColor: '#e6f0ff'} };    // SAT: 연한 파랑
        }*/

        return {};
    };

    const MyCustomEventComponent = ({ event }) => {
        return (
            <div className="text-xs text-white bg-red-500 px-1 py-0.5 rounded">
                {event.title}
            </div>
        );
    };

    return (
        <div style={{ height: '600px' }}>
            <Calendar
                localizer={localizer}
                events={events || teamSchedules}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                onView={(view) => setCurrentView(view)}
                views={['month', 'week', 'day']}
                style={{ height: '100%' }}
                dayPropGetter={getDayStyle}
                components={{
                    event: MyCustomEventComponent,
                }}
            />
        </div>
    );
};

export default MyCalendar;
