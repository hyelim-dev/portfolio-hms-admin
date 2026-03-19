export type MockEmploymentStatus = {
  __typename: 'EmploymentStatus'
  imploymentInsurance: string
  proofOfImployment: string
  completionType: string
  employmentType: string
}

export type MockLectureStudent = {
  __typename: 'Student'
  id: number
  name: string
  phone?: string
  phoneNum1?: string
}

export type MockStudentPayment = {
  __typename: 'StudentPayment'
  id: number
  lectureAssignment: string
  employment: string
  courseComplete: string
  subDiv: string
  studentId: number
  student: MockLectureStudent
  EmploymentStatus: MockEmploymentStatus[]
}

export type MockSubject = {
  __typename: 'Subject'
  id: number
  subjectName: string
  subjectCode: string
  subDiv: string
  round: number
  StudentPayment: MockStudentPayment[]
}

export type MockTeacher = {
  __typename: 'Member'
  id: number
  mUserId: string
  mUsername: string
}

export type MockLecture = {
  __typename: 'Lecture'
  id: number
  ApprovedNum: number
  campus: string
  confirmedNum: number
  createdAt: string
  eduStatusReport: boolean
  lectureDetails: string[]
  lecturePeriodEnd: string
  lecturePeriodStart: string
  lectureTime: string
  roomNum: string
  timetableAttached: string | null
  temporaryName: string
  subjectId: number
  subject: MockSubject
  subDiv: string
  sessionNum: number
  teachers: MockTeacher[]
}

const lectureDates = [
  '2026-03-16',
  '2026-03-17',
  '2026-03-18',
  '2026-03-19',
  '2026-03-20',
  '2026-03-23',
  '2026-03-24',
  '2026-03-25',
  '2026-03-26',
  '2026-03-27',
]

const studentPayments: MockStudentPayment[] = [
  {
    __typename: 'StudentPayment',
    id: 2001,
    lectureAssignment: '배정',
    employment: '취업',
    courseComplete: '수료',
    subDiv: '국가기간',
    studentId: 1,
    student: {
      __typename: 'Student',
      id: 1,
      name: '김민지',
      phone: '01011111111',
      phoneNum1: '01011111111',
    },
    EmploymentStatus: [
      {
        __typename: 'EmploymentStatus',
        imploymentInsurance: 'Y',
        proofOfImployment: 'Y',
        completionType: '조기취업',
        employmentType: '취업',
      },
    ],
  },
  {
    __typename: 'StudentPayment',
    id: 2002,
    lectureAssignment: '배정',
    employment: '미취업',
    courseComplete: '중도포기',
    subDiv: '국가기간',
    studentId: 2,
    student: {
      __typename: 'Student',
      id: 2,
      name: '이서연',
      phone: '01022222222',
      phoneNum1: '01022222222',
    },
    EmploymentStatus: [],
  },
  {
    __typename: 'StudentPayment',
    id: 2003,
    lectureAssignment: '배정',
    employment: '미취업',
    courseComplete: '미수료',
    subDiv: '국가기간',
    studentId: 3,
    student: {
      __typename: 'Student',
      id: 3,
      name: '박지훈',
      phone: '01033333333',
      phoneNum1: '01033333333',
    },
    EmploymentStatus: [],
  },
]

export const lectureMockData: MockLecture[] = [
  {
    __typename: 'Lecture',
    id: 101,
    ApprovedNum: 20,
    campus: '영등포',
    confirmedNum: 3,
    createdAt: '2026-03-01',
    eduStatusReport: false,
    lectureDetails: lectureDates,
    lecturePeriodStart: '2026-03-16',
    lecturePeriodEnd: '2026-03-27',
    lectureTime: '09:00~18:00',
    roomNum: '301호',
    timetableAttached: null,
    temporaryName: '프론트엔드 실무 3회차',
    subjectId: 501,
    subject: {
      __typename: 'Subject',
      id: 501,
      subjectName: '프론트엔드 실무',
      subjectCode: 'FE-301',
      subDiv: '국가기간',
      round: 3,
      StudentPayment: studentPayments,
    },
    subDiv: '국가기간',
    sessionNum: 3,
    teachers: [
      {
        __typename: 'Member',
        id: 9001,
        mUserId: 'teacher01',
        mUsername: '김강사',
      },
    ],
  },
]
