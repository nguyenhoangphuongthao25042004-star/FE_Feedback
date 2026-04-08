export type YeuToChatLuong = {
  ten: string
  diem: number
}

export type PhanPhoiDanhGia = {
  sao: string
  soLuong: number
}

export type DuLieuXuHuong = {
  hocKy: string
  qi: number
}

export type PhanHoiSinhVien = {
  id: string
  noiDung: string
}

export type KhuyenNghi = {
  id: string
  chiTiet: string
  mucDoNghiemTrong: 'Thấp' | 'Trung bình' | 'Cao'
  diemUuTien: number
}

export type ChiTietMonHoc = {
  id: string
  tenMonHoc: string
  maMonHoc: string
  diemQiTong: number
  soPhanHoi: number
  doTinCay: number
  doKhoDiem: number
  phanRaChatLuong: YeuToChatLuong[]
  phanPhoiDanhGia: PhanPhoiDanhGia[]
  phanHoiSinhVien: PhanHoiSinhVien[]
  xuHuongHocKy: DuLieuXuHuong[]
  khuyenNghi: KhuyenNghi[]
}

export type QITheoMonHoc = {
  tenMonHoc: string
  qi: number
}

export type MucDoAnhHuong = {
  yeuTo: string
  mucDo: number
}

export type ChiTietGiangVien = {
  id: string
  tenGiangVien: string
  diemQiTong: number
  soMon: number
  doTinCay: number
  qiTheoMonHoc: QITheoMonHoc[]
  xuHuongHocKy: DuLieuXuHuong[]
  phanPhoiDanhGia: PhanPhoiDanhGia[]
  phanHoiSinhVien: PhanHoiSinhVien[]
  mucDoAnhHuongYeuTo: MucDoAnhHuong[]
  goiYCaiThien: string[]
}
