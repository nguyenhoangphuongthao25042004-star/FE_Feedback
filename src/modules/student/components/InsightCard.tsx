import { Card } from 'antd'
import type { RecommendationData } from '../types/student.types'

type Props = {
  data: RecommendationData
}

export default function InsightCard({ data }: Props) { 
  const needImproveText = data.needImprove.join(', ') //join(', ') ghép các phần tử thành 1 chuỗi, cách nhau bằng dấu phẩy
  const instructorText = data.suitableInstructors.join(', ')

  return (
    <Card
      title={'Gợi ý'}
      style={{
        borderRadius: 20,
        border: '1px solid #D7E1F0',
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
      }}
      bodyStyle={{ color: '#42546B' }}
    >
      <p><strong>Môn phù hợp:</strong> {data.suitableSubjects || '-'}</p> {/* || '-' nghĩa là nếu không có dữ liệu thì hiện dấu - */}
      <p><strong>Môn cần chú ý:</strong> {needImproveText || '-'}</p>
      <p><strong>Giảng viên phù hợp:</strong> {instructorText || '-'}</p>
    </Card>
  )
}
