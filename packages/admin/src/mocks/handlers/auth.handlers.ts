import { http, HttpResponse } from 'msw'

const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as {
    operationName?: string
    query?: string
    variables?: Record<string, any>
  }

  const rootField =
    typeof body.query === 'string'
      ? body.query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
      : undefined

  if (rootField !== 'mLogin') return

  const isLogin =
    typeof body.query === 'string' &&
    body.query.includes('mLogin(') &&
    body.operationName === 'Mutation'

  if (!isLogin) return

  const { mUserId, mPassword } = body.variables as {
    mUserId: string
    mPassword: string
  }

  if (mPassword !== '1234') {
    return HttpResponse.json({
      data: {
        mLogin: {
          error: '아이디 또는 비밀번호가 올바르지 않습니다.',
          ok: false,
          token: null,
          refreshToken: null,
          __typename: 'MLoginOutput',
        },
      },
    })
  }

  const token =
    mUserId === 'master'
      ? 'mock-token-master-grade-1'
      : mUserId === 'general'
        ? 'mock-token-general-grade-9'
        : mUserId === 'teacher'
          ? 'mock-token-teacher-grade-99'
          : null

  const refreshToken =
    mUserId === 'master'
      ? 'mock-refresh-token-master'
      : mUserId === 'general'
        ? 'mock-refresh-token-general'
        : mUserId === 'teacher'
          ? 'mock-refresh-token-teacher'
          : null

  if (!token) {
    return HttpResponse.json({
      data: {
        mLogin: {
          error: '아이디 또는 비밀번호가 올바르지 않습니다.',
          ok: false,
          token: null,
          refreshToken: null,
          __typename: 'MLoginOutput',
        },
      },
    })
  }

  return HttpResponse.json({
    data: {
      mLogin: {
        error: null,
        ok: true,
        token,
        refreshToken,
        __typename: 'MLoginOutput',
      },
    },
  })
}

export const authHandlers = [http.post('*/graphql', handler)]
