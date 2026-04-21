import { ReactNode } from 'react'

type InsightItem = {
  color: string
  text: ReactNode
}

export default function InsightCard({ insights }: { insights: InsightItem[] }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '1.25rem',
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '20px',
        color: 'rgba(240,237,232,0.3)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '1rem',
      }}>
        Insights
      </p>

      {insights.map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '8px 0',
          borderBottom: i < insights.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: item.color,
            flexShrink: 0,
            marginTop: '5px',
          }} />
          <p style={{
            fontFamily: 'monospace',
            fontSize: '15px',
            color: 'rgba(240,237,232,0.45)',
            lineHeight: 1.6,
          }}>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  )
}