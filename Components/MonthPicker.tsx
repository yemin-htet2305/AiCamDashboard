'use client'
import { useState, useRef, useEffect } from 'react'

type MonthPickerProps = {
  value: string | null
  onChange: (month: string | null) => void
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // generate last 24 months
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < 4; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    months.push(`${yyyy}-${mm}`)
  }

  // close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(75,204,23,0.1)',
          border: '0.5px solid rgba(75,204,23,0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          color: '#4bcc17',
          fontFamily: 'monospace',
          fontSize: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          letterSpacing: '0.08em',
        }}
      >
        {value ?? 'All Time'}
        <span style={{ fontSize: '30px', opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          background: '#0f0f0f',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '6px',
          zIndex: 50,
          minWidth: '180px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {/* All Time option */}
          <div
            onClick={() => { onChange(null); setOpen(false) }}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '15px',
              cursor: 'pointer',
              color: value === null ? '#4bcc17' : 'rgba(240,237,232,0.5)',
              background: value === null ? 'rgba(75,204,23,0.1)' : 'transparent',
              marginBottom: '2px',
            }}
          >
            All Time
          </div>

          {months.map(m => (
            <div
              key={m}
              onClick={() => { onChange(m); setOpen(false) }}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '15px',
                cursor: 'pointer',
                color: value === m ? '#4bcc17' : 'rgba(240,237,232,0.5)',
                background: value === m ? 'rgba(75,204,23,0.1)' : 'transparent',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}