import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts' //import các thành phần cần cho biểu đồ cột
import type { DashboardScoreItem } from '../types/student.types' //import kiểu dữ liệu cho props

type Props = { //component này nhận một prop là data, có kiểu là mảng môn học
  data: DashboardScoreItem[]
}

export default function BarChartScore({ data }: Props) { 
  const shortSubjectNames: Record<string, string> = { //bảng mapping tên đầy đủ sang tên viết tắt
    'AI cơ bản và ứng dụng': 'AICBVUD',
    'Xây dựng phần mềm thiết bị di động': 'XDPMTBDĐ',
    'Xây dựng phần mềm web': 'XDPMW',
    'Thực tập tốt nghiệp': 'TTTN'
  }

  const getShortSubjectName = (subject: string) => shortSubjectNames[subject] ?? subject //hàm lấy tên viết tắt

  return ( //giao diện biểu đồ cột
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
          <XAxis // trục ngang 
            dataKey="subject"
            interval={0}
            height={56}
            tickFormatter={getShortSubjectName}
            tick={{ fill: '#42546B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} /> {/* trục dọc */}
          <Tooltip />
          <Legend formatter={() => 'Điểm trung bình'} />
          <Bar dataKey="score" name="Điểm trung bình" fill="#004286" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
