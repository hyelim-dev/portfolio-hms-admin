export type MockPreInspection = {
  __typename: 'PreInspection'
  id: number
  lectureId: number
  studentId: number
  stName: string
  dateOfPreInspection?: string | null
  preScreenerType?: string | null
  preInspectionDetails?: string | null
  actionTaken?: string | null
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

export const preInspectionMockData: MockPreInspection[] = [
  {
    __typename: 'PreInspection',
    id: 1,
    lectureId: 101,
    studentId: 2,
    stName: '이서연',
    dateOfPreInspection: String(now - 1000 * 60 * 60 * 24 * 5),
    preScreenerType: '출결부진',
    preInspectionDetails:
      '최근 지각과 결석이 반복되어 중도 이탈 가능성을 사전 점검함.',
    actionTaken:
      '훈련 참여 독려 및 출결 관리 필요사항 안내. 보호자 연락 여부 검토.',
    subjectId: 501,
    studentPaymentId: 2002,
    createdAt: String(now - 1000 * 60 * 60 * 24 * 5),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 3),
    branchId: 1,
    lastModifiedByUserId: 'teacher01',
    lastModifiedByName: '김강사',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 3),
  },
  {
    __typename: 'PreInspection',
    id: 2,
    lectureId: 101,
    studentId: 3,
    stName: '박지훈',
    dateOfPreInspection: String(now - 1000 * 60 * 60 * 24 * 2),
    preScreenerType: '훈련교사',
    preInspectionDetails:
      '훈련 집중도 저하와 과제 수행 미흡으로 미수료 가능성 점검.',
    actionTaken:
      '학습 진도 체크 및 보충 안내. 다음 주 상담 후 경과 재확인 예정.',
    subjectId: 501,
    studentPaymentId: 2003,
    createdAt: String(now - 1000 * 60 * 60 * 24 * 2),
    updatedAt: String(now - 1000 * 60 * 60 * 24),
    branchId: 1,
    lastModifiedByUserId: 'general',
    lastModifiedByName: '직원',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24),
  },
]
