import { useState, useRef, useEffect } from 'react';

const LeagueDropdown = ({ leagues, selectedLeague, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (leagueId) => {
        onChange(leagueId);
        setIsOpen(false);
    };

    // 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = leagues.find(l => l.id === selectedLeague);

    return (
        <div className="league-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected?.image} alt={selected?.name} title={selected?.name} className="dropdown-img" />
                {/*<span>{selected?.name}</span>*/}
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {leagues.map(league => (
                        <li key={league.id} onClick={() => handleSelect(league.id)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={league.image} alt={league.name} title={league.name} className="dropdown-img" />
                            <span>{league.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LeagueDropdown;
