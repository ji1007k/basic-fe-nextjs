export default function handler(req, res) {
    // 예제: 쿠키나 세션에서 유저 정보 확인
    const user = {
        username: "testUser",
        expirationTime: "2025-02-12 12:00",
    };

    res.status(200).json(user);
}
