"use client"

// app/page.js
// import ButtonGroup from "./components/ButtonGroup";
import Chat from "@/components/Chat";
import "@/styles/css/chat.css";
import {useAuth} from "@/context/AuthContext.js";

export default function Home({ Component, pageProps }) {
    const { username } = useAuth();

    return (
        <main>
            <h1>Index Page</h1>
            <p>This is the index page.</p>
            {/*{<ButtonGroup />}*/}
            {username && <Chat />}
        </main>
    );
}

