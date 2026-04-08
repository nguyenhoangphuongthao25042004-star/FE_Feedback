import { Badge, Card, List, Tag } from 'antd'

import type { AlertItem, SeverityLevel } from './dashboard.types'

type AlertPanelProps = {
  alerts: AlertItem[]
  onSelectAlert?: (alert: AlertItem) => void
}

const severityConfig: Record<SeverityLevel, { color: string; label: string }> = {
  low: { color: 'green', label: 'THẤP' },
  medium: { color: 'gold', label: 'TRUNG BÌNH' },
  high: { color: 'red', label: 'CAO' }
}

export default function AlertPanel({ alerts, onSelectAlert }: AlertPanelProps) {
  return (
    <Card
      style={{
        width: '100%',
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(28,61,102,0.08)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18, fontWeight: 800 }}>Bảng cảnh báo</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Cảnh báo ưu tiên cho quyết định điều hành chất lượng giảng dạy.
        </div>
      </div>

      <List
        dataSource={alerts}
        renderItem={(alert) => {
          const severity = severityConfig[alert.severity]

          return (
            <List.Item
              style={{ paddingInline: 0, cursor: onSelectAlert ? 'pointer' : 'default' }}
              onClick={() => onSelectAlert?.(alert)}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge status={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success'} />
                    <span style={{ color: '#163253', fontWeight: 700 }}>{alert.title}</span>
                  </div>
                  <div style={{ color: '#6B7F97', fontSize: 13 }}>{alert.description}</div>
                </div>
                <Tag color={severity.color} style={{ alignSelf: 'flex-start', marginInlineEnd: 0 }}>
                  {severity.label}
                </Tag>
              </div>
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
