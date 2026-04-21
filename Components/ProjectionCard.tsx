type ProjectionItem = {
  value: string | number
  label: string
  color: string
}

export default function ProjectionCard({ avgPerDay }: { avgPerDay: number }) {
  const items: ProjectionItem[] = [
    { value: avgPerDay,                          label: 'Per day',   color: '#22c55e' },
    { value: (avgPerDay * 7).toFixed(1),         label: 'Per week',  color: '#818cf8' },
    { value: Math.round(avgPerDay * 30).toLocaleString(), label: 'Per month', color: '#f59e0b' },
    { value: Math.round(avgPerDay * 365).toLocaleString(), label: 'Per year', color: '#ff4d1c' },
  ]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '1.25rem',
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '15px',
        color: 'rgba(240,237,232,0.3)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
      }}>
        Projections based on daily average ({avgPerDay})
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            textAlign: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '0.5px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: item.color,
              marginBottom: '4px',
            }}>
              {item.value}
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'rgba(240,237,232,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}