// src/mocks/storage/attendanceStorage.ts

import { ATTENDANCE_SEED } from '@/src/mocks/data/attendance.mock'

export type AttendanceRow = {
  __typename?: 'Attendance'
  id: number
  student: {
    __typename?: 'Student'
    name: string
  }
  attendanceDate: string
  attendanceState: string
  studentId: number
  studentPaymentId: number
  studentPayment?: {
    __typename?: 'StudentPayment'
    lectureAssignment?: string
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __ATTENDANCE_MOCK_DB__: AttendanceRow[] | undefined
}

const cloneSeed = (): AttendanceRow[] =>
  ATTENDANCE_SEED.map(item => ({
    ...item,
    student: { ...item.student },
    studentPayment: item.studentPayment
      ? { ...item.studentPayment }
      : undefined,
  }))

function ensureAttendanceDb() {
  if (!globalThis.__ATTENDANCE_MOCK_DB__) {
    globalThis.__ATTENDANCE_MOCK_DB__ = cloneSeed()
  }
}

export function getAttendanceDb(): AttendanceRow[] {
  ensureAttendanceDb()
  return globalThis.__ATTENDANCE_MOCK_DB__ ?? []
}

export function setAttendanceDb(data: AttendanceRow[]) {
  globalThis.__ATTENDANCE_MOCK_DB__ = data
}

export function updateAttendanceDb(
  updater: (data: AttendanceRow[]) => AttendanceRow[],
) {
  ensureAttendanceDb()
  const current = globalThis.__ATTENDANCE_MOCK_DB__ ?? []
  const updated = updater(current)
  globalThis.__ATTENDANCE_MOCK_DB__ = updated
}

export function resetAttendanceDb() {
  globalThis.__ATTENDANCE_MOCK_DB__ = cloneSeed()
}
