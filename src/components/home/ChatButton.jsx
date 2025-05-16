import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ChatButton() {
    const router = useRouter();
    const { devLogin } = useAuth();
    const lastTap = useRef(null);

    const handleChatBtnClick = () => {
        setTimeout(() => {
            router.push("/auth/login");
        }, 1000);
    };

    const handleChatBtnDoubleClick = () => {
        devLogin();
    };

    const handleTouchStart = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < 500) {
            handleChatBtnDoubleClick();
        }
        lastTap.current = now;
    };

    return (
        <button
            onClick={handleChatBtnClick}
            onDoubleClick={handleChatBtnDoubleClick}
            onTouchStart={handleTouchStart}
            className="chat-toggle-button"
            title="로그인 필요"
        >
            🔒
        </button>
    );
}
