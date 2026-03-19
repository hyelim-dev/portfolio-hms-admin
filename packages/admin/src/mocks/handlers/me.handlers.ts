import { http, HttpResponse } from 'msw'
import { MANAGE_USER_ALL } from '@/src/mocks/data/manageUser.mock'

const mockUsers = MANAGE_USER_ALL.filter(u => u.resign === 'N')

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

  console.log('mMe' + rootField)

  const q = body.query ?? ''

  const isMe =
    body.operationName === 'MMe' || (typeof q === 'string' && q.includes('mMe'))
  // console.log(isMe)

  if (!isMe) return
  const token = request.headers.get('token') ?? ''

  const user =
    mockUsers.find(u => token.includes(u.mUserId)) ??
    mockUsers.find(u => u.mUserId === 'general')
  console.log(user)

  return HttpResponse.json({
    data: {
      mMe: {
        id: user.id,
        mUserId: user.mUserId,
        mUsername: user.mUsername,
        mPart: user.mPart,
        mGrade: user.mGrade,
        mRank: user.mRank,
        branchId: user.branchId,

        Stamp: [],
        ConsultationMemo: [],
        mZipCode: '',
        mAddressDetail: '',
        mAddresses: '',
        mAvatar: null,
        mJoiningDate: null,
        mPassword: null,
        mPhoneNum: '',
        mPhoneNumCompany: '',
        mPhoneNumFriend: '',
        mPhoneNumInside: '',
        resign: false,
        email: '',
        createdAt: new Date().toISOString(),
        lastModifiedBy: null,
        lastModifiedTime: null,
        favoriteStudentState: null,

        __typename: 'ManageUser',
      },
    },
  })
}

export const meHandlers = [http.post('*/graphql', handler)]
