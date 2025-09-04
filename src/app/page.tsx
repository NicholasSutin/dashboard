import Image from "next/image";
import dynamic from "next/dynamic";
import Typein from "../components/Typein";
import Clock from "../components/Clock";
import Topbar from "../components/Topbar";
import LastKey from "../components/LastKey";
import ScreenRes from "../components/ScreenRes"
import IpInfo from "../components/IpInfo";
import MarketList from "@/components/MarketList";
import Distance from "../components/strava/Distance"
import CalendarDashboard from "../components/CalendarDashboard";

export default function Home() {
  return (
    <div>
      
      <Topbar>
        <Clock />
        <h1 className="text-sm select-none font-geist-mono p-5.5 mx-auto">
          
          <MarketList />
        </h1>
        <LastKey />
      </Topbar>
      <div className="h-20" aria-hidden />


      <div className="flex w-full p-2 h-screen min-h-0">
        <div className="w-1/4 p-2 min-h-0">
          <CalendarDashboard />
        </div>
        <div className="w-1/2 p-2">Main Content</div>
        <div className="w-1/4 p-2">Right</div>
      </div>



   
      
    </div>
  );
}
