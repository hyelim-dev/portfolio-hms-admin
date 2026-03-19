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

  console.log('[MSW lecture] seeLectures variables:', body.variables)
  console.log('[MSW lecture] seeLectures query:', body.query)

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

  console.log('[MSW lecture] searchLectures variables:', body.variables)
  console.log('[MSW lecture] searchLectures query:', body.query)

  const lectureId =
    Number(body.variables?.searchLecturesId) ||
    Number(body.variables?.id) ||
    Number(body.variables?.lectureId) ||
    Number(body.variables?.input?.id) ||
    Number(body.variables?.input?.lectureId)

  const found = lectureMockData.find(item => item.id === lectureId)

  console.log('[MSW lecture] searchLectures lectureId:', lectureId)
  console.log('[MSW lecture] searchLectures found:', found)

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

export const lectureHandlers = [
  http.post('*/graphql', seeLecturesHandler),
  http.post('*/graphql', searchLecturesHandler),
]
