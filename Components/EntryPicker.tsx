'use client'

interface EntryPickerProps {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  label?: string;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
}

export default function EntryPicker({
  value,
  onChange,
  label,
  hint,
  error,
  min,
  max,
  disabled = false,
  placeholder = 'e.g. 10',
}: EntryPickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === '') {
      onChange(undefined);
      return;
    }

    const parsed = parseInt(raw, 10);

    if (isNaN(parsed) || parsed <= 0) {
      onChange(undefined);
      return;
    }

    onChange(parsed);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[15px] font-medium tracking-widest text-gray-500 uppercase">
          {label}
        </label>
      )}

      <input
        type="number"
        value={value ?? ''}
        min={min ?? 1}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        className={[
          'bg-[#1a1a1a] rounded-lg px-3 py-2 text-sm font-mono text-gray-300 outline-none w-full transition-all duration-150',
          'border',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error
            ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/15'
            : 'border-[#2a2a2a] focus:border-[#7e57c2] focus:ring-2 focus:ring-[#7e57c2]/15',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
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