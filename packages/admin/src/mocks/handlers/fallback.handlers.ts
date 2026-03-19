import { http, HttpResponse } from 'msw'

const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as {
    operationName?: string
    query?: string
    variables?: Record<string, unknown>
  }

  const rootField =
    typeof body.query === 'string'
      ? body.query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
      : undefined

  console.warn('[MSW] Unmocked GraphQL', {
    operationName: body.operationName,
    rootField,
    variables: body.variables,
  })
  return HttpResponse.json({ data: {} })
}

export const fallbackHandlers = [http.post('*/graphql', handler)]
