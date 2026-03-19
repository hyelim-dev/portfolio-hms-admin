import { http, HttpResponse } from 'msw'
import { getRootField, type GqlBody } from '@/src/mocks/utils/listFactory'
import { buildPermissionsGrantedMock } from '@/src/mocks/data/permission.mock'

const permissionResolvers: Record<string, (v?: Record<string, any>) => any> = {
  searchPermissionsGranted: (v?: Record<string, any>) => {
    const permissionName = String(v?.permissionName ?? '').trim()

    if (!permissionName) {
      return HttpResponse.json({
        data: {
          searchPermissionsGranted: {
            __typename: 'ResultSearchPermissionsGranted',
            totalCount: 0,
            ok: true,
            message: null,
            error: null,
            data: [],
          },
        },
      })
    }

    const record = buildPermissionsGrantedMock(permissionName)

    if (!record) {
      return HttpResponse.json({
        data: {
          searchPermissionsGranted: {
            __typename: 'ResultSearchPermissionsGranted',
            totalCount: 0,
            ok: true,
            message: null,
            error: null,
            data: [],
          },
        },
      })
    }

    return HttpResponse.json({
      data: {
        searchPermissionsGranted: {
          __typename: 'ResultSearchPermissionsGranted',
          totalCount: 1,
          ok: true,
          message: null,
          error: null,
          data: [record], // ✅ 프론트에서 data[0].ManageUser 쓰는 구조 맞춤
        },
      },
    })
  },
}

// =====================
// MSW handler
// =====================
const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody

  const rootField = getRootField(body.query)
  if (!rootField) return

  const resolver = permissionResolvers[rootField]
  if (!resolver) return // permission 담당 아닌 요청이면 패스

  return resolver(body.variables ?? {})
}

export const permissionHandlers = [http.post('*/graphql', handler)]
