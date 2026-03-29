export type InstructorFeedbackTopic = {
  key: string
  title: string
  count: number
  summary: string
  likert: Array<{
    label: 'Rất không hài lòng' | 'Chưa hài lòng' | 'Trung lập' | 'Hài lòng' | 'Rất hài lòng'
    value: number
  }>
  keywords: Array<{ word: string; weight: number }>
}

export type InstructorFeedbackItem = {
  id: string
  semester: string
  topic: string
  satisfaction: 'Rất không hài lòng' | 'Chưa hài lòng' | 'Trung lập' | 'Hài lòng' | 'Rất hài lòng'
  text: string
  isSafeToDisplay: boolean
}

export type InstructorTrendPoint = {
  semester: string
  teachingQualityIndex: number
  courseQualityIndex: number
  instructorQualityIndex: number
  responseCount: number
}

export type InstructorRecommendationItem = {
  id: string
  title: string
  priority: 'Rất cao' | 'Cao' | 'Trung bình'
  metric: string
  description: string
  expectedImpact: string
  suggestedActions: string[]
}

export type InstructorActionPriority = {
  key: string
  area: string
  issue: string
  priority: 'Rất cao' | 'Cao' | 'Trung bình'
  suggestedAction: string
  timeline: string
}

const feedbackTopicSeeds: Array<Omit<InstructorFeedbackTopic, 'count'>> = [
  {
    key: 'clarity',
    title: 'Độ rõ ràng',
    summary: 'Sinh viên đánh giá cao nội dung bài giảng, nhưng mong muốn ví dụ thực tế nhiều hơn ở các buổi cuối kỳ',
    likert: [
      { label: 'Rất không hài lòng', value: 1 },
      { label: 'Chưa hài lòng', value: 3 },
      { label: 'Trung lập', value: 6 },
      { label: 'Hài lòng', value: 10 },
      { label: 'Rất hài lòng', value: 8 }
    ],
    keywords: [
      { word: 'giảng rõ ràng', weight: 34 },
      { word: 'ví dụ thực tế', weight: 28 },
      { word: 'slide dễ theo dõi', weight: 24 },
      { word: 'nhịp độ nhanh', weight: 18 },
      { word: 'tóm tắt cuối buổi', weight: 17 },
      { word: 'trình bày mạch lạc', weight: 16 },
      { word: 'nội dung dễ hiểu', weight: 15 },
      { word: 'giải thích kỹ', weight: 14 },
      { word: 'ví dụ gần thực tế', weight: 13 },
      { word: 'cần chậm hơn', weight: 12 },
      { word: 'nhấn ý chính', weight: 11 },
      { word: 'minh họa cụ thể', weight: 10 },
      { word: 'dẫn dắt hợp lý', weight: 10 },
      { word: 'phân tích dễ hiểu', weight: 9 },
      { word: 'giải bài từng bước', weight: 9 },
      { word: 'liên hệ thực hành', weight: 8 },
      { word: 'trình tự hợp lý', weight: 8 },
      { word: 'nói dễ nghe', weight: 7 },
      { word: 'tốc độ ổn định', weight: 7 },
      { word: 'ví dụ ngắn gọn', weight: 6 }
    ]
  },
  {
    key: 'interaction',
    title: 'Tương tác lớp học',
    summary: 'Phản hồi cho thấy mức tương tác còn thấp ở các buổi có nội dung nặng về lý thuyết',
    likert: [
      { label: 'Rất không hài lòng', value: 2 },
      { label: 'Chưa hài lòng', value: 4 },
      { label: 'Trung lập', value: 5 },
      { label: 'Hài lòng', value: 5 },
      { label: 'Rất hài lòng', value: 3 }
    ],
    keywords: [
      { word: 'hỏi đáp', weight: 30 },
      { word: 'thảo luận nhóm', weight: 22 },
      { word: 'phản hồi nhanh', weight: 20 },
      { word: 'thiếu tương tác', weight: 18 },
      { word: 'khuyến khích phát biểu', weight: 16 },
      { word: 'đặt câu hỏi mở', weight: 15 },
      { word: 'không khí lớp học', weight: 14 },
      { word: 'trao đổi nhiều hơn', weight: 13 },
      { word: 'hoạt động ngắn', weight: 12 },
      { word: 'tham gia phát biểu', weight: 11 },
      { word: 'phản biện ý kiến', weight: 10 },
      { word: 'gọi tên sinh viên', weight: 10 },
      { word: 'khơi gợi trao đổi', weight: 9 },
      { word: 'trao đổi hai chiều', weight: 9 },
      { word: 'nhiều câu hỏi hơn', weight: 8 },
      { word: 'thảo luận cuối buổi', weight: 8 },
      { word: 'mini game', weight: 7 },
      { word: 'mời phát biểu', weight: 7 },
      { word: 'hoạt động cặp đôi', weight: 6 },
      { word: 'tương tác trực tiếp', weight: 6 }
    ]
  },
  {
    key: 'assessment',
    title: 'Tiêu chí đánh giá',
    summary: 'Một số sinh viên muốn tiêu chí chấm điểm bài tập và dự án được công bố rõ hơn từ đầu học kỳ',
    likert: [
      { label: 'Rất không hài lòng', value: 1 },
      { label: 'Chưa hài lòng', value: 2 },
      { label: 'Trung lập', value: 3 },
      { label: 'Hài lòng', value: 5 },
      { label: 'Rất hài lòng', value: 3 }
    ],
    keywords: [
      { word: 'deadline', weight: 22 },
      { word: 'chấm điểm rõ ràng', weight: 18 },
      { word: 'phản hồi bài tập', weight: 16 },
      { word: 'công bằng', weight: 14 },
      { word: 'rubric chi tiết', weight: 13 },
      { word: 'thang điểm rõ', weight: 12 },
      { word: 'công bố sớm', weight: 11 },
      { word: 'nhận xét cụ thể', weight: 10 },
      { word: 'tiêu chí minh bạch', weight: 9 },
      { word: 'hướng dẫn nộp bài', weight: 8 },
      { word: 'cách tính điểm', weight: 8 },
      { word: 'mốc đánh giá', weight: 7 },
      { word: 'thông báo sớm', weight: 7 },
      { word: 'tiêu chí dự án', weight: 6 },
      { word: 'minh bạch đầu kỳ', weight: 6 },
      { word: 'phản hồi theo rubric', weight: 6 },
      { word: 'điểm thành phần', weight: 5 },
      { word: 'quy định nộp muộn', weight: 5 },
      { word: 'hướng dẫn chấm', weight: 5 },
      { word: 'tiêu chí từng phần', weight: 5 }
    ]
  }
]

