// 쿠키에서 특정 이름을 가진 값을 가져오는 함수
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // 쿠키가 없으면 null을 반환
}


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

export async function apiAddFavoriteTeam(teamId) {
    const csrfToken = getCookie("XSRF-TOKEN");
    const response = await fetch(`/api/lol/favorites/${teamId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
}

export async function apiRemoveFavoriteTeam(teamId) {
    const csrfToken = getCookie("XSRF-TOKEN");
    const response = await fetch(`/api/lol/favorites/${teamId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
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

export async function getFavoritTeamSchedule(favoriteTeamCode) {
    const response = await fetch(`/api/lol/comps/${favoriteTeamCode}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('즐겨찾는 팀 일정 조회 실패');
    }

    return await response.json();
}