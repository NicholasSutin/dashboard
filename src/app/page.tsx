import Image from "next/image";
import dynamic from "next/dynamic";
import Typein from "../components/Typein";
import Clock from "../components/Clock";
import Topbar from "../components/Topbar";
import LastKey from "../components/LastKey";
import ScreenRes from "../components/ScreenRes"
import IpInfo from "../components/IpInfo";
import MarketList from "@/components/MarketList";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen min-w-screen entry select-none fixed z-50">
        <Typein className="text-8xl text-center" />
      </div>
      <Topbar>
        <Clock />
        <h1 className="text-sm select-none font-geist-mono p-5.5 mx-auto">
          <ScreenRes /> |&nbsp;
          <IpInfo /> |&nbsp;
          <MarketList />
        </h1>
        <LastKey />
      </Topbar>
      <div className="h-20" aria-hidden />
      <h1>Content will start at this height because of a spacer above</h1>
      
    </div>
  );
}
