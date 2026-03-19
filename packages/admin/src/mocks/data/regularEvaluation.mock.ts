export type MockRegularEvaluationSet = {
  __typename: 'RegularEvaluationSet'
  id: number
  lectureId: number
  subjectId: number
  statusType: string
  points: number
  evaluationDetails: string
  createdAt: string
  updatedAt: string
  lastModifiedByUserId: string
  lastModifiedByName: string
  lastModifiedTime: string
}

const now = Date.now()

export const regularEvaluationMockData: MockRegularEvaluationSet[] = [
  {
    __typename: 'RegularEvaluationSet',
    id: 1,
    lectureId: 101,
    subjectId: 501,
    statusType: '출석',
    points: 20,
    evaluationDetails: '훈련기간 중 출석률 및 출결 성실도를 평가한다.',
    createdAt: String(now - 1000 * 60 * 60 * 24 * 10),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 8),
    lastModifiedByUserId: 'general',
    lastModifiedByName: '직원',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 8),
  },
  {
    __typename: 'RegularEvaluationSet',
    id: 2,
    lectureId: 101,
    subjectId: 501,
    statusType: '과제',
    points: 30,
    evaluationDetails: '주차별 과제 수행 여부와 제출 완성도를 평가한다.',
    createdAt: String(now - 1000 * 60 * 60 * 24 * 9),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 7),
    lastModifiedByUserId: 'teacher01',
    lastModifiedByName: '김강사',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 7),
  },
  {
    __typename: 'RegularEvaluationSet',
    id: 3,
    lectureId: 101,
    subjectId: 501,
    statusType: '최종평가',
    points: 50,
    evaluationDetails: '최종 프로젝트 결과물과 발표 내용을 종합 평가한다.',
    createdAt: String(now - 1000 * 60 * 60 * 24 * 8),
    updatedAt: String(now - 1000 * 60 * 60 * 24 * 6),
    lastModifiedByUserId: 'teacher01',
    lastModifiedByName: '김강사',
    lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 6),
  },
]
