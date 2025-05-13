"use client";

// src/context/CalandarContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

const CalandarContext = createContext({
    selectedLeague: null,   // 현재 선택된 리그
    selectedTeam: null,     // 현재 선택된 팀
    favoriteTeamIds: [],
    setSelectedLeague: () => {},
    setSelectedTeam: () => {},
    setFavoriteTeamIds: () => {}
});

export const useCalandar = () => useContext(CalandarContext);

export const CalandarProvider = ({ children }) => {
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [favoriteTeamIds, setFavoriteTeamIds] = useState([]);

    useEffect(() => {
        // console.log('selectedTeam 변경됨:', selectedTeam);
    }, [selectedTeam]);

    useEffect(() => {
        // console.log('favoriteTeamIds 변경됨:', favoriteTeamIds);
    }, [favoriteTeamIds]);

    return (
        <CalandarContext.Provider value={{
            selectedLeague, setSelectedLeague,
            selectedTeam, setSelectedTeam,
            favoriteTeamIds, setFavoriteTeamIds
        }}>
            {children}
        </CalandarContext.Provider>
    );
};
