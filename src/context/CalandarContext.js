"use client";

// src/context/CalandarContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

const CalandarContext = createContext({
    selectedTeam: null, // ✅ 현재 선택된 팀
    favoriteTeamCodes: [],
    setSelectedTeam: () => {},
    setFavoriteTeamCodes: () => {}
});

export const useCalandar = () => useContext(CalandarContext);

export const CalandarProvider = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [favoriteTeamCodes, setFavoriteTeamCodes] = useState([]);

    useEffect(() => {
        console.log('selectedTeam 변경됨:', selectedTeam);
    }, [selectedTeam]);

    useEffect(() => {
        console.log('favoriteTeamCodes 변경됨:', favoriteTeamCodes);
    }, [favoriteTeamCodes]);

    return (
        <CalandarContext.Provider value={{
            selectedTeam, setSelectedTeam,
            favoriteTeamCodes, setFavoriteTeamCodes
        }}>
            {children}
        </CalandarContext.Provider>
    );
};
