"use client"

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext.js";

const Chat = () => {
    const { username } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false); // 채팅창 열림/닫힘 상태

    useEffect(() => {
        const isDev = process.env.NEXT_PUBLIC_NODE_ENV != 'production';

        // WebSocket 연결
        let ws = null;
        if (isDev) {
            // 이거 쓰려면 세션쿠키의 sameSite 속성 None 설정 필요함
            ws = new WebSocket(`ws://localhost:8080/chat`);
        } else {
            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const host = process.env.NEXT_PUBLIC_API_SERVER_HOST;
            ws = new WebSocket(`${protocol}://${host}/ws/`);
        }

        setSocketEvent(ws);

        // 클린업: 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            ws.close();
        };
    }, []); // 의존성 배열이 빈 배열 -> 처음 한번만 실행

    useEffect(() => {
        console.log("socket state changed", socket);
    }, [socket]);


    const setSocketEvent = (ws) => {
        ws.onopen = () => {
            console.log('WebSocket Connected');
            // TODO
            //  연결 성공 후에만 메시지를 보내도록 활성화
        };

        // 서버에서 받은 메시지 처리
        ws.onmessage = (event) => {
            console.log(event.data);
            const response = JSON.parse(event.data);
            const userId = response.userId;
            const message = response.message;
            console.log("메시지 수신: ", userId, message);

            const data = { text: message, sender: userId };
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        ws.onerror = (error) => console.error("❌ WebSocket 오류:", error);

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        setSocket(ws);
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    const sendMessage = () => {
        // WebSocket이 OPEN 상태일 때만 메시지 전송
        if (socket && socket.readyState === WebSocket.OPEN && inputMessage) {
            if (inputMessage.trim() === "") return;

            // 새 메시지 추가 (내 메시지라고 가정)
            setMessages([...messages, { text: inputMessage, sender: username }]);
            socket.send(inputMessage);      // 서버로 메시지 전송
            setInputMessage('');         // 입력 필드 초기화
        } else {
            console.log("WebSocket is not open yet.");
        }
    };

    return (
        <>
            {/* 채팅 버튼 */}
            <button className="chat-toggle-button" onClick={() => setIsChatOpen(!isChatOpen)}>
                {isChatOpen ? "✖" : "💬"}
            </button>

            {/* 채팅 창 */}
            {isChatOpen && (
                <div className="chat-container">
                    <h2>Chat</h2>
                    <div className="chat-box">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === username ? "sent" : "received"}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleEnterPress}
                            placeholder="Type a message"
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
