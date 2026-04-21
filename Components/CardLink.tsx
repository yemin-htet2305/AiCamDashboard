'use client'
import Link from "next/link";

export default function CardLink({ icon, title, children, href,color }: 
    { icon: string, title: string, children: React.ReactNode, href: string,color: string }) {
  return (
    <Link
      href={href}
      style={{'border': `1px solid ${color}`}}
      className="
        bg-white/9
        rounded-xl
        p-5
        cursor-pointer
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-lg
        w-[300px]
        flex flex-col items-start justify-center
        space-y-3
      "
    >
      {icon}
      <h1 className="text-xl font-bold text-gray-300">{title}</h1>
      <p className="text-gray-400 font-light text-sm">{children}</p>
    </Link>
  )
}