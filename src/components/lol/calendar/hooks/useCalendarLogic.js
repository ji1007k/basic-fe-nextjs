import { useEffect, useState, useCallback } from 'react';
import { getMatchesByYearAndLeagueId, fetchFavoriteTeam } from '@utils/api-lol';
import { useAuth } from '@/context/AuthContext';
import { useCalendar } from '@/context/CalendarContext.js';
import { refineTeamSchedule } from '@/components/lol/calendar/utils/refineTeamSchedule';

/**
 * [훅(Hook)] 소문자 시작 (use prefix)
 */
export const useCalendarLogic = () => {
    const { userId } = useAuth();
    const {
        selectedLeague, setSelectedLeague,
        selectedTeam,
        favoriteTeamIds, setFavoriteTeamIds,
        selectedDate, setSelectedDate
    } = useCalendar();

    // const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [rawSchedules, setRawSchedules] = useState([]);
    const [refinedSchedules, setRefinedSchedules] = useState([]);
    const [leagues, setLeagues] = useState([]);

    // 리그 불러오기
    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const res = await fetch(`/api/lol/leagues`);
                const data = await res.json();
                setLeagues(data);
                if (!selectedLeague && data.length > 0) {
                    setSelectedLeague(data[0]);
                }
            } catch (e) {
                console.error('리그 로딩 실패', e);
            }
        };
        fetchLeagues();
    }, []);

    // 일정 불러오기
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedLeague) return;
            if (userId) {
                const data = await fetchFavoriteTeam();
                setFavoriteTeamIds(data.map((team) => team.teamId));
            }
            const matches = await getMatchesByYearAndLeagueId(selectedDate.getFullYear(), selectedLeague?.id);
            setRawSchedules(matches);
        };
        fetchSchedule();
    }, [userId, selectedLeague, selectedDate]);

    useEffect(() => {
        setRefinedSchedules(refineTeamSchedule(rawSchedules, currentView));
    }, [rawSchedules, currentView, selectedTeam]);

    return {
        leagues,
        currentView,
        setCurrentView,
        refinedSchedules
    };
};
