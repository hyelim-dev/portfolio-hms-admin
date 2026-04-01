// src/mocks/handlers/attendance.handlers.ts

import { http, HttpResponse } from 'msw'
import {
  getAttendanceDb,
  updateAttendanceDb,
} from '@/src/mocks/storage/attendanceStorage'

type GqlBody = {
  query?: string
  variables?: Record<string, any>
}

const ALLOWED_STATES = ['출석', '지각', '조퇴', '결석', '외출']

function getRootField(query?: string) {
  if (!query) return
  if (query.includes('seeAttendance')) return 'seeAttendance'
  if (query.includes('searchAttendance')) return 'searchAttendance'
  if (query.includes('createAttendance')) return 'createAttendance'
  if (query.includes('editAttendance')) return 'editAttendance'
}

const normalizeDates = (value: any): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (typeof value === 'string') return [value]
  return []
}

const seeAttendanceHandler = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)
    if (rootField !== 'seeAttendance') return

    const db = getAttendanceDb()
    const attendanceDate = String(body.variables?.attendanceDate ?? '')

    const enrollData = db.filter(item => item.attendanceDate === attendanceDate)
    const leaveEarlyData = enrollData.filter(
      item => item.attendanceState === '조퇴',
    )

    return HttpResponse.json({
      data: {
        seeAttendance: {
          ok: true,
          message: 'MSW seeAttendance success',
          error: null,
          enrollCount: enrollData.length,
          enrollData,
          leaveEarlyCount: leaveEarlyData.length,
          leaveEarlyData,
        },
      },
    })
  } catch (error) {
    console.error('[MSW attendance] seeAttendance error:', error)
    return HttpResponse.json(
      {
        errors: [{ message: 'seeAttendance handler error' }],
      },
      { status: 500 },
    )
  }
}

const searchAttendanceHandler = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)
    if (rootField !== 'searchAttendance') return

    const db = getAttendanceDb()
    const dates = normalizeDates(body.variables?.attendanceDate)

    const filtered = db.filter(item => dates.includes(item.attendanceDate))

    return HttpResponse.json({
      data: {
        searchAttendance: {
          ok: true,
          message: 'MSW searchAttendance success',
          error: null,
          totalCount: filtered.length,
          data: filtered,
        },
      },
    })
  } catch (error) {
    console.error('[MSW attendance] searchAttendance error:', error)
    return HttpResponse.json(
      {
        errors: [{ message: 'searchAttendance handler error' }],
      },
      { status: 500 },
    )
  }
}

const createAttendanceHandler = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)
    if (rootField !== 'createAttendance') return

    const {
      attendanceDate,
      studentId = [],
      studentPaymentId = [],
      attendanceState = [],
    } = body.variables ?? {}

    updateAttendanceDb(prev => {
      let next = [...prev]

      studentId.forEach((id: number, index: number) => {
        const state = attendanceState[index]

        if (!ALLOWED_STATES.includes(state)) return

        const existingIndex = next.findIndex(
          item =>
            item.studentId === id && item.attendanceDate === attendanceDate,
        )

        if (existingIndex !== -1) {
          next[existingIndex] = {
            ...next[existingIndex],
            attendanceState: state,
          }
        } else {
          next.push({
            id: Date.now() + index,
            student: { name: `학생${id}` },
            attendanceDate,
            attendanceState: state,
            studentId: id,
            studentPaymentId: studentPaymentId[index],
            studentPayment: {
              lectureAssignment: '배정',
            },
          })
        }
      })

      return next
    })

    return HttpResponse.json({
      data: {
        createAttendance: {
          ok: true,
          message: '출석 저장 완료',
          error: null,
        },
      },
    })
  } catch (error) {
    console.error('[MSW attendance] createAttendance error:', error)
    return HttpResponse.json(
      {
        errors: [{ message: 'createAttendance handler error' }],
      },
      { status: 500 },
    )
  }
}

const editAttendanceHandler = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.clone().json()) as GqlBody
    const rootField = getRootField(body.query)
    if (rootField !== 'editAttendance') return

    const { editAttendanceId = [], attendanceState = [] } = body.variables ?? {}

    updateAttendanceDb(prev => {
      return prev.map(item => {
        const idx = editAttendanceId.findIndex((id: number) => id === item.id)

        if (idx === -1) return item

        const nextState = attendanceState[idx]
        if (!ALLOWED_STATES.includes(nextState)) return item

        return {
          ...item,
          attendanceState: nextState,
        }
      })
    })

    return HttpResponse.json({
      data: {
        editAttendance: {
          ok: true,
          message: '출석 수정 완료',
          error: null,
        },
      },
    })
  } catch (error) {
    console.error('[MSW attendance] editAttendance error:', error)
    return HttpResponse.json(
      {
        errors: [{ message: 'editAttendance handler error' }],
      },
      { status: 500 },
    )
  }
}

export const attendanceHandlers = [
  http.post('*/graphql', seeAttendanceHandler),
  http.post('*/graphql', searchAttendanceHandler),
  http.post('*/graphql', createAttendanceHandler),
  http.post('*/graphql', editAttendanceHandler),
]
