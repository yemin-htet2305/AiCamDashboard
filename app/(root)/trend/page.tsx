'use client'
import Button from '@/Components/Button'
import Card from '@/Components/Card';
import NavToHome from '@/Components/NavToHome'
import { api } from '@/lib/api';
import React, { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


interface TrendData {
  days: number;
  direction: string;
  change_pct: number;
  data: { date: string; entries: number }[];
}

export default function Page() {
  const [days, setDays] = useState(7);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.stats.trend(days)
      .then((res) => {
        setTrendData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [days]); // ← runs on first load, and every time days changes

  let avgEntries = trendData?.data ? trendData.data.reduce((sum, entry) => sum + entry.entries, 0) / (trendData.data.length || 1) : 0;
  return (
    <>
      <main className="flex-1 relative bg-black">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
        <NavToHome analytics="Trend" color="#22d3ee1a" textColor="#22d3ee" />
        <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
          <h1 className="text-5xl font-bold text-gray-300"><span className="text-cyan-400">Trend</span> Entry Data</h1>
          <p className="text-gray-400 font-light">Growth patterns, momentum, and forecasts for lab entry data.</p>
        </div>
        <div className='flex flex-row items-center justify-center space-x-3 my-3 p-3'>
          {[7, 14, 30, 60, 90].map((d) => (
            <Button
              key={d}
              onClick={() => setDays(d)}
              style={days === d ? { backgroundColor: 'rgba(34, 211, 238, 0.3)' } : undefined}
            >
              {d}D
            </Button>
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 space-x-3 my-3 p-3'>
          {loading ? (
            <p className="text-gray-400 font-light col-span-4 text-center">Loading...</p>
          ) : (
            <>
              <Card type='period' days={trendData?.days} direction={trendData?.direction} pct={trendData?.change_pct} avg={123.45} />
              <Card type='direction' direction={trendData?.direction} />
              <Card type='change' direction={trendData?.direction} pct={trendData?.change_pct} />
              <Card type='entry' avg={avgEntries} />
            </>
          )}
        </div>
        <div className='h-[500px] bg-white/10 m-5 rounded-2xl p-3'>
        <p>Entry Volume Over Time</p>
        <ResponsiveContainer width="100%" height="100%">
          {/* Placeholder for the chart */}
          <AreaChart width="80%" height="100%" data={trendData?.data} onContextMenu={(_, e) => e.preventDefault()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis color='#008b8b' dataKey="date" niceTicks="snap125" />
            <YAxis color='#008b8b' dataKey="entries" width="auto" niceTicks="snap125" />
            <Tooltip />
            <Area type="monotone" dataKey="entries" stroke="#008B8B" fill="#008B8B" />
          </AreaChart>
        </ResponsiveContainer>

        </div>
      </main>
    </>
  )
}