const semesterCycle: InstructorFeedbackItem['semester'][] = ['2025-2026-HK2', '2025-2026-HK1']
const satisfactionCycle: InstructorFeedbackItem['satisfaction'][] = ['Rất hài lòng', 'Hài lòng', 'Trung lập', 'Chưa hài lòng', 'Rất không hài lòng']

const clarityFeedbackTexts = [
  'Slide chi tiết, dễ theo dõi và giảng viên giải thích khá mạch lạc.',
  'Nên thêm ví dụ thực tế ở cuối buổi để sinh viên gắn nội dung với bài toán thật.',
  'Phần tóm tắt cuối buổi giúp em hệ thống lại ý chính khá tốt.',
  'Một vài buổi có nhịp độ hơi nhanh nên em cần thêm thời gian ghi chú.',
  'Cách trình bày bài giảng logic, các khái niệm nối với nhau dễ hiểu.',
  'Nếu thêm nhiều ví dụ gần thực tế hơn thì phần lý thuyết sẽ dễ nhớ hơn.',
  'Giảng viên nhấn ý chính rõ nên em biết phần nào cần tập trung ôn tập.',
  'Một số nội dung khó được giải thích kỹ, giúp em theo kịp bài tốt hơn.'
]

const interactionFeedbackTexts = [
  'Các buổi chữa bài có thảo luận nhóm giúp em hiểu phần thực hành tốt hơn.',
  'Ở một số buổi lý thuyết, lớp khá ít tương tác nên hơi khó giữ tập trung.',
  'Giảng viên phản hồi câu hỏi nhanh nên lớp học có cảm giác cởi mở hơn.',
  'Nếu có thêm câu hỏi mở giữa buổi thì sinh viên sẽ chủ động phát biểu hơn.',
  'Không khí lớp học tốt hơn ở những buổi có hoạt động nhóm ngắn.',
  'Phần hỏi đáp cuối buổi hữu ích nhưng đôi lúc thời gian còn hơi ít.',
  'Giảng viên khuyến khích trao đổi nên em thấy dễ đặt câu hỏi hơn.',
  'Các hoạt động cặp đôi ngắn giúp lớp sôi nổi hơn rõ rệt.'
]

const assessmentFeedbackTexts = [
  'Nếu rubric dự án được chia sẻ sớm hơn thì sinh viên sẽ chủ động hơn khi làm bài.',
  'Tiêu chí chấm điểm nhìn chung rõ, nhưng em muốn có thêm ví dụ minh họa cho từng mức.',
  'Phản hồi bài tập khá cụ thể nên em biết mình cần cải thiện ở đâu.',
  'Cần công bố cách tính điểm thành phần ngay từ đầu học kỳ để tránh bị động.',
  'Rubric chi tiết sẽ giúp nhóm em phân chia công việc tốt hơn.',
  'Các mốc đánh giá nên được nhắc lại trước mỗi lần nộp bài.',
  'Em mong phần nhận xét sau khi chấm bài được gửi sớm hơn.',
  'Quy định nộp muộn nên được ghi rõ hơn trong phần hướng dẫn.'
]

function buildFeedbackEntries(
  topic: InstructorFeedbackTopic['title'],
  total: number,
  texts: string[],
  hiddenIndexes: number[]
) {
  return Array.from({ length: total }, (_, index) => ({
    id: `fb-${String(index + 1).padStart(2, '0')}-${topic}`,
    semester: semesterCycle[index % semesterCycle.length],
    topic,
    satisfaction: satisfactionCycle[index % satisfactionCycle.length],
    text: texts[index % texts.length],
    isSafeToDisplay: !hiddenIndexes.includes(index)
  }))
}

