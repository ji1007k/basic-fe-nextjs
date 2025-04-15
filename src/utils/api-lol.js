export async function fetchFavoriteTeam() {
    const response = await fetch('/api/lol/favorites', {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}

export async function getFavoritTeamSchedule(favoriteTeamCode) {
    const response = await fetch(`/api/lol/comps/${favoriteTeamCode}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('즐겨찾는 팀 일정 조회 실패');
    }

    return await response.json();
}

export async function getAllSchedules() {
    const response = await fetch('/api/lol/comps', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('전체 경기 일정 조회 실패');
    }

    return await response.json();
}