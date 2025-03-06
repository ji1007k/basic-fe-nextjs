// utils/api.js
export async function login(username, password) {
    const usrInfo = `${username}:${password}`;
    const utf8Encoded = String.fromCharCode(...new TextEncoder().encode(usrInfo));

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${btoa(utf8Encoded)}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok/* || !response.headers.get("Set-Cookie")*/) {
            return {
                success: false,
                errorMessage: "로그인 실패: 사용자명 또는 비밀번호를 확인하세요.",
            };
        }

        const data = await response.json();
        return {
            success: true,
            mainPageUrl: data.mainPageUrl,
            expirationTime: data.expirationTime,
            username: username,  // 사용자명 추가
        };
    } catch (err) {
        console.error("로그인 오류:", err);
        return {
            success: false,
            errorMessage: "서버 오류가 발생했습니다.",
        };
    }
}

export async function signup(username, password) {
    // 회원가입 시 자체서명 SSL 인증서 때문에 발생하는 Failed to proxy Error 우회
    const response = await fetch("/api/auth/signup", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: username,
            password: password,
            name: username,
            authority: 'SCOPE_ADMIN'
        }),
    });

    if (!response.ok) {
        console.log(await response.text());
        throw new Error("회원가입 실패: 사용자명 또는 비밀번호를 확인하세요.");
    }

    const result = await response.text();
    return result;
}

export async function logout() {
    // 로그아웃을 위한 처리
    const response = await fetch("/api/auth/logout", { method: "GET" });

    if (!response.ok) {
        throw new Error("로그아웃 실패");
    }
}

export async function refreshToken() {
    const response = await fetch("/api/auth/token/refresh", {
        method: "POST",
        credentials: 'include', // 쿠키 포함
    });


    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return await response.json();
}