const feedbackList: InstructorFeedbackItem[] = [
  ...buildFeedbackEntries('Độ rõ ràng', 28, clarityFeedbackTexts, [5, 17]),
  ...buildFeedbackEntries('Tương tác lớp học', 19, interactionFeedbackTexts, [3, 14]),
  ...buildFeedbackEntries('Tiêu chí đánh giá', 14, assessmentFeedbackTexts, [1, 11])
]

const feedbackTopics: InstructorFeedbackTopic[] = feedbackTopicSeeds.map((topic) => ({
  ...topic,
  count: feedbackList.filter((item) => item.topic === topic.title).length
}))

const trendPoints: InstructorTrendPoint[] = [
  { semester: '2025-2026-HK1', teachingQualityIndex: 4.2, courseQualityIndex: 4.1, instructorQualityIndex: 4.3, responseCount: 35 },
  { semester: '2025-2026-HK2', teachingQualityIndex: 4.46, courseQualityIndex: 4.3, instructorQualityIndex: 4.5, responseCount: 42 }
]

const recommendations: InstructorRecommendationItem[] = [
  {
    id: 'rec-01',
    title: 'Giảm tốc độ giảng ở các buổi lý thuyết nặng',
    priority: 'Rất cao',
    metric: 'Tương tác lớp học thấp hơn trung bình khoa 8%',
    description: 'Các phản hồi gần đây cho thấy sinh viên gặp khó khi theo dõi ở những buổi có nhiều khái niệm mới',
    expectedImpact: 'Tăng mức độ tập trung và cải thiện điểm clarity trong 1 học kỳ',
    suggestedActions: [
      'Chèn một đoạn tóm tắt ngắn sau mỗi 20–25 phút giảng',
      'Bổ sung 1 ví dụ thực tế sau mỗi khối lý thuyết lớn',
      'Dành 5 phút cuối buổi để kiểm tra nhanh mức độ hiểu bài'
    ]
  },
  {
    id: 'rec-02',
    title: 'Làm rõ tiêu chí chấm điểm ngay từ đầu học kỳ',
    priority: 'Cao',
    metric: 'Topic “Tiêu chí đánh giá” xuất hiện trong 14 phản hồi',
    description: 'Sinh viên muốn rubric bài tập và dự án được công bố sớm để có định hướng rõ ràng',
    expectedImpact: 'Giảm phản hồi tiêu cực về fairness và tăng sự chủ động khi làm bài',
    suggestedActions: [
      'Đăng rubric trong LMS trước hạn nộp ít nhất 1 tuần',
      'Đưa ví dụ bài đạt/không đạt để sinh viên hình dung',
      'Nhắc lại tiêu chí chính trước mỗi đợt đánh giá'
    ]
  },
  {
    id: 'rec-03',
    title: 'Tăng hoạt động hỏi đáp và thảo luận nhóm',
    priority: 'Trung bình',
    metric: 'Điểm interaction hiện thấp hơn clarity 12 điểm',
    description: 'Mức tương tác đang là điểm yếu tương đối so với các tiêu chí khác trong cùng môn học',
    expectedImpact: 'Cải thiện cảm nhận hỗ trợ và động lực học tập của sinh viên',
    suggestedActions: [
      'Thêm 1 câu hỏi tình huống ở giữa buổi học',
      'Cho sinh viên trao đổi cặp đôi 3 phút trước khi chữa bài',
      'Dùng poll nhanh để lấy phản hồi tức thời trong lớp'
    ]
  }
]

const actionPriorities: InstructorActionPriority[] = [
  {
    key: 'ap-01',
    area: 'Tốc độ giảng dạy',
    issue: 'Sinh viên phản ánh nhịp độ nhanh ở các buổi lý thuyết',
    priority: 'Rất cao',
    suggestedAction: 'Chèn checkpoint giữa buổi và thêm ví dụ minh họa ngắn',
    timeline: 'Áp dụng ngay trong 2 tuần tới'
  },
  {
    key: 'ap-02',
    area: 'Tiêu chí chấm điểm',
    issue: 'Rubric dự án chưa được nhắc lại thường xuyên',
    priority: 'Cao',
    suggestedAction: 'Đăng rubric cố định trong LMS và nhắc lại trước mỗi mốc nộp bài',
    timeline: 'Hoàn thành trước tuần 5'
  },
  {
    key: 'ap-03',
    area: 'Tương tác lớp học',
    issue: 'Số phản hồi về ít tương tác tăng trong học kỳ gần đây',
    priority: 'Trung bình',
    suggestedAction: 'Tăng thảo luận nhóm nhỏ và câu hỏi mở trong lớp',
    timeline: 'Theo dõi trong suốt học kỳ'
  }
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getInstructorFeedbackTopics() {
  await wait(150)
  return feedbackTopics
}

export async function getInstructorFeedbackList() {
  await wait(150)
  return feedbackList
}

export async function getInstructorTrends() {
  await wait(150)
  return trendPoints
}

export async function getInstructorRecommendations() {
  await wait(150)
  return {
    recommendations,
    actionPriorities
  }
}
