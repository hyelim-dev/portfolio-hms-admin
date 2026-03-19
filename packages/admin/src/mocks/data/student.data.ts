import type { Student } from '@/src/generated/graphql'

export const STUDENT_ALL: Student[] = makeStudents(120)

function makeStudents(count: number): Student[] {
  const now = Date.now()

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1
    const createdAt = new Date(now - i * 1000 * 60 * 60 * 12).toISOString()

    return {
      __typename: 'Student',
      id,
      name: `수강생${id}`,
      phoneNum1: `010-${1000 + (id % 9000)}-${1000 + ((id * 7) % 9000)}`,
      phoneNum2:
        id % 3 === 0
          ? `010-${2000 + (id % 8000)}-${3000 + ((id * 5) % 7000)}`
          : null,
      birthday:
        id % 4 === 0 ? `199${id % 10}-0${(id % 9) + 1}-1${id % 9}` : null,

      smsAgreement: id % 5 === 0 ? 'N' : 'Y',

      writer: 'MSW',
      createdAt,
      updatedAt: createdAt,
      lastModifiedTime: createdAt,

      managerUserId: null,
      manager: null,

      studentMemo: null,
      studentPayment: null,
    }
  })
}
