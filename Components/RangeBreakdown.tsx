type RangeBreakdownProps = {
  min: number
  avg: number
  max: number
}

export default function RangeBreakdown({ min, avg, max }: RangeBreakdownProps) {
  const spread = max - min || 1
  const avgPct = Math.round(((avg - min) / spread) * 100)

  const rows = [
    { label: 'Min entries', value: min,  pct: 8,      color: '#22d3ee' },
    { label: 'Daily avg',   value: avg,  pct: avgPct, color: '#ff4d1c' },
    { label: 'Max entries', value: max,  pct: 100,    color: '#f59e0b' },
  ]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '1.25rem',
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '15px',
        color: 'rgba(240,237,232,0.3)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '1.1rem',
      }}>
        Entry range breakdown
      </p>

      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: 'rgba(240,237,232,0.4)',
            width: '90px',
          }}>
            {row.label}
          </span>

          <div style={{
            flex: 1,
            height: '8px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${row.pct}%`,
              height: '100%',
              background: row.color,
              borderRadius: '4px',
              transition: 'width 0.6s ease',
            }} />
          </div>

          <span style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#f0ede8',
            fontWeight: 500,
            width: '40px',
            textAlign: 'right',
          }}>
            {row.value}
          </span>
        </div>
      ))}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: '15px', color: 'rgba(240,237,232,0.25)' }}>
          Spread (max − min)
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#f0ede8', fontWeight: 500 }}>
          {spread} entries
        </span>
      </div>
    </div>
  )
}   