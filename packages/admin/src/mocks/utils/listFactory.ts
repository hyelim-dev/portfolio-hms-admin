import { HttpResponse } from 'msw'

export type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, any>
}

export function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  return query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
}

export function makePagedList<T>(args: {
  rootField: string
  listField: string
  all: T[]
  message?: string
}) {
  const { rootField, listField, all, message = 'MSW' } = args

  return (variables?: Record<string, any>) => {
    const page = Number(variables?.page ?? 1)
    const limit = Number(variables?.limit ?? 20)

    const start = (page - 1) * limit
    const end = start + limit

    return HttpResponse.json({
      data: {
        [rootField]: {
          ok: true,
          message,
          totalCount: all.length,
          [listField]: all.slice(start, end),
        },
      },
    })
  }
}
