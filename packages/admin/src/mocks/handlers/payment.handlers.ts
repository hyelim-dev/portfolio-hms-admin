import { http, HttpResponse } from 'msw'
import { getStudentDb } from '@/src/mocks/storage/studentStorage'

type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, any>
}

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  return query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
}

const paymentHandler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const rootField = getRootField(body.query)

  if (rootField !== 'searchStudentPayment') return

  const db = getStudentDb()
  const id =
    Number(body.variables?.searchStudentPaymentId) || Number(body.variables?.id)

  const found = db.payments.find(item => item.id === id)

  return HttpResponse.json({
    data: {
      searchStudentPayment: {
        __typename: 'SearchStudentPaymentOutput',
        ok: true,
        message: 'MSW searchStudentPayment success',
        error: null,
        totalCount: found ? 1 : 0,
        data: found ? [found] : [],
      },
    },
  })
}

export const paymentHandlers = [http.post('*/graphql', paymentHandler)]
