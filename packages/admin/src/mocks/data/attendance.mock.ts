export type MockAttendanceStudent = {
  __typename: 'Student'
  name: string
}

export type MockAttendanceStudentPayment = {
  __typename: 'StudentPayment'
  lectureAssignment: string
}

export type MockAttendanceRow = {
  __typename: 'Attendance'
  id: number
  student: MockAttendanceStudent
  attendanceDate: string
  attendanceState: string
  studentId: number
  studentPaymentId: number
  studentPayment: MockAttendanceStudentPayment
}

const rawAttendance = [
  ['2026-03-16', 1, '김민지', 2001, '출석'],
  ['2026-03-16', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-16', 3, '박지훈', 2003, '결석'],

  ['2026-03-17', 1, '김민지', 2001, '출석'],
  ['2026-03-17', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-17', 3, '박지훈', 2003, '지각'],

  ['2026-03-18', 1, '김민지', 2001, '출석'],
  ['2026-03-18', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-18', 3, '박지훈', 2003, '출석'],

  ['2026-03-19', 1, '김민지', 2001, '지각'],
  ['2026-03-19', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-19', 3, '박지훈', 2003, '외출'],

  ['2026-03-20', 1, '김민지', 2001, '출석'],
  ['2026-03-20', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-20', 3, '박지훈', 2003, '조퇴'],

  ['2026-03-23', 1, '김민지', 2001, '출석'],
  ['2026-03-23', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-23', 3, '박지훈', 2003, '출석'],

  ['2026-03-24', 1, '김민지', 2001, '출석'],
  ['2026-03-24', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-24', 3, '박지훈', 2003, '결석'],

  ['2026-03-25', 1, '김민지', 2001, '출석'],
  ['2026-03-25', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-25', 3, '박지훈', 2003, '출석'],

  ['2026-03-26', 1, '김민지', 2001, '출석'],
  ['2026-03-26', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-26', 3, '박지훈', 2003, '지각'],

  ['2026-03-27', 1, '김민지', 2001, '출석'],
  ['2026-03-27', 2, '이서연', 2002, '중도탈락'],
  ['2026-03-27', 3, '박지훈', 2003, '출석'],
] as const

export const attendanceMockData: MockAttendanceRow[] = rawAttendance.map(
  (
    [attendanceDate, studentId, studentName, studentPaymentId, attendanceState],
    index,
  ) => ({
    __typename: 'Attendance',
    id: index + 1,
    student: {
      __typename: 'Student',
      name: studentName,
    },
    attendanceDate,
    attendanceState,
    studentId,
    studentPaymentId,
    studentPayment: {
      __typename: 'StudentPayment',
      lectureAssignment: '배정완료',
    },
  }),
)
export const ATTENDANCE_SEED = attendanceMockData
