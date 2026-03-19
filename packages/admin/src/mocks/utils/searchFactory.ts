import { HttpResponse } from 'msw'

export type SearchConfig<T> = {
  rootField: string // ex) 'searchStudentState'
  listField: string // ex) 'studentState'
  resultTypename?: string // ex) 'SearchStudentStateResult'
  itemTypename?: string // ex) 'StudentState'
  all: T[]
  getPaging?: (v?: Record<string, any>) => { page: number; perPage: number }
  sort?: (a: T, b: T) => number
  filter?: (item: T, v?: Record<string, any>) => boolean
}

export const createSearchHandler = <T>(config: SearchConfig<T>) => {
  return (v?: Record<string, any>) => {
    const vars = v ?? {}

    const { page, perPage } = config.getPaging
      ? config.getPaging(vars)
      : {
          page: Number(vars.page ?? 1),
          perPage: Number(vars.perPage ?? 20),
        }

    let list = [...config.all]

    if (config.filter) {
      list = list.filter(item => config.filter!(item, vars))
    }

    if (config.sort) {
      list.sort(config.sort)
    }

    const totalCount = list.length
    const start = (page - 1) * perPage
    const sliced = list.slice(start, start + perPage).map((item: any) => {
      if (!config.itemTypename) return item
      return { ...item, __typename: config.itemTypename }
    })

    return HttpResponse.json({
      data: {
        [config.rootField]: {
          __typename: config.resultTypename,
          ok: true,
          message: null,
          error: null,
          totalCount,
          [config.listField]: sliced,
        },
      },
    })
  }
}
