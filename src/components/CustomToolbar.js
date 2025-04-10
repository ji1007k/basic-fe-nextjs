import React from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';
import { addDays, startOfWeek, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const formatWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 월요일 시작
    const end = addDays(start, 6);
    return `${format(start, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(end, 'M월 d일', { locale: ko })}`;
};

const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');
    const goToView = (view) => toolbar.onView(view);

    const label =
        toolbar.view === 'week'
            ? formatWeekRange(toolbar.date)
            : format(toolbar.date, 'yyyy년 M월', { locale: ko });

    return (
        <div className="custom-toolbar">
            <div className="label-area">
                <button onClick={goToBack}><FaChevronLeft /></button>
                <span>{label}</span>
                <button onClick={goToNext}><FaChevronRight /></button>
            </div>
            <div>
                <button onClick={goToToday}>Today</button>
                <button onClick={() => goToView('month')}><FaCalendarAlt /></button>
                <button onClick={() => goToView('week')}><FaCalendarWeek /></button>
                <button onClick={() => goToView('day')}><FaCalendarDay /></button>
            </div>
        </div>
    );
};

export default CustomToolbar;