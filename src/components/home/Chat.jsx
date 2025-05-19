"use client"

import {useState, useEffect, useRef} from 'react';
import { useAuth } from "@/context/AuthContext.js";

const Chat = () => {
    const { userId } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false); // 채팅창 열림/닫힘 상태
    const messagesEndRef = useRef(null);  // 메시지 끝을 참조하는 ref
    const wsRef = useRef(null); // useRef: 값이 변경돼도 컴포넌트를 재렌더링x

    useEffect(() => {
        // WebSocket 연결 및 이벤트 설정 함수
        const connectWebSocket = () => {
            // 이미 연결되어 있으면 재연결하지 않음
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                return;
            }

            // WebSocket 연결
            const ws = new WebSocket(`/ws/`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket Connected');
            };

            // 서버에서 받은 메시지 처리
            ws.onmessage = (event) => {
                // console.log(event.data);
                const { userId, username, message, time } = JSON.parse(event.data);
                console.log("메시지 수신: ", userId, username, message, time);

                const data = { text: message, sender: userId, name: username, time: time };
                setMessages((prevMessages) => [...prevMessages, data]);
            };

            ws.onerror = (error) => console.error("❌ WebSocket 오류:", error);

            ws.onclose = () => {
                console.log('WebSocket Disconnected - 재연결 시도');
                setTimeout(connectWebSocket, 5000); // 5초 후 재연결
            };
        };

        connectWebSocket();

        // 클린업: 컴포넌트가 언마운트될 때 WebSocket 연결 종료
        return () => {
            wsRef.current?.close();
        };
    }, []);

    // ping 메시지 보내기 (연결 유지용. 30초 간격)
    useEffect(() => {
        const interval = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
    useEffect(() => {
        // 메시지가 변경될 때마다 실행
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // messages가 변경될 때마다 실행

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    const sendMessage = () => {
        // WebSocket이 OPEN 상태일 때만 메시지 전송
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && inputMessage) {
            if (inputMessage.trim() === "") return;

            // 새 메시지 추가 (내 메시지라고 가정)
            // setMessages([...messages, { text: inputMessage, sender: username }]);
            wsRef.current.send(JSON.stringify({ type: 'chat', message: inputMessage }));      // 서버로 메시지 전송
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
                                className={`message ${message.sender === userId ? "sent" : "received"}`}
                            >
                                <div>{message.text}</div>
                                <div className="time">{message.time || '오전 10:07'}</div>
                            </div>
                        ))}
                        {/* 메시지 목록 끝에 ref를 연결하여 스크롤을 맨 아래로 */}
                        <div ref={messagesEndRef} />
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
