export type MockCertificate = {
  __typename: 'Certificate'
  id: number
  lectureId: number
  studentId: number
  stName: string
  CAdate?: string | null
  certificateName?: string | null
  certificateLevel?: string | null
  CertificateIssuer?: string | null
  subjectId: number
  studentPaymentId: number
  createdAt: string
  updatedAt: string
  branchId?: number | null
  lastModifiedByUserId: string
  lastModifiedByName: string
  lastModifiedTime?: string | null
}

const now = Date.now()

export const certificateMockData: MockCertificate[] = [
  {
    __typename: 'Certificate',
    id: 1,
    lectureId: 101,
    studentId: 1,
    stName: '김민지',
    CAdate: String(now - 1000 * 60 * 60 * 24 * 14),
    certificateName: '웹디자인기능사',
    certificateLevel: '기능사',
    CertificateIssuer: '한국산업인력공단',
    subjectId: 501,
    studentPaymentId: 2001,
    createdAt: String(now - 1000 * 60 * 60 * 24 * 14),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 10),
    branchId: 1,
    lastModifiedByUserId: 'general',
    lastModifiedByName: '직원',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 10),
  },
  {
    __typename: 'Certificate',
    id: 2,
    lectureId: 101,
    studentId: 3,
    stName: '박지훈',
    CAdate: String(now - 1000 * 60 * 60 * 24 * 7),
    certificateName: '정보처리기능사',
    certificateLevel: '기능사',
    CertificateIssuer: '한국산업인력공단',
    subjectId: 501,
    studentPaymentId: 2003,
    createdAt: String(now - 1000 * 60 * 60 * 24 * 7),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 5),
    branchId: 1,
    lastModifiedByUserId: 'teacher01',
    lastModifiedByName: '김강사',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 5),
  },
]
