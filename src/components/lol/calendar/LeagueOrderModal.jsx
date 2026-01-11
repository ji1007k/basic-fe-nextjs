import { useState, useEffect } from 'react';
import { apiUpdateLeagueOrders } from '@/utils/api-lol';

const LeagueOrderModal = ({ isOpen, onClose, leagues, onUpdate }) => {
    const [orderedLeagues, setOrderedLeagues] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setOrderedLeagues([...leagues]);
        }
    }, [isOpen, leagues]);

    const moveUp = (index) => {
        if (index === 0) return;
        const newList = [...orderedLeagues];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        setOrderedLeagues(newList);
    };

    const moveDown = (index) => {
        if (index === orderedLeagues.length - 1) return;
        const newList = [...orderedLeagues];
        [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
        setOrderedLeagues(newList);
    };

    const handleSave = async () => {
        try {
            const leagueIds = orderedLeagues.map(l => l.leagueId);
            await apiUpdateLeagueOrders(leagueIds);
            onUpdate(orderedLeagues); // 부모 컴포넌트에 변경된 목록 전달
            onClose();
        } catch (error) {
            console.error("리그 순서 저장 실패:", error);
            alert("리그 순서 저장에 실패했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content league-order-modal">
                <h3>리그 순서 설정</h3>
                <ul className="league-order-list">
                    {orderedLeagues.map((league, index) => (
                        <li key={league.leagueId} className="league-order-item">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={league.image} alt={league.name} className="league-icon" />
                            <span className="league-name">{league.name}</span>
                            <div className="order-controls">
                                <button onClick={() => moveUp(index)} disabled={index === 0}>▲</button>
                                <button onClick={() => moveDown(index)} disabled={index === orderedLeagues.length - 1}>▼</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="modal-actions">
                    <button onClick={handleSave} className="save-btn">저장</button>
                    <button onClick={onClose} className="cancel-btn">취소</button>
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                    color: #333;
                }
                .league-order-list {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0;
                }
                .league-order-item {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                }
                .league-icon {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                .league-name {
                    flex-grow: 1;
                }
                .order-controls button {
                    margin-left: 5px;
                    padding: 2px 8px;
                    cursor: pointer;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .save-btn {
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .cancel-btn {
                    background-color: #ccc;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default LeagueOrderModal;
