import { CalandarProvider } from "@/context/CalandarContext";
import MyCalendar from "@components/lol/calendar/MyCalendar";

export default function SectionCalendar() {
    return (
        <CalandarProvider>
            <MyCalendar />
        </CalandarProvider>
    );
}
