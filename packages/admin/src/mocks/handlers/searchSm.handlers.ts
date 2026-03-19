// src/mocks/handlers/searchSm.handlers.ts

import { http, HttpResponse } from 'msw'
import { preInspectionMockData } from '@/src/mocks/data/preInspection.mock'
import { certificateMockData } from '@/src/mocks/data/certificate.mock'

type GqlBody = {
  query?: string
  variables?: Record<string, any>
}

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  if (query.includes('searchSM')) return 'searchSM'
  return undefined
}

const paginate = <T>(items: T[], page = 1, limit = 10) => {
  const safePage = Number(page) > 0 ? Number(page) : 1
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10

  const totalCount = items.length
  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit

  return {
    items: items.slice(start, end),
    totalCount,
  }
}

const searchSMHandler = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)

    if (rootField !== 'searchSM') return

    console.log('[MSW searchSM] variables:', body.variables)
    console.log('[MSW searchSM] query:', body.query)

    const variables = body.variables ?? {}
    const modelType = String(variables.modelType ?? '')
    const lectureId = Number(variables.lectureId ?? 0)
    const studentPaymentId = Number(variables.studentPaymentId ?? 0)
    const subjectId = Number(variables.subjectId ?? 0)
    const page = Number(variables.page ?? 1)
    const limit = Number(variables.limit ?? 10)

    // 1. PreInspection
    if (modelType === 'PreInspection') {
      let rows = [...preInspectionMockData]

      if (lectureId) {
        rows = rows.filter(item => item.lectureId === lectureId)
      }

      if (studentPaymentId) {
        rows = rows.filter(item => item.studentPaymentId === studentPaymentId)
      }

      if (subjectId) {
        rows = rows.filter(item => item.subjectId === subjectId)
      }

      const paginated = paginate(rows, page, limit)

      console.log('[MSW searchSM] PreInspection rows:', paginated.items)

      return HttpResponse.json({
        data: {
          searchSM: {
            __typename: 'ResultSearchSM',
            totalCount: paginated.totalCount,
            ok: true,
            message: 'MSW searchSM(PreInspection) success',
            error: null,
            data: paginated.items,
          },
        },
      })
    }

    // 2. Certificate
    if (modelType === 'Certificate') {
      let rows = [...certificateMockData]

      if (lectureId) {
        rows = rows.filter(item => item.lectureId === lectureId)
      }

      if (studentPaymentId) {
        rows = rows.filter(item => item.studentPaymentId === studentPaymentId)
      }

      if (subjectId) {
        rows = rows.filter(item => item.subjectId === subjectId)
      }

      const paginated = paginate(rows, page, limit)

      console.log('[MSW searchSM] Certificate rows:', paginated.items)

      return HttpResponse.json({
        data: {
          searchSM: {
            __typename: 'ResultSearchSM',
            totalCount: paginated.totalCount,
            ok: true,
            message: 'MSW searchSM(Certificate) success',
            error: null,
            data: paginated.items,
          },
        },
      })
    }

    return HttpResponse.json({
      data: {
        searchSM: {
          __typename: 'ResultSearchSM',
          totalCount: 0,
          ok: true,
          message: `MSW searchSM empty (${modelType})`,
          error: null,
          data: [],
        },
      },
    })
  } catch (error) {
    console.error('[MSW searchSM] handler error:', error)

    return HttpResponse.json(
      {
        errors: [{ message: 'searchSM handler error' }],
      },
      { status: 500 },
    )
  }
}

export const searchSmHandlers = [http.post('*/graphql', searchSMHandler)]
