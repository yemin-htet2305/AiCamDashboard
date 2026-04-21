import Link from 'next/link'
import { FaArrowLeftLong } from "react-icons/fa6";

export default function NavToHome({analytics,color,textColor}: {analytics: string, color: string, textColor: string}) {
  return (
    <nav className='flex justify-between items-center px-10 py-6 bg-white/7 border border-white/10'>
            <Link href="/" className='w-[100px] h-[50px] 
            border border-white 
            flex items-center justify-center rounded-lg text-gray-300 font-bold text-md 
            hover:bg-white/10 transition-colors duration-200 space-x-2'>
                <FaArrowLeftLong /> <span>Home</span>
            </Link>
            <div 
           style={{ 'backgroundColor': color, 'color': textColor }}
            className='border p-3 rounded-full'>
                {analytics} Analytics
            </div>
    </nav>
  )
}
