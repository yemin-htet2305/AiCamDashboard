'use client'
import Button from '@/Components/Button';
import DatePicker from '@/Components/DatePicker';
import EntryPicker from '@/Components/EntryPicker';
import NavToHome from '@/Components/NavToHome'
import SortButtonGroup from '@/Components/SortButtonGroup';
import { useState, useEffect, use } from 'react'
import HistoryTable, { HistoryRow } from '@/Components/HistoryTable'
import { api } from '@/lib/api';



export default function Page() {
  const [loading, setLoading] = useState(false);
  const [date,setDate] = useState<string | undefined>(undefined)
  const [to,setTo] = useState<string | undefined>(undefined)
  const[from,setFrom] = useState<string | undefined>(undefined)
  const [minEntries, setMinEntries] = useState<number | undefined>(undefined);
  const [maxEntries, setMaxEntries] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  

  const seedData = [
    { id: '1', date: '2024-06-01', entries: 5, savedAt: '2024-06-01 12:00' },
    { id: '2', date: '2024-06-02', entries: 15, savedAt: '2024-06-02 12:00' },
    { id: '3', date: '2024-06-03', entries: 8, savedAt: '2024-06-03 12:00' },
    { id: '4', date: '2024-06-04', entries: 20, savedAt: '2024-06-04 12:00' },
    { id: '5', date: '2024-06-05', entries: 3, savedAt: '2024-06-05 12:00' },
  ]
  const [data, setData] = useState<HistoryRow[]>(seedData)

  useEffect(() => {
    setLoading(true);
    api.history({date, to, from, min_entries: minEntries, max_entries: maxEntries, sort: sortOrder})
    .then((res) => {
      setData(res.data);
    }).finally(() => setLoading(false))
  },[date, to, from, minEntries, maxEntries, sortOrder])
  

  return (
    <>
      <main className="flex-1 relative bg-black space-y-10">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:0px_0px]" />
        <NavToHome analytics="History" color="#7e57c21a" textColor="#7e57c2" />
        <div className="flex flex-col items-center justify-center h-full mt-2 gap-y-5">
          <h1 className="text-5xl font-bold text-gray-300">Entry <span className="text-[#7e57c2]">History</span></h1>
          <p className="text-gray-400 font-light">Browse, filter, and sort all daily log entries.</p>
        </div>
        <div className='bg-white/15 h-[500px] m-5 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          <DatePicker label='DATE' value={date} onChange={setDate} />
          <DatePicker label='TO' value={to} onChange={setTo} />
          <DatePicker label='FROM' value={from} onChange={setFrom} />
          <EntryPicker label="MIN ENTRIES" value={minEntries} onChange={setMinEntries} hint="Leave blank for no minimum" />
          <EntryPicker label="MAX ENTRIES" value={maxEntries} onChange={setMaxEntries} hint="Leave blank for no maximum" />
          <div className='flex items-start justify-center'>
            <SortButtonGroup label='SORT ORDER' value={sortOrder} onChange={setSortOrder} />
          </div>
        </div>
        <div className='Record Table m-5 mt-10'>
          <HistoryTable
              data={data}
              loading={loading}
              sort={sortOrder}
              onSortChange={setSortOrder}
            />

        </div>
      </main>
    </>
  )
}