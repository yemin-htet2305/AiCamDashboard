'use client'

interface DatePickerProps {
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  label?: string;
  hint?: string;
  error?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
  hint,
  error,
  min,
  max,
  disabled = false,
  placeholder,
}: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[15px] font-medium tracking-widest text-gray-500 uppercase">
          {label}
        </label>
      )}

      <input
        type="date"
        value={value ?? ''}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
        className={[
          'bg-white rounded-lg px-3 py-2 text-sm font-mono text-black outline-none w-full transition-all duration-150',
          'border',
          error
            ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/15'
            : 'border-[#2a2a2a] focus:border-[#7e57c2] focus:ring-2 focus:ring-[#7e57c2]/15',
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      />

      {error && (
        <span className="text-[11px] text-red-500">{error}</span>
      )}

      {hint && !error && (
        <span className="text-[11px] text-gray-600">{hint}</span>
      )}
    </div>
  )
}