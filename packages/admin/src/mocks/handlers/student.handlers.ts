import { http, HttpResponse } from 'msw'
import { STUDENT_MOCK_DB } from '@/src/mocks/data/student.mock'

type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
}

const mapStudent = (student: any) => {
  const payments = STUDENT_MOCK_DB.payments.filter(
    payment => Number(payment.studentId) === Number(student.id),
  )

  return {
    __typename: 'Student',
    id: student.id,
    name: student.name,
    phoneNum1: student.phone,
    phoneNum2: null,
    birthday: null,
    branchId: 1,
    smsAgreement: 'Y',
    writer: 'MSW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedTime: new Date().toISOString(),
    managerUserId: null,
    manager: null,
    studentMemo: [],
    studentPayment: payments, // ⭐ 여기서 결제목록 연결
  }
}

const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const q = body.query ?? ''

  const rootField =
    typeof q === 'string'
      ? q.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
      : undefined

  /**
   * seeStudent
   */
  if (rootField === 'seeStudent') {
    const students = STUDENT_MOCK_DB.students.map(mapStudent)

    return HttpResponse.json({
      data: {
        seeStudent: {
          __typename: 'SeeStudentResult',
          ok: true,
          message: 'success',
          error: null,
          student: students,
          totalCount: students.length,
        },
      },
    })
  }

  /**
   * searchStudent
   */
  if (rootField === 'searchStudent') {
    const variables = body.variables as {
      searchStudentId?: number
    }

    const filtered = variables?.searchStudentId
      ? STUDENT_MOCK_DB.students.filter(
          s => Number(s.id) === Number(variables.searchStudentId),
        )
      : STUDENT_MOCK_DB.students

    const students = filtered.map(mapStudent)

    return HttpResponse.json({
      data: {
        searchStudent: {
          __typename: 'SearchStudentResult',
          ok: true,
          message: 'success',
          error: null,
          student: students,
          totalCount: students.length,
        },
      },
    })
  }

  return
}

export const studentHandlers = [
  http.post('http://localhost:8000/graphql', handler),
]
