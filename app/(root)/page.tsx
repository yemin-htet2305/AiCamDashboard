import NavBar from "@/Components/NavBar";
import CardLink from "@/Components/CardLink";
import { IoIosAnalytics } from "react-icons/io";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { BsFillClockFill } from "react-icons/bs";
import { GiDividedSquare } from "react-icons/gi";
import { BiTrendingUp } from "react-icons/bi";
import { MdBarChart } from "react-icons/md";

export default async function Home() {
  
 return (
    <main className="flex-1 relative bg-black">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
      {/* your content here */}
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
        <p className="text-[#ff4d1c] font-light">ENRTY INTELLIGENCE SYSTEM</p>
        <h1 className="text-5xl font-bold text-gray-300">Entry Data</h1>
        <p className="text-gray-400 font-light">Track, analyze, and act on every entry event — from daily patterns to long-term trends, all in one place.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 p-3">
            <CardLink icon={<HiMiniSquares2X2 size={40} color="#ff4d1c" /> } title="Summary" href="/summary" color="#ff4d1c">
            High-level overview of all lab entries.
          </CardLink>
          <CardLink icon={<BsFillClockFill size={40} color="#7e57c2" /> } title="History" href="/history" color="#7e57c2">
            Full log of past entry records.
          </CardLink>
          <CardLink icon={<GiDividedSquare size={40} color="#4bcc17" /> } title="Daily Average" href="/dailyAvg" color="#4bcc17">
            Mean daily entry of selected month.
          </CardLink>
          <CardLink icon={<BiTrendingUp size={40} color="#ffbf00" /> } title="Peak" href="/peak" color="#ffbf00">
            Busiest days of the selected period.
          </CardLink>
          <CardLink icon={<MdBarChart size={40} color="#6693f5" /> } title="Trend" href="/trend" color="#6693f5">
            Growth patterns and forecasts.
          </CardLink>
          <CardLink icon={<IoIosAnalytics size={40} color="#808080" /> } title="Analytics" href="/analytics" color="#808080">
            View detailed analytics and insights about your entry data.
          </CardLink>
      </div>
      
    </main>
  );
}
