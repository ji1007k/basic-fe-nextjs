'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { getFavoritTeamSchedule } from '@utils/api-lol.js';
import CustomToolbar from '@components/CustomToolbar.js';
import CustomEventComponent from "@components/CustomEventComponent.js";

const locales = { ko };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const formats = {
    dateFormat: 'd',
    dayFormat: (date) => format(date, 'M/d (EEE)', { locale: ko }),
    agendaDateFormat: 'M-d',
    agendaTimeFormat: 'HH:mm',
    agendaHeaderFormat: 'yyyy-MM-d',
    monthHeaderFormat: 'yyyy년 M월',
    dayHeaderFormat: 'yyyy-MM-d',
};

const MyCalendar = ({ events }) => {
    const [currentView, setCurrentView] = useState('month');
    const [rawSchedules, setRawSchedules] = useState([]);
    const [refinedSchedules, setRefinedSchedules] = useState([]);

    // 🔄 스케줄 포맷팅 함수 (view에 따라 변형)
    const refineTeamSchedule = useCallback((schedules, view) => {
        if (!schedules) return [];

        return view === 'month'
            ? schedules.map((schedule) => ({
                ...schedule,
                title: schedule.teams.join(' vs '),
                start: new Date(schedule.startTime),
                end: new Date(schedule.startTime),
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
                        end: new Date(startTime.getTime() + 60 * 60 * 1000),
                        allDay: false,
                    },
                ];
            });
    }, []);

    // ✅ 최초 1번만 API 호출
    useEffect(() => {
        const fetchSchedule = async () => {
            const schedules = await getFavoritTeamSchedule();
            setRawSchedules(schedules);
        };

        fetchSchedule();
    }, []);

    // ✅ view 바뀔 때마다 기존 raw 데이터 포맷만 다시 적용
    useEffect(() => {
        setRefinedSchedules(refineTeamSchedule(rawSchedules, currentView));
    }, [currentView, rawSchedules, refineTeamSchedule]);

    const dayPropGetter = (date) => {
        const day = date.getDay();
        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        const isCurrentMonth = date.getMonth() === new Date().getMonth();

        const style = {
            backgroundColor: isCurrentMonth ? 'transparent' : '#efefef',
            color: isCurrentMonth ? 'inherit' : '#ccc', // 이번 달 아니면 흐리게
        };

        // 👉 요일 색상은 이번 달일 때만 적용
        if (isCurrentMonth) {
            if (day === 0) {
                style.backgroundColor = '#fff5f5'; // 일요일
            } else if (day === 6) {
                style.backgroundColor = '#f0f8ff'; // 토요일
            }
        }

        // 👉 오늘은 최우선으로 덮어씌우기
        if (isToday) {
            style.backgroundColor = '#fff3d7';  // 오늘 배경
            style.fontWeight = 'bold';
            style.color = '#333';
            style.border = '1px solid #aaa';
            style.borderRadius = '4px';
        }

        return { style };
    };



    const MyCustomEventComponent = ({ event }) => {
        return (
            <CustomEventComponent event={event}/>
        )
    };

    return (
        <div style={{ height: '600px' }}>
            <Calendar
                localizer={localizer}
                formats={formats}
                events={events || refinedSchedules}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                onView={(view) => setCurrentView(view)}
                views={['month', 'week', 'day']}
                style={{ height: '100%' }}
                dayPropGetter={dayPropGetter}
                components={{
                    toolbar: CustomToolbar,
                    event: MyCustomEventComponent,
                }}
            />
        </div>
    );
};

export default MyCalendar;
