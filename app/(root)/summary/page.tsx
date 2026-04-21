'use client'
import InsightCard from '@/Components/InsightCard';
import MonthlyChart from '@/Components/MonthlyChart';
import NavToHome from '@/Components/NavToHome'
import ProjectionCard from '@/Components/ProjectionCard';
import RangeBreakdown from '@/Components/RangeBreakdown';
import SummaryCard from '@/Components/SummaryCard';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react'

interface SummearyData{
  total_days: number;
  total_entries: number;
  avg_per_day: number;
  min_entries: number;
  max_entries: number;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<SummearyData | null>(null);

  useEffect(() => {
    // Simulate fetching data from an API
    setLoading(true);
    api.stats.summary()
    .then((res)=>{
      setSummaryData(res);
    }).finally(()=>{
      setLoading(false);
    })
  }, [])

  return (
    <>
      <main className="flex-1 relative bg-black space-y-5">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
        <NavToHome analytics="Summary" color="#ff4d1c1a" textColor="#ff4d1c" />
        <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
          <h1 className="text-5xl font-bold text-gray-300">Lab Entry <span className="text-[#ff4d1c]">Summary</span></h1>
          <p className="text-gray-400 font-light">High-level overview of all lab entries across all time.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-3">
            <SummaryCard label="Total Days"    value={summaryData?.total_days || 0}                color="#ff4d1c" sub="days recorded"    />
            <SummaryCard label="Total Entries" value={summaryData?.total_entries || 0} color="#818cf8" sub="all time"   />
            <SummaryCard label="Avg / Day"     value={summaryData?.avg_per_day || 0}               color="#22c55e" sub="daily average"   />
            <SummaryCard label="Min Day"       value={summaryData?.min_entries || 0}               color="#22d3ee" sub="lowest recorded" />
            <SummaryCard label="Max Day"       value={summaryData?.max_entries || 0}               color="#f59e0b" sub="highest recorded"/>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-3 mx-5'>
                      <div className='bg-white/10 rounded-3xl p-3'>
                      <h1 className='ml-10 mb-2'>Monthly Comparison</h1>
                      <RangeBreakdown
                          min={summaryData?.min_entries || 0}
                          avg={summaryData?.avg_per_day || 0}
                          max={summaryData?.max_entries || 0}
                        />
                      </div>
                      <InsightCard insights={[
                                  {
                                    color: '#22c55e',
                                    text: <>{summaryData?.total_entries || 0} entries across {summaryData?.total_days || 0} days of operation.</>
                                  },
                                  {
                                    color: '#818cf8',
                                    text: <>On average, {summaryData?.avg_per_day?.toFixed(2) || 0} people enter the lab each day.</>
                                  },
                                  {
                                    color: '#f59e0b',
                                    text: <>Peak day had {summaryData?.max_entries || 0} entries — {summaryData?.max_entries && summaryData?.avg_per_day ? (summaryData.max_entries / summaryData.avg_per_day).toFixed(1) : 0}× the daily average.</>
                                  },
                                  {
                                    color: '#22d3ee',
                                    text: <>Traffic spread is {summaryData?.max_entries && summaryData?.min_entries ? (summaryData.max_entries - summaryData.min_entries) : 0} entries between min and max days.</>
                                  },
                          ]} />
          </div>
        <ProjectionCard avgPerDay={summaryData?.avg_per_day || 0} />
        
      </main>
    </>
  )
}