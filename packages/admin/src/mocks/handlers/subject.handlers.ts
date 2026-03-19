import { http, HttpResponse } from 'msw'
import { SUBJECT_MOCK_DB } from '@/src/mocks/data/subject.mock'

type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
}

const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const q = body.query ?? ''

  const isSearchSubject =
    body.operationName === 'SearchSubject' ||
    (typeof q === 'string' && q.includes('searchSubject'))

  if (!isSearchSubject) return

  const variables = body.variables as {
    search?: string
    keyword?: string
  }

  const keyword =
    typeof variables?.search === 'string'
      ? variables.search.trim()
      : typeof variables?.keyword === 'string'
        ? variables.keyword.trim()
        : ''

  const filtered = keyword
    ? SUBJECT_MOCK_DB.filter(subject =>
        [subject.subjectName, subject.subjectCode, subject.teacherName].some(
          value => value.toLowerCase().includes(keyword.toLowerCase()),
        ),
      )
    : SUBJECT_MOCK_DB

  return HttpResponse.json({
    data: {
      searchSubject: {
        __typename: 'SeeSubjectResult',
        ok: true,
        message: 'success',
        error: null,
        result: filtered.map(subject => ({
          __typename: 'Subject',
          id: subject.id,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          subDiv: subject.subDiv,
          teacherName: subject.teacherName,
          fee: subject.fee,
          round: subject.round,
          roomNum: subject.roomNum,
          startDate: subject.startDate,
          endDate: subject.endDate,
          totalTime: subject.totalTime,
          exposure: subject.exposure,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
          lastModifiedTime: subject.lastModifiedTime,
          branchId: subject.branchId,
          expiresDateStart: subject.expiresDateStart,
          expiresDateEnd: subject.expiresDateEnd,
          Branch: null,
          StudentPayment: [],
          lectures: null,
        })),
        totalCount: filtered.length,
      },
    },
  })
}

export const subjectHandlers = [http.post('*/graphql', handler)]
