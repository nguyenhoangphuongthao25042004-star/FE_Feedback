import type { ChiTietGiangVien, ChiTietMonHoc } from '../types/drilldown.types'

const duLieuMonHoc: Record<string, ChiTietMonHoc> = {
  web101: {
    id: 'web101',
    tenMonHoc: 'Lập trình Web',
    maMonHoc: 'WEB101',
    diemQiTong: 4.2,
    soPhanHoi: 219,
    doTinCay: 89,
    doKhoDiem: 7,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 4.4 },
      { ten: 'Tốc độ', diem: 3.8 },
      { ten: 'Công bằng', diem: 4.1 },
      { ten: 'Hỗ trợ', diem: 4.5 },
      { ten: 'Tương tác', diem: 4.3 },
      { ten: 'Động lực', diem: 4.0 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 6 },
      { sao: '2 sao', soLuong: 12 },
      { sao: '3 sao', soLuong: 32 },
      { sao: '4 sao', soLuong: 75 },
      { sao: '5 sao', soLuong: 94 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Bài giảng dễ theo dõi, ví dụ sát thực tế.' },
      { id: 'ph2', noiDung: 'Nên bổ sung thêm bài lab cho phần API.' },
      { id: 'ph3', noiDung: 'Giảng viên hỗ trợ nhanh qua diễn đàn lớp.' },
      { id: 'ph4', noiDung: 'Tốc độ đôi lúc hơi nhanh ở phần React nâng cao.' },
      { id: 'ph5', noiDung: 'Tiêu chí chấm điểm rõ ràng và công bằng.' },
      { id: 'ph6', noiDung: 'Mong có thêm tài liệu tổng hợp trước kỳ thi.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.8 },
      { hocKy: 'HK2 2024-2025', qi: 4.0 },
      { hocKy: 'HK1 2025-2026', qi: 4.1 },
      { hocKy: 'HK2 2025-2026', qi: 4.2 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Duy trì chất lượng giảng dạy hiện tại', mucDoNghiemTrong: 'Thấp', diemUuTien: 1 },
      { id: 'kn2', chiTiet: 'Tăng số lượng bài lab để rèn kỹ năng thực hành', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 }
    ]
  },
  ai201: {
    id: 'ai201',
    tenMonHoc: 'Nhập môn Trí tuệ nhân tạo',
    maMonHoc: 'AI201',
    diemQiTong: 2.8,
    soPhanHoi: 175,
    doTinCay: 75,
    doKhoDiem: 8,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 3.0 },
      { ten: 'Tốc độ', diem: 2.5 },
      { ten: 'Công bằng', diem: 2.8 },
      { ten: 'Hỗ trợ', diem: 2.7 },
      { ten: 'Tương tác', diem: 2.6 },
      { ten: 'Động lực', diem: 2.9 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 18 },
      { sao: '2 sao', soLuong: 32 },
      { sao: '3 sao', soLuong: 55 },
      { sao: '4 sao', soLuong: 42 },
      { sao: '5 sao', soLuong: 28 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Nội dung quá trừu tượng, khó hiểu.' },
      { id: 'ph2', noiDung: 'Cần thêm ví dụ thực tế và bài tập để rèn kỹ năng.' },
      { id: 'ph3', noiDung: 'Giảng viên giảng hơi nhanh, khó theo kịp.' },
      { id: 'ph4', noiDung: 'Mong có tài liệu bổ sung tiếng Việt chi tiết hơn.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.0 },
      { hocKy: 'HK2 2024-2025', qi: 2.9 },
      { hocKy: 'HK1 2025-2026', qi: 2.8 },
      { hocKy: 'HK2 2025-2026', qi: 2.8 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Cần rà soát nội dung giảng dạy - quá cao so với cơ sở trước', mucDoNghiemTrong: 'Cao', diemUuTien: 5 },
      { id: 'kn2', chiTiet: 'Giảm tốc độ giảng dạy, tăng ví dụ thực tế', mucDoNghiemTrong: 'Cao', diemUuTien: 4 },
      { id: 'kn3', chiTiet: 'Bổ sung bài lab thực hành với code sẵn', mucDoNghiemTrong: 'Trung bình', diemUuTien: 3 }
    ]
  },
  db301: {
    id: 'db301',
    tenMonHoc: 'Cơ sở dữ liệu',
    maMonHoc: 'DB301',
    diemQiTong: 4.0,
    soPhanHoi: 168,
    doTinCay: 86,
    doKhoDiem: 6,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 4.1 },
      { ten: 'Tốc độ', diem: 3.7 },
      { ten: 'Công bằng', diem: 4.0 },
      { ten: 'Hỗ trợ', diem: 4.1 },
      { ten: 'Tương tác', diem: 3.8 },
      { ten: 'Động lực', diem: 3.9 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 7 },
      { sao: '2 sao', soLuong: 14 },
      { sao: '3 sao', soLuong: 36 },
      { sao: '4 sao', soLuong: 59 },
      { sao: '5 sao', soLuong: 52 }
    ],
    phanHoiSinhVien: [
      { id: 'ph10', noiDung: 'Ví dụ thực hành giúp hiểu kiến thức tốt hơn.' },
      { id: 'ph11', noiDung: 'Nên tăng thêm thời lượng phần tối ưu truy vấn.' },
      { id: 'ph12', noiDung: 'Tài liệu rất đầy đủ và được cập nhật thường xuyên.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.6 },
      { hocKy: 'HK2 2024-2025', qi: 3.8 },
      { hocKy: 'HK1 2025-2026', qi: 3.9 },
      { hocKy: 'HK2 2025-2026', qi: 4.0 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Duy trì chất lượng giảng dạy', mucDoNghiemTrong: 'Thấp', diemUuTien: 1 },
      { id: 'kn2', chiTiet: 'Tăng thời lượng thực hành truy vấn phức tạp', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 }
    ]
  },
  net101: {
    id: 'net101',
    tenMonHoc: 'Mạng máy tính',
    maMonHoc: 'NET101',
    diemQiTong: 3.4,
    soPhanHoi: 140,
    doTinCay: 76,
    doKhoDiem: 7,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 3.5 },
      { ten: 'Tốc độ', diem: 3.2 },
      { ten: 'Công bằng', diem: 3.4 },
      { ten: 'Hỗ trợ', diem: 3.5 },
      { ten: 'Tương tác', diem: 3.3 },
      { ten: 'Động lực', diem: 3.2 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 12 },
      { sao: '2 sao', soLuong: 21 },
      { sao: '3 sao', soLuong: 43 },
      { sao: '4 sao', soLuong: 37 },
      { sao: '5 sao', soLuong: 27 }
    ],
    phanHoiSinhVien: [
      { id: 'ph13', noiDung: 'Bài tập lab khá sát với nội dung môn học.' },
      { id: 'ph14', noiDung: 'Cần chậm lại ở phần subnetting nâng cao.' },
      { id: 'ph15', noiDung: 'Mong có thêm mô phỏng thực tế các tình huống mạng.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.2 },
      { hocKy: 'HK2 2024-2025', qi: 3.3 },
      { hocKy: 'HK1 2025-2026', qi: 3.3 },
      { hocKy: 'HK2 2025-2026', qi: 3.4 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Giảm tốc độ giảng dạy ở các phần kỹ thuật cao', mucDoNghiemTrong: 'Trung bình', diemUuTien: 3 },
      { id: 'kn2', chiTiet: 'Bổ sung phần mô phỏng (Simulation) thực tế', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 },
      { id: 'kn3', chiTiet: 'Chuẩn bị tài liệu bổ sung tiếng Việt chi tiết', mucDoNghiemTrong: 'Thấp', diemUuTien: 1 }
    ]
  },
  ml101: {
    id: 'ml101',
    tenMonHoc: 'Nhập môn Học máy',
    maMonHoc: 'ML101',
    diemQiTong: 4.3,
    soPhanHoi: 184,
    doTinCay: 93,
    doKhoDiem: 8,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 4.3 },
      { ten: 'Tốc độ', diem: 4.0 },
      { ten: 'Công bằng', diem: 4.2 },
      { ten: 'Hỗ trợ', diem: 4.4 },
      { ten: 'Tương tác', diem: 4.2 },
      { ten: 'Động lực', diem: 4.5 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 4 },
      { sao: '2 sao', soLuong: 10 },
      { sao: '3 sao', soLuong: 29 },
      { sao: '4 sao', soLuong: 66 },
      { sao: '5 sao', soLuong: 75 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Ví dụ thực tế giúp dễ hiểu các thuật toán học máy.' },
      { id: 'ph2', noiDung: 'Nên tăng thêm buổi thực hành với dữ liệu thật.' },
      { id: 'ph3', noiDung: 'Giảng viên phản hồi câu hỏi rất nhanh.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.9 },
      { hocKy: 'HK2 2024-2025', qi: 4.1 },
      { hocKy: 'HK1 2025-2026', qi: 4.2 },
      { hocKy: 'HK2 2025-2026', qi: 4.3 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Duy trì chất lượng chuyên môn và mức hỗ trợ hiện tại', mucDoNghiemTrong: 'Thấp', diemUuTien: 1 },
      { id: 'kn2', chiTiet: 'Tăng thêm bài tập ứng dụng theo nhóm nhỏ', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 }
    ]
  },
  dsa201: {
    id: 'dsa201',
    tenMonHoc: 'Cấu trúc dữ liệu và Giải thuật',
    maMonHoc: 'DSA201',
    diemQiTong: 3.9,
    soPhanHoi: 142,
    doTinCay: 82,
    doKhoDiem: 8,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 3.9 },
      { ten: 'Tốc độ', diem: 3.5 },
      { ten: 'Công bằng', diem: 4.0 },
      { ten: 'Hỗ trợ', diem: 3.8 },
      { ten: 'Tương tác', diem: 3.7 },
      { ten: 'Động lực', diem: 3.9 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 9 },
      { sao: '2 sao', soLuong: 18 },
      { sao: '3 sao', soLuong: 41 },
      { sao: '4 sao', soLuong: 45 },
      { sao: '5 sao', soLuong: 29 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Môn học hay nhưng khá nặng, cần thêm thời gian luyện tập.' },
      { id: 'ph2', noiDung: 'Nên có thêm video giải chi tiết các bài khó.' },
      { id: 'ph3', noiDung: 'Tiêu chí chấm điểm rõ ràng và minh bạch.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 4.1 },
      { hocKy: 'HK2 2024-2025', qi: 4.0 },
      { hocKy: 'HK1 2025-2026', qi: 3.9 },
      { hocKy: 'HK2 2025-2026', qi: 3.9 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Rà soát mức độ khó của bài tập tuần 6-9', mucDoNghiemTrong: 'Trung bình', diemUuTien: 3 },
      { id: 'kn2', chiTiet: 'Tăng tài liệu minh họa trực quan cho phần quy hoạch động', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 }
    ]
  },
  bus102: {
    id: 'bus102',
    tenMonHoc: 'Giao tiếp trong kinh doanh',
    maMonHoc: 'BUS102',
    diemQiTong: 2.7,
    soPhanHoi: 118,
    doTinCay: 74,
    doKhoDiem: 5,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 2.8 },
      { ten: 'Tốc độ', diem: 2.9 },
      { ten: 'Công bằng', diem: 2.7 },
      { ten: 'Hỗ trợ', diem: 2.6 },
      { ten: 'Tương tác', diem: 2.5 },
      { ten: 'Động lực', diem: 2.7 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 14 },
      { sao: '2 sao', soLuong: 26 },
      { sao: '3 sao', soLuong: 34 },
      { sao: '4 sao', soLuong: 27 },
      { sao: '5 sao', soLuong: 17 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Cần nhiều hoạt động thực hành tình huống hơn.' },
      { id: 'ph2', noiDung: 'Mong giảng viên phản hồi bài tập nhanh hơn.' },
      { id: 'ph3', noiDung: 'Nội dung còn lặp lại giữa các buổi học.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.0 },
      { hocKy: 'HK2 2024-2025', qi: 2.9 },
      { hocKy: 'HK1 2025-2026', qi: 2.8 },
      { hocKy: 'HK2 2025-2026', qi: 2.7 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Rà soát lại cấu trúc nội dung để giảm trùng lặp', mucDoNghiemTrong: 'Cao', diemUuTien: 5 },
      { id: 'kn2', chiTiet: 'Tăng bài tập mô phỏng giao tiếp theo vai trò', mucDoNghiemTrong: 'Cao', diemUuTien: 4 },
      { id: 'kn3', chiTiet: 'Thiết lập lịch phản hồi cố định hàng tuần', mucDoNghiemTrong: 'Trung bình', diemUuTien: 3 }
    ]
  },
  mkt205: {
    id: 'mkt205',
    tenMonHoc: 'Marketing số',
    maMonHoc: 'MKT205',
    diemQiTong: 3.6,
    soPhanHoi: 105,
    doTinCay: 76,
    doKhoDiem: 6,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 3.7 },
      { ten: 'Tốc độ', diem: 3.5 },
      { ten: 'Công bằng', diem: 3.6 },
      { ten: 'Hỗ trợ', diem: 3.7 },
      { ten: 'Tương tác', diem: 3.5 },
      { ten: 'Động lực', diem: 3.8 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 8 },
      { sao: '2 sao', soLuong: 16 },
      { sao: '3 sao', soLuong: 30 },
      { sao: '4 sao', soLuong: 31 },
      { sao: '5 sao', soLuong: 20 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Nội dung thực tế, dễ áp dụng cho dự án cá nhân.' },
      { id: 'ph2', noiDung: 'Nên cập nhật thêm case study mới theo xu hướng mạng xã hội.' },
      { id: 'ph3', noiDung: 'Phần thực hành ads cần thêm thời gian.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.4 },
      { hocKy: 'HK2 2024-2025', qi: 3.5 },
      { hocKy: 'HK1 2025-2026', qi: 3.6 },
      { hocKy: 'HK2 2025-2026', qi: 3.6 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Bổ sung thêm dữ liệu case study ngành bán lẻ', mucDoNghiemTrong: 'Trung bình', diemUuTien: 2 },
      { id: 'kn2', chiTiet: 'Duy trì mô hình đánh giá theo dự án nhóm', mucDoNghiemTrong: 'Thấp', diemUuTien: 1 }
    ]
  },
  eco101: {
    id: 'eco101',
    tenMonHoc: 'Kinh tế vi mô',
    maMonHoc: 'ECO101',
    diemQiTong: 3.1,
    soPhanHoi: 96,
    doTinCay: 68,
    doKhoDiem: 7,
    phanRaChatLuong: [
      { ten: 'Rõ ràng', diem: 3.2 },
      { ten: 'Tốc độ', diem: 2.9 },
      { ten: 'Công bằng', diem: 3.1 },
      { ten: 'Hỗ trợ', diem: 3.0 },
      { ten: 'Tương tác', diem: 2.8 },
      { ten: 'Động lực', diem: 3.1 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 11 },
      { sao: '2 sao', soLuong: 19 },
      { sao: '3 sao', soLuong: 29 },
      { sao: '4 sao', soLuong: 23 },
      { sao: '5 sao', soLuong: 14 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Lý thuyết tương đối khó, cần thêm ví dụ gần gũi.' },
      { id: 'ph2', noiDung: 'Bài tập tự luận cần hướng dẫn cách trình bày rõ hơn.' },
      { id: 'ph3', noiDung: 'Mong có thêm mini quiz để tự kiểm tra kiến thức.' }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.4 },
      { hocKy: 'HK2 2024-2025', qi: 3.3 },
      { hocKy: 'HK1 2025-2026', qi: 3.2 },
      { hocKy: 'HK2 2025-2026', qi: 3.1 }
    ],
    khuyenNghi: [
      { id: 'kn1', chiTiet: 'Rà soát lại cách truyền đạt các khái niệm cốt lõi', mucDoNghiemTrong: 'Cao', diemUuTien: 4 },
      { id: 'kn2', chiTiet: 'Tăng hoạt động thảo luận nhóm theo tình huống', mucDoNghiemTrong: 'Trung bình', diemUuTien: 3 }
    ]
  }
}

const duLieuGiangVien: Record<string, ChiTietGiangVien> = {
  gv001: {
    id: 'gv001',
    tenGiangVien: 'Nguyễn Minh Anh',
    diemQiTong: 4.4,
    soMon: 3,
    doTinCay: 91,
    qiTheoMonHoc: [
      { tenMonHoc: 'Lập trình Web', qi: 4.5 },
      { tenMonHoc: 'Cơ sở dữ liệu', qi: 4.3 },
      { tenMonHoc: 'Kiến trúc phần mềm', qi: 4.4 }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 4.0 },
      { hocKy: 'HK2 2024-2025', qi: 4.1 },
      { hocKy: 'HK1 2025-2026', qi: 4.3 },
      { hocKy: 'HK2 2025-2026', qi: 4.4 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 3 },
      { sao: '2 sao', soLuong: 7 },
      { sao: '3 sao', soLuong: 28 },
      { sao: '4 sao', soLuong: 85 },
      { sao: '5 sao', soLuong: 102 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Thầy giảng rất tâm huyết và hỗ trợ sinh viên tốt.' },
      { id: 'ph2', noiDung: 'Tài liệu bài giảng rất đầy đủ và cập nhật.' },
      { id: 'ph3', noiDung: 'Ví dụ thực tế giúp em hiểu bài hơn rất nhiều.' },
      { id: 'ph4', noiDung: 'Mong thầy có thêm video hướng dẫn chi tiết.' }
    ],
    mucDoAnhHuongYeuTo: [
      { yeuTo: 'Rõ ràng', mucDo: 90 },
      { yeuTo: 'Công bằng', mucDo: 88 },
      { yeuTo: 'Hỗ trợ', mucDo: 90 },
      { yeuTo: 'Tương tác', mucDo: 86 },
      { yeuTo: 'Tốc độ', mucDo: 72 },
      { yeuTo: 'Động lực', mucDo: 80 }
    ],
    goiYCaiThien: [
      'Duy trì hoạt động phản hồi nhanh ở diễn đàn môn học.',
      'Giảm tốc độ ở các tuần có nội dung kỹ thuật cao để tăng mức tiếp thu.',
      'Tăng thêm bài tập ngắn cuối mỗi buổi để củng cố kiến thức trọng tâm.'
    ]
  },
  gv002: {
    id: 'gv002',
    tenGiangVien: 'Trần Thu Hà',
    diemQiTong: 4.0,
    soMon: 2,
    doTinCay: 86,
    qiTheoMonHoc: [
      { tenMonHoc: 'Kinh tế vi mô', qi: 3.9 },
      { tenMonHoc: 'Quản trị học', qi: 4.1 }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.7 },
      { hocKy: 'HK2 2024-2025', qi: 3.8 },
      { hocKy: 'HK1 2025-2026', qi: 3.9 },
      { hocKy: 'HK2 2025-2026', qi: 4.0 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 5 },
      { sao: '2 sao', soLuong: 12 },
      { sao: '3 sao', soLuong: 35 },
      { sao: '4 sao', soLuong: 68 },
      { sao: '5 sao', soLuong: 54 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Thầy/cô có chuyên môn sâu về môn học.' },
      { id: 'ph2', noiDung: 'Cần tăng tương tác hai chiều trong lớp.' },
      { id: 'ph3', noiDung: 'Bài tập đôi lúc quá khó so với lý thuyết.' }
    ],
    mucDoAnhHuongYeuTo: [
      { yeuTo: 'Rõ ràng', mucDo: 78 },
      { yeuTo: 'Công bằng', mucDo: 82 },
      { yeuTo: 'Hỗ trợ', mucDo: 81 },
      { yeuTo: 'Tương tác', mucDo: 75 },
      { yeuTo: 'Tốc độ', mucDo: 69 },
      { yeuTo: 'Động lực', mucDo: 73 }
    ],
    goiYCaiThien: [
      'Tăng tương tác hai chiều ở đầu và cuối buổi học.',
      'Bổ sung ví dụ tình huống thực tế để nâng mức gắn kết.',
      'Làm rõ hơn rubric chấm điểm cho bài tập nhóm.'
    ]
  },
  gv003: {
    id: 'gv003',
    tenGiangVien: 'Lê Hoàng Nam',
    diemQiTong: 3.7,
    soMon: 4,
    doTinCay: 81,
    qiTheoMonHoc: [
      { tenMonHoc: 'Cấu trúc dữ liệu', qi: 3.8 },
      { tenMonHoc: 'Giải thuật', qi: 3.7 },
      { tenMonHoc: 'Hệ điều hành', qi: 3.6 },
      { tenMonHoc: 'Mạng máy tính', qi: 3.7 }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.8 },
      { hocKy: 'HK2 2024-2025', qi: 3.8 },
      { hocKy: 'HK1 2025-2026', qi: 3.7 },
      { hocKy: 'HK2 2025-2026', qi: 3.7 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 8 },
      { sao: '2 sao', soLuong: 18 },
      { sao: '3 sao', soLuong: 42 },
      { sao: '4 sao', soLuong: 65 },
      { sao: '5 sao', soLuong: 47 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Nội dung trừu tượng, cần thêm ví dụ trực quan.' },
      { id: 'ph2', noiDung: 'Tốc độ giảng dạy hợp lý, theo kịp được.' },
      { id: 'ph3', noiDung: 'Mong có thêm bài tập thực hành để rèn kỹ năng.' }
    ],
    mucDoAnhHuongYeuTo: [
      { yeuTo: 'Rõ ràng', mucDo: 72 },
      { yeuTo: 'Công bằng', mucDo: 76 },
      { yeuTo: 'Hỗ trợ', mucDo: 75 },
      { yeuTo: 'Tương tác', mucDo: 70 },
      { yeuTo: 'Tốc độ', mucDo: 66 },
      { yeuTo: 'Động lực', mucDo: 68 }
    ],
    goiYCaiThien: [
      'Tăng ví dụ trực quan ở các phần kiến thức trừu tượng.',
      'Cân bằng lại nhịp độ giữa lý thuyết và bài tập thực hành.'
    ]
  },
  gv004: {
    id: 'gv004',
    tenGiangVien: 'Phạm Lan Anh',
    diemQiTong: 3.4,
    soMon: 2,
    doTinCay: 76,
    qiTheoMonHoc: [
      { tenMonHoc: 'Tiếng Anh học thuật', qi: 3.5 },
      { tenMonHoc: 'Kỹ năng thuyết trình', qi: 3.3 }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.6 },
      { hocKy: 'HK2 2024-2025', qi: 3.5 },
      { hocKy: 'HK1 2025-2026', qi: 3.4 },
      { hocKy: 'HK2 2025-2026', qi: 3.4 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 12 },
      { sao: '2 sao', soLuong: 24 },
      { sao: '3 sao', soLuong: 48 },
      { sao: '4 sao', soLuong: 45 },
      { sao: '5 sao', soLuong: 29 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Cần cải thiện kỹ năng giao tiếp và hỗ trợ sinh viên.' },
      { id: 'ph2', noiDung: 'Bài giảng đôi khi không rõ ràng, cần ví dụ cụ thể.' },
      { id: 'ph3', noiDung: 'Mong thầy/cô tạo môi trường tương tác hơn.' }
    ],
    mucDoAnhHuongYeuTo: [
      { yeuTo: 'Rõ ràng', mucDo: 69 },
      { yeuTo: 'Công bằng', mucDo: 68 },
      { yeuTo: 'Hỗ trợ', mucDo: 71 },
      { yeuTo: 'Tương tác', mucDo: 67 },
      { yeuTo: 'Tốc độ', mucDo: 64 },
      { yeuTo: 'Động lực', mucDo: 65 }
    ],
    goiYCaiThien: [
      'Tăng hoạt động thảo luận theo nhóm nhỏ trong giờ học.',
      'Bổ sung tiêu chí đánh giá rõ ràng trước mỗi bài tập.',
      'Phát triển kỹ năng hỗ trợ sinh viên ngoài giờ lên lớp.'
    ]
  },
  gv005: {
    id: 'gv005',
    tenGiangVien: 'Võ Đức Thành',
    diemQiTong: 4.0,
    soMon: 3,
    doTinCay: 87,
    qiTheoMonHoc: [
      { tenMonHoc: 'Lập trình Python', qi: 4.1 },
      { tenMonHoc: 'Phân tích dữ liệu', qi: 3.9 },
      { tenMonHoc: 'Thống kê ứng dụng', qi: 4.0 }
    ],
    xuHuongHocKy: [
      { hocKy: 'HK1 2024-2025', qi: 3.7 },
      { hocKy: 'HK2 2024-2025', qi: 3.8 },
      { hocKy: 'HK1 2025-2026', qi: 3.9 },
      { hocKy: 'HK2 2025-2026', qi: 4.0 }
    ],
    phanPhoiDanhGia: [
      { sao: '1 sao', soLuong: 6 },
      { sao: '2 sao', soLuong: 13 },
      { sao: '3 sao', soLuong: 27 },
      { sao: '4 sao', soLuong: 33 },
      { sao: '5 sao', soLuong: 18 }
    ],
    phanHoiSinhVien: [
      { id: 'ph1', noiDung: 'Thầy giảng rõ ràng, ví dụ thực tế dễ hiểu.' },
      { id: 'ph2', noiDung: 'Nên tăng thêm bài thực hành theo nhóm.' },
      { id: 'ph3', noiDung: 'Phần phản hồi bài tập chi tiết và hữu ích.' }
    ],
    mucDoAnhHuongYeuTo: [
      { yeuTo: 'Rõ ràng', mucDo: 82 },
      { yeuTo: 'Công bằng', mucDo: 84 },
      { yeuTo: 'Hỗ trợ', mucDo: 83 },
      { yeuTo: 'Tương tác', mucDo: 80 },
      { yeuTo: 'Tốc độ', mucDo: 74 },
      { yeuTo: 'Động lực', mucDo: 81 }
    ],
    goiYCaiThien: [
      'Duy trì chất lượng phản hồi bài tập cho sinh viên.',
      'Tăng thêm hoạt động tương tác ngắn đầu giờ để khởi động lớp.',
      'Bổ sung bài tập tình huống theo dữ liệu thực tế doanh nghiệp.'
    ]
  }
}

function giaLapDoTre<T>(duLieu: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(duLieu), 500)
  })
}

export async function getCourseDetail(id: string): Promise<ChiTietMonHoc | null> {
  return giaLapDoTre(duLieuMonHoc[id] ?? null)
}

export async function getInstructorDetail(id: string): Promise<ChiTietGiangVien | null> {
  return giaLapDoTre(duLieuGiangVien[id] ?? null)
}
