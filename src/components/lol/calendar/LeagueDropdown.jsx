import { useState, useRef, useEffect } from 'react';

const LeagueDropdown = ({ leagues, selectedLeague, onChange, onOpenSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (league) => {
        onChange(league);
        setIsOpen(false);
    };

    const handleSettingsClick = (e) => {
        e.stopPropagation(); // 드롭다운 닫힘 방지 (필요 시) 또는 닫고 모달 열기
        setIsOpen(false);
        if (onOpenSettings) {
            onOpenSettings();
        }
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

    return (
        <div className="league-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedLeague?.image} alt={selectedLeague?.name} title={selectedLeague?.name} className="dropdown-img" />
                {/*<span>{selectedLeague?.name}</span>*/}
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {leagues.map(league => (
                        <li key={league.id} onClick={() => handleSelect(league)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={league.image} alt={league.name} title={league.name} className="dropdown-img" />
                            <span>{league.name}</span>
                        </li>
                    ))}
                    {/* 설정 버튼 추가 */}
                    {onOpenSettings && (
                        <li className="dropdown-settings-item" onClick={handleSettingsClick} style={{ borderTop: '1px solid #eee', marginTop: '5px', paddingTop: '5px', justifyContent: 'center', color: '#666' }}>
                            <span style={{ marginRight: '5px' }}>⚙️</span>
                            <span>순서 설정</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default LeagueDropdown;
