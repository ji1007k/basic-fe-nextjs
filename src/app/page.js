// app/page.js
// import ButtonGroup from "./components/ButtonGroup";
import Chat from "@/components/Chat";
import "@/styles/css/chat.css";

export default function Home({ Component, pageProps }) {

    return (
        <main>
            <h1>Index Page</h1>
            <p>This is the index page.</p>
            {/*{<ButtonGroup />}*/}
            <Chat />
        </main>
    );
}

