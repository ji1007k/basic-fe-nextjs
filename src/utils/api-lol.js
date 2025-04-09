
export async function getFavoritTeamSchedule() {
    const favoriteTeamCode = 'T1';
    const response = await fetch(`/api/lol/comps/${favoriteTeamCode}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('즐겨찾는 팀 일정 조회 실패');
    }

    return await response.json();
}