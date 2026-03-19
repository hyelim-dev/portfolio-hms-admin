export type ManageUserMock = {
  __typename: 'ManageUser'
  id: number
  mUserId: string
  mUsername: string
  mPassword?: string
  mGrade: number
  mRank: string
  mPart: string[]
  mPhoneNum: string
  resign: 'Y' | 'N'
  branchId: number
}

// 고정계정
export const SYSTEM_USERS: ManageUserMock[] = [
  {
    __typename: 'ManageUser',
    id: 1,
    mUserId: 'master',
    mUsername: '마스터',
    mGrade: 1,
    mRank: '대표',
    mPart: ['마스터'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-1234-5678',
  },
  {
    __typename: 'ManageUser',
    id: 2,
    mUserId: 'general',
    mUsername: '직원',
    mGrade: 9,
    mRank: '대리',
    mPart: ['직원'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-4888-7653',
  },
  {
    __typename: 'ManageUser',
    id: 3,
    mUserId: 'teacher',
    mUsername: '강사',
    mGrade: 99,
    mRank: '강사',
    mPart: ['강사'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-5234-6854',
  },
]

// 직원
export const STAFF_USERS: ManageUserMock[] = [
  {
    __typename: 'ManageUser',
    id: 4,
    mUserId: 'kjina',
    mUsername: '김진아',
    mPassword: '1234',
    mGrade: 9,
    mRank: '인턴',
    mPart: ['교무부'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-8874-7946',
  },
  {
    __typename: 'ManageUser',
    id: 5,
    mUserId: 'pmh',
    mUsername: '박민호',
    mPassword: '1234',
    mGrade: 9,
    mRank: '사원',
    mPart: ['교무부'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-1342-1134',
  },
  {
    __typename: 'ManageUser',
    id: 6,
    mUserId: 'khs',
    mUsername: '강호식',
    mPassword: '1234',
    mGrade: 9,
    mRank: '사원',
    mPart: ['인사팀'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-2578-6643',
  },
  {
    __typename: 'ManageUser',
    id: 7,
    mUserId: 'lsm',
    mUsername: '이석민',
    mPassword: '1234',
    mGrade: 9,
    mRank: '대리',
    mPart: ['인사팀'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-5123-3324',
  },
  {
    __typename: 'ManageUser',
    id: 8,
    mUserId: 'chj',
    mUsername: '최혜진',
    mPassword: '1234',
    mGrade: 9,
    mRank: '과정 대리',
    mPart: ['총괄'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-3432-6621',
  },
  {
    __typename: 'ManageUser',
    id: 9,
    mUserId: 'smj',
    mUsername: '송민지',
    mPassword: '1234',
    mGrade: 9,
    mRank: '대리',
    mPart: ['교무부'],
    resign: 'Y', // 퇴사
    branchId: 1,
    mPhoneNum: '010-5433-6624',
  },
]

// 강사
export const TEACHERS: ManageUserMock[] = [
  {
    __typename: 'ManageUser',
    id: 10,
    mUserId: 'kgs',
    mUsername: '김강사',
    mPassword: '1234',
    mGrade: 99,
    mRank: '강사',
    mPart: ['강사'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-1793-2584',
  },
  {
    __typename: 'ManageUser',
    id: 11,
    mUserId: 'lgs',
    mUsername: '이강사',
    mPassword: '1234',
    mGrade: 99,
    mRank: '강사',
    mPart: ['강사'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-5353-1673',
  },
  {
    __typename: 'ManageUser',
    id: 12,
    mUserId: 'pgs',
    mUsername: '박강사',
    mPassword: '1234',
    mGrade: 99,
    mRank: '강사',
    mPart: ['강사'],
    resign: 'N',
    branchId: 1,
    mPhoneNum: '010-6355-2255',
  },
]

export const MANAGE_USER_ALL: ManageUserMock[] = [
  ...SYSTEM_USERS,
  ...STAFF_USERS,
  ...TEACHERS,
]
