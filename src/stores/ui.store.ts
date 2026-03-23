import { create } from 'zustand'

// Kiểu dữ liệu cho store dùng chung của giao diện
type UiFilterState = {
  selectedSemester: string
  searchKeyword: string
  setSelectedSemester: (semester: string) => void
  setSearchKeyword: (keyword: string) => void
  resetFilters: () => void
}

const defaultSemester = '2025-2026-HK2' // học kỳ mặc định khi mới vào hệ thống

// Store này giữ bộ lọc giao diện dùng chung giữa topbar và các trang
export const useUiStore = create<UiFilterState>((set) => ({
  selectedSemester: defaultSemester,
  searchKeyword: '',
  setSelectedSemester: (selectedSemester) => set({ selectedSemester }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  resetFilters: () => set({ selectedSemester: defaultSemester, searchKeyword: '' })
}))
