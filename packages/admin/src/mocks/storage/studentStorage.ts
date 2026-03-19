import { STUDENT_MOCK_DB } from '@/src/mocks/data/student.mock'
import type {
  MockStudent,
  MockStudentPayment,
  MockRefundRequest,
  MockRefundCompleted,
} from '@/src/mocks/data/student.mock'

const STORAGE_KEY = 'HMS_STUDENT_DB'

export type StudentStorageDb = {
  students: MockStudent[]
  payments: MockStudentPayment[]
  refundRequests: MockRefundRequest[]
  refundCompleted: MockRefundCompleted[]
  paymentSeq: number
  paymentDetailSeq: number
  refundSeq: number
}

function cloneInitialDb(): StudentStorageDb {
  return JSON.parse(JSON.stringify(STUDENT_MOCK_DB))
}

export function initStudentDb(): StudentStorageDb {
  if (typeof window === 'undefined') {
    return cloneInitialDb()
  }

  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    const initial = cloneInitialDb()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    return JSON.parse(saved) as StudentStorageDb
  } catch {
    const initial = cloneInitialDb()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

export function getStudentDb(): StudentStorageDb {
  return initStudentDb()
}

export function setStudentDb(nextDb: StudentStorageDb) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb))
}

export function resetStudentDb() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function syncStudentDbToMock() {
  const db = getStudentDb()

  STUDENT_MOCK_DB.students = db.students
  STUDENT_MOCK_DB.payments = db.payments
  STUDENT_MOCK_DB.refundRequests = db.refundRequests
  STUDENT_MOCK_DB.refundCompleted = db.refundCompleted
  STUDENT_MOCK_DB.paymentSeq = db.paymentSeq
  STUDENT_MOCK_DB.paymentDetailSeq = db.paymentDetailSeq
  STUDENT_MOCK_DB.refundSeq = db.refundSeq
}

export function updateStudentDb(
  updater: (draft: StudentStorageDb) => void,
): StudentStorageDb {
  const db = getStudentDb()
  const nextDb: StudentStorageDb = JSON.parse(JSON.stringify(db))

  updater(nextDb)
  setStudentDb(nextDb)
  syncStudentDbToMock()

  return nextDb
}
