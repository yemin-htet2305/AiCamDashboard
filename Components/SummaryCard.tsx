    type SummaryCardProps = {
  label: string
  value: string | number
  sub: string
  color: string
}

export default function SummaryCard({ label, value, sub, color }: SummaryCardProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: color,
      }} />
      <p style={{
        fontFamily: 'monospace',
        fontSize: '15px',
        color: 'rgba(240,237,232,0.3)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '30px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: '#f0ede8',
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '15px',
        color: 'rgba(240,237,232,0.25)',
        marginTop: '4px',
      }}>
        {sub}
      </p>
    </div>
  )
}