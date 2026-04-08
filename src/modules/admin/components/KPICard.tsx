import { Card } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from '@ant-design/icons'

type KPICardProps = {
  title: string
  value: string | number
  trend: number
  trendLabel: string
}

function trendColor(trend: number) {
  if (trend > 0) return '#1DA57A'
  if (trend < 0) return '#D9534F'
  return '#6B7F97'
}

function TrendIcon({ trend }: { trend: number }) {
  if (trend > 0) return <ArrowUpOutlined />
  if (trend < 0) return <ArrowDownOutlined />
  return <MinusOutlined />
}

export default function KPICard({ title, value, trend, trendLabel }: KPICardProps) {
  const color = trendColor(trend)
  const trendText = `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`

  return (
    <Card
      style={{
        width: '100%',
        minHeight: 176,
        borderRadius: 20,
        border: '1px solid #D7E1F0',
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
      }}
      bodyStyle={{
        padding: 20,
        minHeight: 176,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div style={{ color: '#42546B', fontSize: 14, lineHeight: 1.4 }}>{title}</div>

      <div style={{ margin: '8px 0 10px', color: '#163253', fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>
        {value}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ color, fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <TrendIcon trend={trend} />
          {trendText}
        </span>
        <span style={{ color: '#6B7F97', fontSize: 12 }}>{trendLabel}</span>
      </div>
    </Card>
  )
}
