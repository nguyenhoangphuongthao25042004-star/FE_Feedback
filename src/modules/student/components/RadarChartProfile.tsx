import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts' //import các phần của biểu đồ radar 
import type { StudyProfileItem } from '../types/student.types' //import kiểu dữ liệu 

type Props = {
  data: StudyProfileItem[]
}

export default function RadarChartProfile({ data }: Props) { 
  return (
    <div
      role="region"
      aria-label="Biểu đồ hồ sơ học tập"
      style={{
        height: '100%',
        width: '100%',
        minHeight: 520,
        background: '#FFFFFF',
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        padding: 16,
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>Hồ sơ phong cách học tập</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Vùng xanh thể hiện mức độ nổi bật theo từng kỹ năng học tập
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data}>
          <PolarGrid stroke="#D7E1F0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#42546B', fontSize: 12 }}
          />
          <Tooltip />
          <Legend formatter={() => 'Mức độ học tập'} />
          <Radar
            dataKey="value"
            name="Mức độ học tập"
            stroke="#004286"
            fill="#004286"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
