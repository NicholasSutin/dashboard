import Image from "next/image";
import dynamic from "next/dynamic";
import Typein from "../components/Typein";
import Clock from "../components/Clock";
import Topbar from "../components/Topbar";
import LastKey from "../components/LastKey";
import ScreenRes from "../components/ScreenRes"
import CalendarDashboard from "../components/CalendarDashboard";

export default function Home() {
  return (
    <div className="h-full min-h-0">

      <div className="flex w-full p-2 h-full min-h-0">
        <div className="w-1/4 p-2 min-h-0 h-full flex flex-col overflow-hidden">
          <CalendarDashboard />
        </div>
        <div className="w-1/2 p-2">Main Content</div>
        <div className="w-1/4 p-2">Right</div>
      </div>



   
      
    </div>
  );
}
