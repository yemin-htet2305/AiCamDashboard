import React from 'react'
import { IoMdAnalytics } from "react-icons/io";

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center px-10 py-6 bg-white/7 border border-white/10'>
        <div className='text-md text-gray-500 font-light flex items-center gap-2'><IoMdAnalytics color='#ff4d1c' size={50}/> ENTRY ANALYTICS</div>
    </nav>
  )
}
