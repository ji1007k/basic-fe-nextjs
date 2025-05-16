import { useEffect, useState } from "react";
import Standings from "@components/lol/standings/Standings";
import Loading from "@components/common/Loading";
import { apiFetchTournaments } from "@utils/api-lol";

export default function SectionStandings() {
    const [tournaments, setTournaments] = useState([]);
    const [activeTournamentId, setActiveTournamentId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            setIsLoading(true);
            const response = await apiFetchTournaments();
            setTournaments(response);
            if (response.length > 0) {
                const ongoing = response.find(t => t.active);
                setActiveTournamentId(ongoing ? ongoing.id : response[0].id);
            }
            setIsLoading(false);
        };
        fetchTournaments();
    }, []);

    return isLoading ? (
        <Loading message="토너먼트 불러오는 중..." />
    ) : (
        <div className="tournament-container">
            <div className="tournament-select-wrapper">
                <span>Standings</span>
                <select
                    className="tournament-select"
                    value={activeTournamentId}
                    onChange={(e) => setActiveTournamentId(e.target.value)}
                >
                    {tournaments.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.slug}
                        </option>
                    ))}
                </select>
            </div>
            <Standings tournamentId={activeTournamentId} />
        </div>
    );
}
