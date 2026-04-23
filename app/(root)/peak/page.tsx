'use client'
import Button from '@/Components/Button';
import NavToHome from '@/Components/NavToHome'
import { api } from '@/lib/api';
import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { BarChart, Bar, CartesianGrid, YAxis, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface PeakData {
  top_n: number;
  peak : { id: string; date: string; entries: number ,savedAt: string}[];
}

export default function Page() {
  const [num, setNum] = useState(15);
  const [peakData, setPeakData] = useState<PeakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setLoading(true);
      api.stats.peak(num)
        .then((res) => {
          setPeakData(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [num]); // ← runs on first load, and every time num changes

  const columns = [
    {name:'Id', selector: (row: { id: any; }) => row.id},
    { name: 'Date', selector: (row: { date: any; }) => row.date },
    { name: 'Visitors', selector: (row: { entries: any; }) => row.entries},
  ]

  return (
    <>
      <main className="flex-1 relative bg-black">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
        <NavToHome analytics="Peak" color="#ffbf001a" textColor="#ffbf00" />
        <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
          <h1 className="text-5xl font-bold text-gray-300">Lab Entry <span className="text-[#ffbf00]">Peak</span></h1>
          <p className="text-gray-400 font-light">Busiest days of the selected period.</p>
        </div>
        <div className='flex flex-row items-center justify-center space-x-3 my-3 p-3'>
                  {[5, 10, 15, 20, 25].map((d) => (
                    <Button
                      key={d}
                      onClick={() => setNum(d)}
                      style={num === d ? { backgroundColor: 'rgba(255, 191, 0, 0.3)' } : undefined}
                    >
                      Top{d}
                    </Button>
                  ))}
                </div>
        <div className='container w-full ml-15 m-5 p-3 rounded-2xl bg-white/10'>
          <p className='mb-2'>Top {num} Busiest Days In Tabular Format</p>
          <DataTable columns={columns} data={peakData?.peak || []} >
          </DataTable>
        </div>
        <div className='h-auto bg-white/10 m-5 rounded-2xl p-3'>
        <p className='mb-2'>Top {num} Busiest Days In Bar Chart</p>
        <ResponsiveContainer width="100%" height={500}>
              <BarChart data={peakData?.peak || []} barSize={32} layout='vertical'>
                <XAxis 
                  type='number'
                  tick={{ fill: 'rgba(240,237,232,0.4)', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                type='category'
                dataKey='date'
                  tick={{ fill: 'rgba(240,237,232,0.4)', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#ffbf00'
                  }}
                />
                {peakData?.peak && (
                  <Bar dataKey="entries" radius={[4, 4, 0, 0]}>
                    {peakData.peak.map((_, i) => (
                      <Cell key={i} fill="rgba(255, 191, 0, 0.7)" />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
        </div>
      
      </main>
    </>
  )
}