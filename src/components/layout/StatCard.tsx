import { Card } from 'antd'

// Kiểu props cho card hiển thị chỉ số dùng chung
type StatCardProps = {
  title: string
  value: string | number
}

// Card chỉ số dùng chung cho KPI hoặc thống kê ngắn
export default function StatCard({ title, value }: StatCardProps) {
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
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div style={{ color: '#42546B', fontSize: 14, marginBottom: 10, lineHeight: 1.4 }}>
        {title}
      </div>
      <h2 style={{ margin: 0, color: '#163253', fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </h2>
    </Card>
  )
}
