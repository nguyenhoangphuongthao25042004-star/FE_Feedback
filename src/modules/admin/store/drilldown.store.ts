import { create } from 'zustand'

type DrilldownState = {
  selectedCourse: string | null
  selectedInstructor: string | null
  setSelectedCourse: (courseId: string | null) => void
  setSelectedInstructor: (instructorId: string | null) => void
}

export const useDrilldownStore = create<DrilldownState>((set) => ({
  selectedCourse: null,
  selectedInstructor: null,
  setSelectedCourse: (selectedCourse) => set({ selectedCourse }),
  setSelectedInstructor: (selectedInstructor) => set({ selectedInstructor })
}))
