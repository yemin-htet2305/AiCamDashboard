import React from 'react'

export default function Card({type,days,pct,direction,avg}: 
    {type: 'period' | 'direction' | 'change'|'entry',
     days?: number,
     pct?: number,
    direction?: 'up' | 'down' | 'flat',
    avg?: number}) {

      const directionColor =
      direction === 'up'
        ? 'text-green-400'
        : direction === 'down'
        ? 'text-red-400'
        : 'text-blue-400';
  return (
    <div
    className="
        bg-white/9
        rounded-xl
        p-5
        cursor-pointer
        transition-all duration-200
        flex flex-col items-center justify-center
        space-y-3
      ">
        {type === 'period' && (
          <p className='text-sm font-lighter text-gray-500'>Period</p>
        )}
        {type === 'direction' && (
          <p className='text-sm font-lighter text-gray-500'>Direction</p>
        )}
        {type === 'change' && (
          <p className='text-sm font-lighter text-gray-500'>Change</p>
        )}
        {type === 'entry' && (
          <p className='text-sm font-lighter text-gray-500'>Entry</p>
        )}

        {type === 'period' && (
          <h1 className='text-3xl font-bold'>{days}D</h1>
        )}
        {type === 'direction' && (
          <h1 className={`text-3xl font-bold ${directionColor}`}>
            {direction}
          </h1>
        )}
        {type === 'change' && (
          <h1 className={`text-3xl font-bold ${directionColor}`}>
            {pct?.toFixed(2)}%
          </h1>
        )}
        {type === 'entry' && (
          <h1 className='text-3xl font-bold'>{avg?.toFixed(2)}</h1>
        )}

        {type === 'period' && (
          <p className='text-sm font-lighter text-gray-500'>Average over the last {days} days</p>
        )}
        {type === 'direction' && (
          <p className='text-sm font-lighter text-gray-500'>analyzing...</p>
        )}
        {type === 'change' && (
          <p className='text-sm font-lighter text-gray-500'>Change from last period</p>
        )}
        {type === 'entry' && (
          <p className='text-sm font-lighter text-gray-500'>Average entry value</p>
        )}

    </div>
  )
}
