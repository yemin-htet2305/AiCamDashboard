'use client'
import React from 'react'

export default function Button({children, ...props}: {children: React.ReactNode} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props}
    className='p-3
            border border-white 
            flex items-center justify-center rounded-lg text-gray-300 font-bold text-md 
            hover:bg-cyan-400/15 transition-colors duration-200 space-x-2'>
      {children}
    </button>
  )
}
