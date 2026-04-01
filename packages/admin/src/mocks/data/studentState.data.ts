import type { StudentState } from '@/src/generated/graphql'
import { randomDateBetween } from '@/src/mocks/utils/randomDate'
import {
  adviceTypeMockData,
  ADVICE_CATEGORIES,
} from '@/src/mocks/data/adviceType.mock'
import { STAFF_USERS } from '@/src/mocks/data/manageUser.mock'

const RECEIVE_TYPES = adviceTypeMockData.filter(
  v => v.category === ADVICE_CATEGORIES.RECEIVE && v.onOff === 'Y',
)

const COURSEL_TYPES = adviceTypeMockData.filter(
  v => v.category === ADVICE_CATEGORIES.COURSE && v.onOff === 'Y',
)

const COUNSEL_TYPES = adviceTypeMockData.filter(
  v => v.category === ADVICE_CATEGORIES.COUNSEL && v.onOff === 'Y',
)

const MANAGERS = STAFF_USERS.filter(u => u.resign === 'N')
export const STUDENT_STATE_ALL: StudentState[] = makeStudentStates(137)

function makeStudentStates(count: number): StudentState[] {
  const START_DATE = new Date('2025-01-01T00:00:00.000Z')
  const TODAY = new Date()

  const advicePool = [
    { __typename: 'AdviceType', id: 1, type: '진로' },
    { __typename: 'AdviceType', id: 2, type: '과정문의' },
    { __typename: 'AdviceType', id: 3, type: '결제' },
    { __typename: 'AdviceType', id: 4, type: '취업' },
    { __typename: 'AdviceType', id: 5, type: '환불' },
  ] as any[]

  const progressCodePool = [0, 10, 20, 30, 40, 50, 60, 70, 110, 999]
  const classMethodPool = ['전화상담', '방문상담']
  const subjectPool = ['프론트엔드', '백엔드', '데이터', 'AI', '디자인']

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1

    // createdAt을 딱 1번만 만들고(고정 랜덤)
    const createdAt = randomDateBetween(START_DATE, TODAY, id)
    const updatedAt = randomDateBetween(new Date(createdAt), TODAY, id + 9999)
    const stVisit = randomDateBetween(new Date(createdAt), TODAY, id + 3333)

    return {
      __typename: 'StudentState',

      id,
      stName: `상담고객${id}`,
      phoneNum1: `010-${1000 + (id % 9000)}-${1000 + ((id * 7) % 9000)}`,
      agreement: id % 5 === 0 ? 'N' : 'Y',
      progress: progressCodePool[id % progressCodePool.length],
      subject: null,
      createdAt,
      updatedAt,
      pic:
        MANAGERS.length && id % 5 !== 0
          ? MANAGERS[id % MANAGERS.length].mUsername
          : null,

      receiptDiv: RECEIVE_TYPES.length
        ? RECEIVE_TYPES[id % RECEIVE_TYPES.length].type
        : null,
      stVisit,
      subDiv: COURSEL_TYPES.length
        ? COURSEL_TYPES[id % COURSEL_TYPES.length].type
        : null,
      classMethod: id % 3 === 0 ? [...classMethodPool] : [classMethodPool[1]],
      Branch: null,
      adviceTypes:
        COUNSEL_TYPES.length > 0
          ? pickMany(
              COUNSEL_TYPES,
              1 + (id % Math.min(3, COUNSEL_TYPES.length)),
            )
          : [],
      branchId: null,
      campus: null,
      category: null,
      consultationMemo: null,
      currentManager: null,
      detail: null,
      expEnrollDate: null,
      perchase: null,
      phoneNum2: null,
      phoneNum3: null,
      stAddr: null,
      stEmail: null,
    } as StudentState
  })
}

function pickMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}
