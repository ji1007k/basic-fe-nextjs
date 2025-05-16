import "@/styles/css/chat.css";
import "@/styles/css/standings.css";

import { useAuth } from "@/context/AuthContext";
import SectionCalendar from "@/components/home/SectionCalendar";
import SectionStandings from "@components/home/SectionStandings";
import ChatButton from "@components/home/ChatButton";
import Chat from "@components/home/Chat";

export default function HomePage() {
    const { userId } = useAuth();

    return (
        <main className="home-container">
            <div className="section" id="section1">
                <SectionCalendar />
            </div>

            <div className="section" id="section2">
                <SectionStandings />
            </div>

            {userId ? <Chat /> : <ChatButton />}
        </main>
    );
}
