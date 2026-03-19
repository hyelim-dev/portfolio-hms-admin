export type MockSubject = {
  id: number
  subjectName: string
  subjectCode: string
  subDiv: string
  teacherName: string
  fee: number
  round: number
  roomNum: string
  startDate: string
  endDate: string
  totalTime: number
  exposure: boolean
  createdAt: string
  updatedAt: string
  lastModifiedTime: string | null
  branchId: string
  expiresDateStart: string | null
  expiresDateEnd: string | null
}

const now = new Date().toISOString()

export const SUBJECT_MOCK_DB: MockSubject[] = [
  {
    id: 1,
    subjectName: '프론트엔드 과정',
    subjectCode: 'FE-001',
    subDiv: '국비과정',
    teacherName: '김강사',
    fee: 1200000,
    round: 1,
    roomNum: '301',
    startDate: '2026-03-11',
    endDate: '2026-06-30',
    totalTime: 480,
    exposure: true,
    createdAt: now,
    updatedAt: now,
    lastModifiedTime: null,
    branchId: '1',
    expiresDateStart: null,
    expiresDateEnd: null,
  },
  {
    id: 2,
    subjectName: '백엔드 과정',
    subjectCode: 'BE-001',
    subDiv: '국비과정',
    teacherName: '이강사',
    fee: 1300000,
    round: 2,
    roomNum: '302',
    startDate: '2026-03-15',
    endDate: '2026-07-10',
    totalTime: 520,
    exposure: true,
    createdAt: now,
    updatedAt: now,
    lastModifiedTime: null,
    branchId: '1',
    expiresDateStart: null,
    expiresDateEnd: null,
  },
  {
    id: 3,
    subjectName: 'UIUX 디자인 과정',
    subjectCode: 'UX-001',
    subDiv: '일반과정',
    teacherName: '박강사',
    fee: 1000000,
    round: 1,
    roomNum: '205',
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    totalTime: 360,
    exposure: true,
    createdAt: now,
    updatedAt: now,
    lastModifiedTime: null,
    branchId: '1',
    expiresDateStart: null,
    expiresDateEnd: null,
  },
]
