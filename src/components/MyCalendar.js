'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import {fetchFavoriteTeam, getAllSchedules} from '@utils/api-lol.js';
import CustomToolbar from '@components/CustomToolbar.js';
import CustomEventWrapper from "@components/CustomEventWrapper.js";
import { useAuth } from "@/context/AuthContext.js";

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

// 로그인 했으면 즐겨찾는 팀 일정 조회 / 즐찾 팀 일정 색상 다르게만?
// 로그인 안했으면 전체 일정 조회
const MyCalendar = ({ events }) => {
    const { userId } = useAuth();
    const [currentView, setCurrentView] = useState('month');
    const [favoriteTeamCodes, setFavoriteTeamCodes] = useState([]);
    const [rawSchedules, setRawSchedules] = useState([]);
    const [refinedSchedules, setRefinedSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (userId) {
                const data = await fetchFavoriteTeam(); // displayOrder, teamCode, teamName
                setFavoriteTeamCodes(data.map(team => team.teamCode));
            }
            setRawSchedules(await getAllSchedules()); // 로그인 여부와 상관없이 전체 일정 조회
        };

        fetchSchedule();
    }, [userId]);

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

    // ✅ view 바뀔 때마다 기존 raw 데이터 포맷만 다시 적용
    useEffect(() => {
        setRefinedSchedules(refineTeamSchedule(rawSchedules, currentView));
    }, [rawSchedules, refineTeamSchedule, currentView]);

    return (
        <div>
            <Calendar
                localizer={localizer}
                formats={formats}
                events={events || refinedSchedules}  // 이벤트 데이터는 상태에 따라 조정됨
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                onView={(view) => setCurrentView(view)}
                views={['month', 'week', 'day']}
                style={{ height: '100%' }}
                eventPropGetter={(event, start, end, isSelected) => {
                    const isFavoriteMatch = event.teams?.some(code =>
                        favoriteTeamCodes?.includes(code)
                    );

                    const isUnstarted = event.state === 'unstarted';

                    let style;

                    // 🎯 즐겨찾기 팀 경기의 색상 스타일
                    if (isFavoriteMatch) {
                        style = {
                            backgroundColor: '#f4511e', // 강조 색상 (주황색)
                            border: '1px solid #d84315',
                            color: '#fffaf0',
                            fontWeight: '600',
                        };
                    }
                    // ⏳ 시작 안 한 경기 스타일
                    else if (isUnstarted) {
                        style = {
                            backgroundColor: '#e3f2fd', // 연블루
                            border: '1px dashed #64b5f6',
                            color: '#1e88e5',
                            fontStyle: 'italic',
                        };
                    }
                    // 🕓 일반 종료 경기 스타일
                    else {
                        style = {
                            backgroundColor: '#f0f2f5',
                            border: '1px solid #cfd8dc',
                            color: '#37474f',
                        };
                    }

                    // 📦 공통 스타일 추가
                    style.borderRadius = '6px';
                    style.padding = '2px 6px';

                    return { style };
                }}
                components={{
                    toolbar: CustomToolbar,
                    eventWrapper: CustomEventWrapper,
                }}
            />
        </div>
    );
};

export default MyCalendar;
