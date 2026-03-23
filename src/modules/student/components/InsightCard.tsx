import { Card } from 'antd'
import type { RecommendationData } from '../types/student.types'

// Kiểu props cho card gợi ý học tập
type Props = {
  data: RecommendationData
}

// Card hiển thị các gợi ý ngắn từ dữ liệu mock
export default function InsightCard({ data }: Props) {
  const needImproveText = data.needImprove.join(', ') // ghép danh sách môn cần chú ý thành một chuỗi
  const instructorText = data.suitableInstructors.join(', ') // ghép danh sách giảng viên phù hợp thành một chuỗi

  return (
    <Card
      title="Gợi ý"
      style={{
        borderRadius: 20,
        border: '1px solid #D7E1F0',
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
      }}
      bodyStyle={{ color: '#42546B' }}
    >
      <p><strong>Môn phù hợp:</strong> {data.suitableSubjects || '-'}</p>
      <p><strong>Môn cần chú ý:</strong> {needImproveText || '-'}</p>
      <p><strong>Giảng viên phù hợp:</strong> {instructorText || '-'}</p>
    </Card>
  )
}
