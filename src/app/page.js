"use client"

// app/page.js
// import ButtonGroup from "./components/ButtonGroup";
import Chat from "@/components/Chat";
import "@/styles/css/chat.css";
import { useAuth } from "@/context/AuthContext.js";
import { useRouter } from "next/navigation";

export default function Home({ Component, pageProps }) {
    const { username } = useAuth();
    const router = useRouter();

    const handleChatBtnClick = () => {
        // React의 클라이언트 사이드 네비게이션을 사용해 페이지를 변경
        // 전체 페이지 새로고침 없이, SPA(Single Page Application) 방식으로 이동
        router.push("/auth/login");
    }

    return (
        <main>
            <h1>Index Page</h1>
            <p>This is the index page.</p>
            {/*{<ButtonGroup />}*/}
            {/* 로그인 여부에 따라 버튼을 감싸서 Chat 표시 */}
            {username ? (
                <Chat />
            ) : (
                <button onClick={ handleChatBtnClick }
                        className="chat-toggle-button"
                        title="로그인 필요"
                >
                    🔒
                </button>
            )}
        </main>
    );
}

