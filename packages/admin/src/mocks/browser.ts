import { setupWorker } from 'msw/browser'
import { handlers } from '@/src/mocks/handlers'

import {
  initStudentDb,
  syncStudentDbToMock,
} from '@/src/mocks/storage/studentStorage'

if (typeof window !== 'undefined') {
  initStudentDb()
  syncStudentDbToMock()
}

export const worker = setupWorker(...handlers)
