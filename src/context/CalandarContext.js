"use client";

// src/context/CalandarContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

const CalandarContext = createContext({
    selectedTeam: null, // ✅ 현재 선택된 팀
    favoriteTeamSlugs: [],
    setSelectedTeam: () => {},
    setFavoriteTeamSlugs: () => {}
});

export const useCalandar = () => useContext(CalandarContext);

export const CalandarProvider = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [favoriteTeamSlugs, setFavoriteTeamSlugs] = useState([]);

    useEffect(() => {
        console.log('selectedTeam 변경됨:', selectedTeam);
    }, [selectedTeam]);

    useEffect(() => {
        console.log('favoriteTeamSlugs 변경됨:', favoriteTeamSlugs);
    }, [favoriteTeamSlugs]);

    return (
        <CalandarContext.Provider value={{
            selectedTeam, setSelectedTeam,
            favoriteTeamSlugs, setFavoriteTeamSlugs
        }}>
            {children}
        </CalandarContext.Provider>
    );
};
