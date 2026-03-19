import { graphql, HttpResponse } from 'msw'
import { adviceTypeMockData } from '../data/adviceType.mock'

type SeeAdviceTypeVars = {
  category: string
  page?: number
  limit?: number
}

export const adviceTypeHandlers = [
  graphql.query('SeeAdviceType', ({ variables }) => {
    const { category, page = 1, limit = 10 } = variables as SeeAdviceTypeVars

    const filtered = adviceTypeMockData.filter(
      item => item.category === category,
    )

    const start = (page - 1) * limit
    const sliced = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data: {
        seeAdviceType: {
          __typename: 'ResultAdviceType',
          ok: true,
          message: null,
          error: null,
          adviceType: sliced,
          totalCount: filtered.length,
        },
      },
    })
  }),
]
