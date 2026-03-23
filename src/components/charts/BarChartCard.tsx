import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DashboardScoreItem } from '../../modules/student/types/student.types'

// Kiểu props cho biểu đồ cột dùng chung
type BarChartCardProps = {
  data: DashboardScoreItem[]
}

// Biểu đồ cột dùng chung để hiển thị điểm đánh giá theo môn học
export default function BarChartCard({ data }: BarChartCardProps) {
  const shortSubjectNames: Record<string, string> = {
    'AI cơ bản và ứng dụng': 'AICBVUD',
    'Xây dựng phần mềm thiết bị di động': 'XDPMTBDD',
    'Xây dựng phần mềm web': 'XDPMW',
    'Thực tập tốt nghiệp': 'TTTN'
  } // map tên môn dài sang tên ngắn để trục X gọn hơn

  const getShortSubjectName = (subject: string) => shortSubjectNames[subject] ?? subject // trả về tên viết tắt nếu có

  return (
    <div
      role="region"
      aria-label="Biểu đồ điểm theo môn học"
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
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>Điểm đánh giá các môn học</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Cột xanh thể hiện điểm trung bình của từng môn học
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 40 }}>
          <CartesianGrid stroke="#E8EEF8" vertical={false} />
          <XAxis
            dataKey="subject"
            interval={0}
            height={56}
            tickFormatter={getShortSubjectName}
            tick={{ fill: '#42546B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend formatter={() => 'Điểm trung bình'} />
          <Bar dataKey="score" name="Điểm trung bình" fill="#004286" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
