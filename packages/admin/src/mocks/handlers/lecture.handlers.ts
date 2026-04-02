// src/mocks/handlers/lecture.handlers.ts

import { http, HttpResponse } from 'msw'
import { lectureMockData } from '@/src/mocks/data/lecture.mock'

type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, any>
}

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  if (query.includes('seeLectures')) return 'seeLectures'
  if (query.includes('searchLectures')) return 'searchLectures'
  return undefined
}

const paginate = <T>(items: T[], page = 1, limit = 10) => {
  const safePage = Number(page) > 0 ? Number(page) : 1
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10

  const totalCount = items.length
  const totalPage = Math.ceil(totalCount / safeLimit)
  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit

  return {
    items: items.slice(start, end),
    page: safePage,
    limit: safeLimit,
    totalCount,
    totalPage,
  }
}

const normalizeLecture = (lecture: (typeof lectureMockData)[number]) => ({
  ...lecture,
  lectureDetails: lecture.lectureDetails ?? [],
  teachers: lecture.teachers ?? [],
  subject: {
    ...lecture.subject,
    StudentPayment: lecture.subject?.StudentPayment ?? [],
  },
})

const seeLecturesHandler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const rootField = getRootField(body.query)

  if (rootField !== 'seeLectures') return

  const page = Number(body.variables?.page) || 1
  const limit = Number(body.variables?.limit) || 10

  const mapped = lectureMockData.map(normalizeLecture)
  const paginated = paginate(mapped, page, limit)

  return HttpResponse.json({
    data: {
      seeLectures: {
        __typename: 'SeeLecturesOutput',
        totalCount: paginated.totalCount,
        ok: true,
        message: 'MSW seeLectures success',
        error: null,
        data: paginated.items,
      },
    },
  })
}

const searchLecturesHandler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const rootField = getRootField(body.query)

  if (rootField !== 'searchLectures') return

  const variables = body.variables ?? {}

  // 상세 조회용 id
  const lectureId =
    Number(variables?.searchLecturesId) ||
    Number(variables?.id) ||
    Number(variables?.lectureId) ||
    Number(variables?.input?.id) ||
    Number(variables?.input?.lectureId)

  // 리스트 조회용 필터
  const teacherId =
    Number(variables?.teacherId) || Number(variables?.input?.teacherId)

  const page = Number(variables?.page) || Number(variables?.input?.page) || 1

  const limit =
    Number(variables?.perPage) ||
    Number(variables?.limit) ||
    Number(variables?.input?.perPage) ||
    Number(variables?.input?.limit) ||
    10

  // 1) 상세 조회 모드
  if (lectureId) {
    const found = lectureMockData.find(item => item.id === lectureId)

    return HttpResponse.json({
      data: {
        searchLectures: {
          __typename: 'SearchLecturesOutput',
          ok: true,
          message: `MSW searchLectures success (${lectureId})`,
          error: null,
          totalCount: found ? 1 : 0,
          data: found ? [normalizeLecture(found)] : [],
        },
      },
    })
  }

  // 2) 필터 리스트 조회 모드
  let rows = lectureMockData.map(normalizeLecture)

  // 강사 로그인 시 본인 강의만
  if (teacherId) {
    rows = rows.filter(lecture =>
      lecture.teachers?.some(teacher => Number(teacher.id) === teacherId),
    )
  }

  const paginated = paginate(rows, page, limit)

  return HttpResponse.json({
    data: {
      searchLectures: {
        __typename: 'SearchLecturesOutput',
        ok: true,
        message: 'MSW searchLectures filter success',
        error: null,
        totalCount: paginated.totalCount,
        data: paginated.items,
      },
    },
  })
}

export const lectureHandlers = [
  http.post('*/graphql', seeLecturesHandler),
  http.post('*/graphql', searchLecturesHandler),
]
