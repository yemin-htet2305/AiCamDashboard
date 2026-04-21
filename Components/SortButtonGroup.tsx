'use client'

type SortOrder = 'asc' | 'desc'

interface SortButtonGroupProps {
  value: SortOrder;
  onChange: (val: SortOrder) => void;
  label?: string;
  disabled?: boolean;
}

export default function SortButtonGroup({
  value,
  onChange,
  label,
  disabled = false,
}: SortButtonGroupProps) {
  const options: { value: SortOrder; label: string; icon: string }[] = [
    { value: 'desc', label: 'Descending', icon: '▼' },
    { value: 'asc',  label: 'Ascending',  icon: '▲' },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium tracking-widest text-gray-500 uppercase">
          {label}
        </label>
      )}

      <div className="flex">
        {options.map((opt, i) => {
          const isActive = value === opt.value
          const isFirst = i === 0
          const isLast = i === options.length - 1

          return (
            <button
              key={opt.value}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all duration-150 border',
                isFirst ? 'rounded-l-lg' : '',
                isLast  ? 'rounded-r-lg' : '',
                !isFirst ? '-ml-px' : '',
                isActive
                  ? 'bg-[#7e57c2]/15 border-[#7e57c2]/60 text-[#7e57c2] z-10'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 hover:text-gray-300 hover:bg-white/5',
                disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="text-[10px]">{opt.icon}</span>
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}