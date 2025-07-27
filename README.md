

로컬 프론트 서버 https://localhost:3000
로컬 api 서버 https://localhost:8080
ec2 nginx http 80 요청 -> https 리디렉션
ec2 api 서버 http://ec2host:8080

dev
- 배포 API 서버에 연결
wss://localhost:3000/ws/ -> express 프록시 미들웨어 -> wss://ec2host/ws/ -> nginX 리버스 프록시 -> wss://ec2host/chat
- 로컬 API 서버 연결
ws://localhost:8080/chat 바로 연결

prod
- 배포 API 서버에 연결
wss://ec2host/ws/ -> express 프록시 미들웨어 -> wss://ec2host/ws/ -> nginX 리버스 프록시 -> wss://ec2host/chat

# EC2 용량 부족 뜰 때
불필요한 docker 파일 삭제
docker image prune -a
docker volumn prune
docker container prune

# 파일명 작성 규칙
👉 컴포넌트: PascalCase.jsx
👉 Hook / 유틸 / 함수 파일: camelCase.js