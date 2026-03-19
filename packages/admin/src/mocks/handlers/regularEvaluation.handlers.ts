import { http, HttpResponse } from 'msw'
import { regularEvaluationMockData } from '@/src/mocks/data/regularEvaluation.mock'

type GqlBody = {
  query?: string
  variables?: Record<string, any>
}

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  if (query.includes('seeRegularEvaluationSet'))
    return 'seeRegularEvaluationSet'
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

const seeRegularEvaluationSetHandler = async ({
  request,
}: {
  request: Request
}) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)

    if (rootField !== 'seeRegularEvaluationSet') return

    console.log('[MSW regularEvaluation] variables:', body.variables)
    console.log('[MSW regularEvaluation] query:', body.query)

    const variables = body.variables ?? {}
    const lectureId = Number(variables.lectureId ?? 0)
    const subjectId = Number(variables.subjectId ?? 0)
    const page = Number(variables.page ?? 1)
    const limit = Number(variables.limit ?? 10)

    let rows = [...regularEvaluationMockData]

    if (lectureId) {
      rows = rows.filter(item => item.lectureId === lectureId)
    }

    if (subjectId) {
      rows = rows.filter(item => item.subjectId === subjectId)
    }

    const paginated = paginate(rows, page, limit)

    console.log(
      '[MSW regularEvaluation] seeRegularEvaluationSet rows:',
      paginated.items,
    )

    return HttpResponse.json({
      data: {
        seeRegularEvaluationSet: {
          __typename: 'ResultSeeRegularEvaluationSet',
          totalCount: paginated.totalCount,
          ok: true,
          message: 'MSW seeRegularEvaluationSet success',
          error: null,
          data: paginated.items,
        },
      },
    })
  } catch (error) {
    console.error('[MSW regularEvaluation] handler error:', error)

    return HttpResponse.json(
      {
        errors: [{ message: 'seeRegularEvaluationSet handler error' }],
      },
      { status: 500 },
    )
  }
}

export const regularEvaluationHandlers = [
  http.post('*/graphql', seeRegularEvaluationSetHandler),
]
