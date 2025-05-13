'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/tailwind/lol/calendar.css';
import '@/styles/css/lol-calendar.css';
import { format, parse, startOfWeek, getDay, addDays, isSameDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import {fetchFavoriteTeam, getAllSchedules, getMatchesByYear} from '@utils/api-lol.js';
import CustomToolbar from '@components/lol/CustomToolbar.js';
import CustomEventWrapper from "@components/lol/CustomEventWrapper.js";
import { useAuth } from "@/context/AuthContext.js";
import {useCalandar} from "@/context/CalandarContext.js";
import LeagueAndTeamSelector from "@components/lol/LeagueAndTeamSelector.js";

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
    const { selectedTeam, favoriteTeamIds, setFavoriteTeamIds } = useCalandar();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [rawSchedules, setRawSchedules] = useState([]);
    const [refinedSchedules, setRefinedSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (userId) {
                const data = await fetchFavoriteTeam(); // displayOrder, slug, name
                // console.log(data.map(team => team.teamId))
                setFavoriteTeamIds(data.map(team => team.teamId));
            }

            // 로그인 여부와 상관없이 전체/연도별 일정 조회
            // setRawSchedules(await getAllSchedules());
            setRawSchedules(await getMatchesByYear());
        };

        fetchSchedule();
    }, [userId]);

    // 🔄 스케줄 포맷팅 함수 (view에 따라 변형)
    const refineTeamSchedule = useCallback((schedules, view) => {
        if (!schedules) return [];

        return view === 'month'
            ? schedules
                .filter(schedule => schedule.participants.length > 0)
                .map((schedule) => {
                    const participants = schedule.participants;

                    return {
                        ...schedule,
                        title: [participants[0].team.code, participants[1].team.code].join(' vs '),
                        start: new Date(schedule.startTime),
                        end: new Date(schedule.startTime),
                        allDay: true
                    }
                })
            : schedules
                .filter(schedule => schedule.participants.length > 0)
                .flatMap((schedule) => {
                const participants = schedule.participants;
                const startTime = new Date(schedule.startTime);
                return [
                    {
                        ...schedule,
                        title: [participants[0].team.code, participants[1].team.code].join(' vs '),
                        start: startTime,
                        end: new Date(startTime.getTime() + 60 * 60 * 1000),
                        allDay: true,
                    },
                    {
                        ...schedule,
                        title: [participants[0].team.code, participants[1].team.code].join(' vs '),
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
    }, [rawSchedules, refineTeamSchedule, currentView, selectedTeam]);

    // 경기 일정별 스타일
    const eventPropGetter = (event, start, end, isSelected) => {
        // console.log('경기 정보: ', event);
        const Ids = event.participants?.map(participant => participant.team.teamId);
        const isFavoriteMatch = Ids.some(teamId =>
            favoriteTeamIds?.includes(teamId)
        );

        const isSelectedTeamMatch = selectedTeam && Ids.includes(selectedTeam.teamId);
        const isUnstarted = event.state === 'unstarted';

        let style = {
            borderRadius: '6px',
            padding: '2px 6px',
        };

        // 🎯 즐겨찾기 + 선택된 팀 → 더 강조
        if (isFavoriteMatch && isSelectedTeamMatch) {
            style.backgroundColor = '#f4511e';
            style.border = '2px solid #ffd54f';
            style.color = '#fffaf0';
            style.fontWeight = '600';
            style.boxShadow = '0 0 0 2px #ffeb3b66';
        }
        // ⭐ 즐겨찾기만
        else if (isFavoriteMatch) {
            style.backgroundColor = '#f4511e';
            style.border = '1px solid #d84315';
            style.color = '#fffaf0';
            style.fontWeight = '600';
        }
        // 🔷 선택된 팀만
        else if (isSelectedTeamMatch) {
            style.backgroundColor = '#fffde7';
            style.border = '2px dashed #1976d2'; // 파란 점선 강조
            style.color = '#0d47a1';
            style.fontWeight = '500';
        }
        // ⏳ 시작 안 한 경기
        else if (isUnstarted) {
            style.backgroundColor = '#e3f2fd';
            style.border = '1px dashed #64b5f6';
            style.color = '#1e88e5';
            style.fontStyle = 'italic';
        }
        // 🕓 기본 경기
        else {
            style.backgroundColor = '#f0f2f5';
            style.border = '1px solid #cfd8dc';
            style.color = '#37474f';
        }

        return { style };
    }

    return (
        <div className="calandar-container">
            <Calendar
                localizer={localizer}
                formats={formats}
                events={events || refinedSchedules}  // 이벤트 데이터는 상태에 따라 조정됨
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                onView={(view) => setCurrentView(view)}
                views={['month', 'week', 'day']}
                style={{height: 'calc(100% - 70px)'}}
                eventPropGetter={eventPropGetter}
                components={{
                    toolbar: CustomToolbar,
                    eventWrapper: CustomEventWrapper,
                }}
                selectable
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
            />
            <LeagueAndTeamSelector />
        </div>
    );
};

export default MyCalendar;
