import { authHandlers } from '@/src/mocks/handlers/auth.handlers'
import { meHandlers } from '@/src/mocks/handlers/me.handlers'
import { fallbackHandlers } from '@/src/mocks/handlers/fallback.handlers'
import { debugHandlers } from '@/src/mocks/handlers/test.handlers'
import { adviceTypeHandlers } from '@/src/mocks/handlers/adviceType.handlers'
import { listHandlers } from '@/src/mocks/handlers/list.handlers'
import { searchHandlers } from '@/src/mocks/handlers/search.handlers'
import { permissionHandlers } from '@/src/mocks/handlers/permission.handlers'
import { studentHandlers } from '@/src/mocks/handlers/student.handlers'
import { paymentHandlers } from '@/src/mocks/handlers/payment.handlers'
import { refundHandlers } from '@/src/mocks/handlers/refund.handlers'
import { subjectHandlers } from '@/src/mocks/handlers/subject.handlers'
import { accountingHandlers } from '@/src/mocks/handlers/accounting.handlers'
import { lectureHandlers } from '@/src/mocks/handlers/lecture.handlers'
import { attendanceHandlers } from '@/src/mocks/handlers/attendance.handlers'
import { searchSmHandlers } from '@/src/mocks/handlers/searchSm.handlers'
import { regularEvaluationHandlers } from '@/src/mocks/handlers/regularEvaluation.handlers'

export const handlers = [
  ...authHandlers,
  ...meHandlers,
  ...paymentHandlers,
  ...searchHandlers,
  ...adviceTypeHandlers,
  ...permissionHandlers,
  ...studentHandlers,
  ...refundHandlers,
  ...accountingHandlers,
  ...subjectHandlers,
  ...lectureHandlers,
  ...attendanceHandlers,
  ...searchSmHandlers,
  ...regularEvaluationHandlers,
  ...listHandlers,
  ...debugHandlers,
  ...fallbackHandlers,
]
