'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { month: 'Jan', avg: 68.2 },
  { month: 'Feb', avg: 74.5 },
  { month: 'Mar', avg: 82.1 },
  { month: 'Apr', avg: 91.3 },
  { month: 'May', avg: 78.4 },
]

export default function MonthlyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={32} layout='vertical'>
        <XAxis 
          type='number'
          tick={{ fill: 'rgba(240,237,232,0.4)', fontSize: 11, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
        type='category'
        dataKey='month'
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
            color: '#4bcc17',
          }}
        />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill="rgba(34,197,94,0.7)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}