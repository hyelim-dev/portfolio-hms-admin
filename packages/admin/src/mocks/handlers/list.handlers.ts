import { http } from 'msw'
import {
  getRootField,
  makePagedList,
  type GqlBody,
} from '@/src/mocks/utils/listFactory'

// =====================
// 더미 데이터 import
// =====================
import { STUDENT_STATE_ALL } from '../data/studentState.data'
import { STUDENT_ALL } from '../data/student.data'
// 아래는 나중에 쓰면 추가
// import { LECTURES_ALL } from '../data/lectures.data'
// import { SUBJECT_ALL } from '../data/subject.data'
// import { PAYMENT_DETAIL_ALL } from '../data/paymentDetail.data'
// import { STUDENT_PAYMENT_ALL } from '../data/studentPayment.data'

// =====================
// 리스트 resolver 맵
// =====================
const listResolvers: Record<string, (v?: Record<string, any>) => any> = {
  /**
   * ✅ 상담관리 리스트
   * query SeeStudentState { seeStudentState(...) { studentState ... } }
   */
  seeStudentState: makePagedList({
    rootField: 'seeStudentState',
    listField: 'studentState',
    all: STUDENT_STATE_ALL,
  }),

  /**
   * ✅ 수강생 리스트 예시
   * query SearchStudent { searchStudent(...) { student ... } }
   */
  searchStudent: makePagedList({
    rootField: 'searchStudent',
    listField: 'student',
    all: STUDENT_ALL,
  }),
}

// =====================
// MSW handler
// =====================
const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody

  const rootField = getRootField(body.query)
  if (!rootField) return

  const resolver = listResolvers[rootField]
  if (!resolver) return // 내가 담당 아닌 요청이면 패스

  return resolver(body.variables ?? {})
}

export const listHandlers = [http.post('*/graphql', handler)]
