'use client'
import InsightCard from '@/Components/InsightCard';
import MonthlyChart from '@/Components/MonthlyChart';
import MonthPicker from '@/Components/MonthPicker';
import NavToHome from '@/Components/NavToHome'
import { api } from '@/lib/api';
import { useState, useEffect } from 'react'

interface DailyAverageData {
  month: string;
  daily_avg: number;
}
export default function Page() {
  const [month,setMonth] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const[data, setData] = useState<DailyAverageData | null>(null);

  useEffect(() => {
    setLoading(true);
    api.stats.dailyAvg(month? month : undefined)
    .then((res)=> {
      setData(res);
    }).finally(() => setLoading(false));
  }, [month])

  console.log(data);

  return (
    <>
      <main className="flex-1 relative bg-black">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
        <NavToHome analytics="Daily Average" color="#4bcc171a" textColor="#4bcc17" />
        <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
          <h1 className="text-5xl font-bold text-gray-300">Daily <span className="text-[#4bcc17]">Average</span></h1>
          <p className="text-gray-400 font-light">Mean daily entries per selected month.</p>
        </div>
        
        <div className='flex items-center justify-center mt-5 gap-x-3'>
          <MonthPicker value={month} onChange={setMonth} /> 
        </div>
        <div className='w-[full] h-auto m-5 p-10 bg-green-600/20 rounded-lg flex items-center justify-around'>
          <div className='flex flex-col items-center justify-center space-y-2'>
            <p className='font-light text-green-600 text-md'>DAILY AVERAGE</p>
            <h1 className='ml-2'><span className='text-5xl font-bold text-green-600'>{data?.daily_avg? data?.daily_avg.toFixed(1) : '0.0'}</span> /day</h1>
            <p className='text-gray-600 text-md'>All-time average</p>
          </div>
          <div className='flex flex-col items-center justify-center space-y-2'>
             <div className='flex flex-col items-end justify-center space-y-2'>
                <p className='font-light text-gray-600 text-sm'>PER HOUR (EST.)</p>
                <h1 className='ml-2 font-bold text-2xl'>{data?.daily_avg ? (data?.daily_avg ? data.daily_avg / 12 : 0).toFixed(1) : '0.0'}</h1>
             </div>
             <div className='flex flex-col items-end justify-center space-y-2'>
                <p className='font-light text-gray-600 text-sm'>PER WEEK (EST.)</p>
                <h1 className='ml-2 font-bold text-2xl'>{data?.daily_avg ? (data?.daily_avg ? data.daily_avg * 7 : 0).toFixed(1) : '0.0'}</h1>
             </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-3'>
              <div className='bg-white/10 rounded-3xl p-3'>
              <h1 className='ml-10'>Monthly Comparison</h1>
              <MonthlyChart /></div>
              <InsightCard insights={[
                          {
                            color: '#22c55e',
                            text: <>Current daily average is <strong style={{ color: '#f0ede8' }}>{data?.daily_avg? data?.daily_avg.toFixed(1) : '0.0'}</strong> entries/day.</>
                          },
                          {
                            color: '#818cf8',
                            text: <>Estimated <strong style={{ color: '#f0ede8' }}>{data?.daily_avg ? (data.daily_avg * 7).toFixed(1) : '0.0'}</strong> entries per week.</>
                          },
                          {
                            color: '#f59e0b',
                            text: <>Roughly <strong style={{ color: '#f0ede8' }}>{data?.daily_avg ? (data.daily_avg / 12).toFixed(1) : '0.0'}</strong> entries/hour during a 12-hour lab day.</>
                          },
                          {
                            color: '#22d3ee',
                            text: <>Use filters above to compare across months.</>
                          },
                  ]} />
        </div>
      </main>
    </>
  )
}