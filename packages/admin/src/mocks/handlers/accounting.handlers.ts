import { http, HttpResponse } from 'msw'
import {
  getStudentDb,
  updateStudentDb,
} from '@/src/mocks/storage/studentStorage'

type GqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, any>
}

const ACCOUNTING_ROOT_FIELDS = new Set([
  'seePaymentDetail',
  'seeStudentPayment',
  'searchPaymentDetail',
  'refundApproval',
  'editStudentPayment',
  'getHourlySalesData',
  'createPaymentDetail',
  'editPaymentDetail',
])

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  return query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
}

function isAccountingRootField(rootField?: string) {
  if (!rootField) return false
  return ACCOUNTING_ROOT_FIELDS.has(rootField)
}

function paginate<T>(items: T[], page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit
  return items.slice(start, end)
}

function toTimestampString(value: any) {
  if (!value) return String(Date.now())

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return value
  }

  if (value instanceof Date) {
    return String(value.getTime())
  }

  const parsed = new Date(value).getTime()
  return String(Number.isNaN(parsed) ? Date.now() : parsed)
}

function getAllPaymentDetails() {
  const db = getStudentDb()

  return db.payments.flatMap(payment =>
    (payment.paymentDetail ?? []).map(detail => ({
      ...detail,
      studentPayment: {
        id: payment.id,
        studentId: payment.studentId,
        subjectId: payment.subjectId ?? null,
        processingManagerId: payment.processingManagerId ?? null,
        branchId: payment.branchId,
        campus: payment.campus ?? null,
        seScore: payment.seScore ?? null,
        tuitionFee: payment.tuitionFee ?? null,
        dueDate: payment.dueDate ?? null,
        subDiv: payment.subDiv ?? null,
        amountReceived: payment.amountReceived ?? 0,
        situationReport: payment.situationReport ?? null,
        paymentDate: payment.paymentDate ?? null,
        unCollectedAmount: payment.unCollectedAmount ?? null,
        actualAmount: payment.actualAmount ?? null,
        discountAmount: payment.discountAmount ?? null,
        isWeekend: payment.isWeekend ?? null,
        lectureAssignment: payment.lectureAssignment ?? null,
        courseComplete: payment.courseComplete ?? null,
        employment: payment.employment ?? null,
        cardAmount: payment.cardAmount ?? 0,
        cashAmount: payment.cashAmount ?? 0,
        createdAt: payment.createdAt ?? null,
        updatedAt: payment.updatedAt ?? null,
        lastModifiedTime: payment.lastModifiedTime ?? null,
        lastModifiedByName: payment.lastModifiedByName ?? null,
        lastModifiedByUserId: payment.lastModifiedByUserId ?? null,
        student: payment.student ?? null,
        subject: payment.subject ?? null,
        processingManager: payment.processingManager ?? null,
        paymentDetail: payment.paymentDetail ?? [],
      },
    })),
  )
}

function sortByDateDesc<T extends Record<string, any>>(
  items: T[],
  key: string,
) {
  return [...items].sort((a, b) => {
    const getTimeValue = (value: any) => {
      if (!value) return 0

      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value)
      }

      return new Date(value).getTime()
    }

    const aTime = getTimeValue(a?.[key])
    const bTime = getTimeValue(b?.[key])

    return bTime - aTime
  })
}

const accountingHandler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const rootField = getRootField(body.query)
  const variables = body.variables ?? {}

  // 회계 요청이 아니면 바로 패스
  if (!isAccountingRootField(rootField)) return

  console.log('[MSW accounting] rootField:', rootField)
  console.log('[MSW accounting] variables:', variables)

  // 1) 결제내역
  if (rootField === 'seePaymentDetail') {
    const page = Number(variables.page ?? 1)
    const limit = Number(variables.limit ?? 10)

    const rows = sortByDateDesc(getAllPaymentDetails(), 'paymentDate')
    const pageRows = paginate(rows, page, limit)

    return HttpResponse.json({
      data: {
        seePaymentDetail: {
          __typename: 'PaymentDetailResult',
          ok: true,
          message: 'MSW seePaymentDetail success',
          error: null,
          totalCount: rows.length,
          PaymentDetail: pageRows,
        },
      },
    })
  }

  // 2) 미수금내역
  if (rootField === 'seeStudentPayment') {
    const db = getStudentDb()
    const page = Number(variables.page ?? 1)
    const limit = Number(variables.limit ?? 10)

    const rows = sortByDateDesc(
      db.payments.filter(item => Number(item.unCollectedAmount ?? 0) > 0),
      'createdAt',
    )
    const pageRows = paginate(rows, page, limit)

    return HttpResponse.json({
      data: {
        seeStudentPayment: {
          __typename: 'StudentPaymentResult',
          ok: true,
          message: 'MSW seeStudentPayment success',
          error: null,
          totalCount: rows.length,
          StudentPayment: pageRows,
        },
      },
    })
  }

  // 3) 환불신청 / 환불완료 조회 + 결제상세 id 조회
  if (rootField === 'searchPaymentDetail') {
    const detailId =
      Number(variables.searchPaymentDetailId) ||
      Number(variables.paymentDetailId) ||
      Number(variables.id)

    // 상세 조회용
    if (detailId) {
      const found = getAllPaymentDetails().find(
        item => Number(item.id) === detailId,
      )

      return HttpResponse.json({
        data: {
          searchPaymentDetail: {
            __typename: 'PaymentDetailResult',
            ok: true,
            message: 'MSW searchPaymentDetail detail success',
            error: null,
            totalCount: found ? 1 : 0,
            PaymentDetail: found ? [found] : [],
          },
        },
      })
    }

    // 리스트 조회용
    const page = Number(variables.page ?? 1)
    const limit = Number(variables.limit ?? 10)
    const reqRefund = variables.reqRefund
    const refundApproval = variables.refundApproval
    const sortOf = String(variables.sortOf ?? 'reqRefundDate')

    let rows = getAllPaymentDetails()

    if (typeof reqRefund === 'boolean') {
      rows = rows.filter(item => item.reqRefund === reqRefund)
    }
    if (typeof refundApproval === 'boolean') {
      rows = rows.filter(item => item.refundApproval === refundApproval)
    }

    rows = sortByDateDesc(rows, sortOf)
    const pageRows = paginate(rows, page, limit)

    return HttpResponse.json({
      data: {
        searchPaymentDetail: {
          __typename: 'PaymentDetailResult',
          ok: true,
          message: 'MSW searchPaymentDetail success',
          error: null,
          totalCount: rows.length,
          PaymentDetail: pageRows,
        },
      },
    })
  }

  // 4) 환불 승인 / 승인 취소
  if (rootField === 'refundApproval') {
    const refundApprovalId =
      Number(variables.refundApprovalId) || Number(variables.id)

    const studentPaymentId = Number(variables.studentPaymentId)
    const refundApproval = Boolean(variables.refundApproval)
    const refundApprovalDate = toTimestampString(variables.refundApprovalDate)

    let mutationOk = false

    updateStudentDb(db => {
      const targetPayment = db.payments.find(p => p.id === studentPaymentId)
      const targetDetail = targetPayment?.paymentDetail?.find(
        d => d.id === refundApprovalId,
      )

      if (!targetPayment || !targetDetail) {
        mutationOk = false
        return
      }

      targetDetail.refundApproval = refundApproval
      targetDetail.refundApprovalDate = refundApproval
        ? refundApprovalDate
        : null
      targetDetail.refundManager = refundApproval ? '직원' : null
      targetDetail.lastModifiedTime = String(Date.now())

      const refundAmount =
        targetDetail.cashOrCard === '카드'
          ? Number(targetDetail.amountPayment ?? 0)
          : Number(targetDetail.depositAmount ?? 0)

      if (refundApproval) {
        const exists = db.refundCompleted.find(
          item => item.paymentDetailId === targetDetail.id,
        )

        if (!exists) {
          db.refundCompleted.push({
            id: db.refundSeq++,
            paymentId: targetPayment.id,
            paymentDetailId: targetDetail.id,
            studentId: targetPayment.studentId,
            studentName: targetDetail.stName,
            refundAmount,
            approvedAt: refundApprovalDate,
            branchId: targetPayment.branchId,
          })
        }

        db.refundRequests = db.refundRequests.filter(
          item => item.paymentDetailId !== targetDetail.id,
        )
      } else {
        db.refundCompleted = db.refundCompleted.filter(
          item => item.paymentDetailId !== targetDetail.id,
        )

        const exists = db.refundRequests.find(
          item => item.paymentDetailId === targetDetail.id,
        )

        if (!exists) {
          db.refundRequests.push({
            id: db.refundSeq++,
            paymentId: targetPayment.id,
            paymentDetailId: targetDetail.id,
            studentId: targetPayment.studentId,
            studentName: targetDetail.stName,
            refundAmount,
            requestedAt: String(Date.now()),
            branchId: targetPayment.branchId,
          })
        }
      }

      mutationOk = true
    })

    return HttpResponse.json({
      data: {
        refundApproval: {
          __typename: 'MutationOutput',
          ok: mutationOk,
          message: mutationOk
            ? '환불 승인 상태 변경 완료'
            : '환불 대상을 찾을 수 없습니다.',
          error: mutationOk ? null : 'NOT_FOUND',
        },
      },
    })
  }

  // 5) 수납액 / 미수납액 수정
  if (rootField === 'editStudentPayment') {
    const editStudentPaymentId =
      Number(variables.editStudentPaymentId) || Number(variables.id)

    const amountReceived = Number(variables.amountReceived ?? 0)

    let mutationOk = false

    updateStudentDb(db => {
      const payment = db.payments.find(item => item.id === editStudentPaymentId)

      if (!payment) {
        mutationOk = false
        return
      }

      payment.amountReceived = amountReceived
      payment.unCollectedAmount = Math.max(
        0,
        Number(payment.actualAmount ?? 0) - amountReceived,
      )
      payment.updatedAt = String(Date.now())
      payment.lastModifiedTime = String(Date.now())

      if (payment.paymentDetail?.length) {
        payment.paymentDetail = payment.paymentDetail.map(detail => ({
          ...detail,
          studentPayment: {
            ...(detail.studentPayment ?? { id: payment.id }),
            id: payment.id,
            subjectId: payment.subjectId ?? null,
            processingManagerId: payment.processingManagerId ?? null,
            amountReceived,
            subject: {
              round: payment.subject?.round ?? null,
              subjectName: payment.subject?.subjectName ?? '',
            },
          },
        }))
      }

      mutationOk = true
    })

    return HttpResponse.json({
      data: {
        editStudentPayment: {
          __typename: 'MutationOutput',
          ok: mutationOk,
          message: mutationOk
            ? '수납액 수정 완료'
            : '수강결제 정보를 찾을 수 없습니다.',
          error: mutationOk ? null : 'NOT_FOUND',
        },
      },
    })
  }

  // 6) 매출내역
  if (rootField === 'getHourlySalesData') {
    const dateRange = Array.isArray(variables.date) ? variables.date : []

    const start = dateRange[0]
      ? new Date(dateRange[0])
      : new Date(new Date().setHours(0, 0, 0, 0))

    const end = dateRange[1]
      ? new Date(dateRange[1])
      : new Date(new Date().setHours(23, 59, 59, 999))

    const rows = getAllPaymentDetails()
      .filter(item => {
        const dateValue =
          item.refundApproval && item.refundApprovalDate
            ? new Date(Number(item.refundApprovalDate)).getTime()
            : item.paymentDate
              ? new Date(Number(item.paymentDate)).getTime()
              : 0

        return dateValue >= start.getTime() && dateValue <= end.getTime()
      })
      .flatMap(item => {
        const paymentDate = item.paymentDate
          ? new Date(Number(item.paymentDate))
          : null

        const refundDate = item.refundApprovalDate
          ? new Date(Number(item.refundApprovalDate))
          : null

        const paymentAmount =
          item.cashOrCard === '카드'
            ? Number(item.amountPayment ?? 0)
            : Number(item.depositAmount ?? 0)

        const paymentRow =
          paymentDate && paymentAmount > 0
            ? [
                {
                  nowDate: String(paymentDate.getTime()),
                  currentState: '결제',
                  cashOrCard: item.cashOrCard,
                  amount: paymentAmount,
                },
              ]
            : []

        const refundAmount = item.refundApproval
          ? item.cashOrCard === '카드'
            ? Number(item.amountPayment ?? 0)
            : Number(item.depositAmount ?? 0)
          : 0

        const refundRow =
          refundDate && refundAmount > 0
            ? [
                {
                  nowDate: String(refundDate.getTime()),
                  currentState: '환불',
                  cashOrCard: item.cashOrCard,
                  amount: refundAmount,
                },
              ]
            : []

        return [...paymentRow, ...refundRow]
      })

    const thisTimeAmountTotal = rows
      .filter(item => item.currentState === '결제')
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const thisTimeRefundTotal = rows
      .filter(item => item.currentState === '환불')
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const hourlyTotalCard = rows
      .filter(
        item => item.currentState === '결제' && item.cashOrCard === '카드',
      )
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const hourlyTotalCash = rows
      .filter(
        item => item.currentState === '결제' && item.cashOrCard === '현금',
      )
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const hourlyTotalCardRefund = rows
      .filter(
        item => item.currentState === '환불' && item.cashOrCard === '카드',
      )
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const hourlyTotalCashRefund = rows
      .filter(
        item => item.currentState === '환불' && item.cashOrCard === '현금',
      )
      .reduce((sum, item) => sum + Number(item.amount), 0)

    return HttpResponse.json({
      data: {
        getHourlySalesData: {
          __typename: 'HourlySalesOutput',
          hourlyDetails: rows,
          thisTimeRefundTotal,
          thisTimeRealTotal: thisTimeAmountTotal - thisTimeRefundTotal,
          thisTimeAmountTotal,
          hourlyTotalCashRefund,
          hourlyTotalCash,
          hourlyTotalCardRefund,
          hourlyTotalCard,
        },
      },
    })
  }

  // 7) 결제 상세 생성
  if (rootField === 'createPaymentDetail') {
    const studentPaymentId = Number(variables.studentPaymentId)
    const receiverId = Number(variables.receiverId)
    const isCard = variables.cashOrCard === '카드'

    const amount = isCard
      ? Number(variables.amountPayment ?? 0)
      : Number(variables.depositAmount ?? 0)

    let mutationOk = false
    let message = '결제가 추가되었습니다.'

    updateStudentDb(db => {
      const payment = db.payments.find(p => p.id === studentPaymentId)

      if (!payment) {
        mutationOk = false
        message = '수강결제 정보 없음'
        return
      }

      if (amount > Number(payment.unCollectedAmount ?? 0)) {
        mutationOk = false
        message = '미 수납액보다 큼'
        return
      }

      const newId = db.paymentDetailSeq++
      const now = String(Date.now())
      const normalizedPaymentDate = toTimestampString(variables.paymentDate)

      const newDetail = {
        __typename: 'PaymentDetail' as const,
        id: newId,
        studentPaymentId,
        studentId: payment.studentId,
        stName: payment.student?.name ?? '',
        cashOrCard: variables.cashOrCard as '현금' | '카드',

        paymentDate: normalizedPaymentDate,
        createdAt: now,
        lastModifiedTime: now,

        reqRefund: false,
        reqRefundDate: null,
        reqRefundManager: null,

        refundApproval: false,
        refundApprovalDate: null,
        refundManager: null,

        accountingManager: '직원',

        receiverId,
        receiver: {
          __typename: 'ManageUser' as const,
          id: receiverId,
          mUserId: 'general',
          mUsername: '직원',
        },

        depositAmount: isCard ? null : amount,
        bankName: isCard ? null : (variables.bankName ?? null),
        depositorName: isCard ? null : (variables.depositorName ?? null),
        depositDate: isCard ? null : normalizedPaymentDate,
        cashReceipts: isCard ? null : (variables.cashReceipts ?? null),

        amountPayment: isCard ? amount : null,
        ApprovalNum: isCard ? (variables.approvalNum ?? null) : null,
        cardCompany: isCard ? (variables.cardCompany ?? null) : null,
        cardNum: isCard ? (variables.cardNum ?? null) : null,
        installment: isCard ? Number(variables.installment ?? 0) : null,

        studentPayment: {
          id: payment.id,
          subjectId: payment.subjectId ?? null,
          processingManagerId: payment.processingManagerId ?? null,
          amountReceived: payment.amountReceived ?? 0,
          subject: {
            round: payment.subject?.round ?? null,
            subjectName: payment.subject?.subjectName ?? '',
          },
        },
      }

      if (!payment.paymentDetail) {
        payment.paymentDetail = []
      }

      payment.paymentDetail.push(newDetail)

      if (isCard) {
        payment.cardAmount = Number(payment.cardAmount ?? 0) + amount
      } else {
        payment.cashAmount = Number(payment.cashAmount ?? 0) + amount
      }

      payment.updatedAt = now
      payment.lastModifiedTime = now

      mutationOk = true
    })

    return HttpResponse.json({
      data: {
        createPaymentDetail: {
          __typename: 'MutationOutput',
          ok: mutationOk,
          message,
          error: mutationOk ? null : 'BAD_REQUEST',
        },
      },
    })
  }

  // 8) 결제 상세 수정
  if (rootField === 'editPaymentDetail') {
    const editPaymentDetailId =
      Number(variables.editPaymentDetailId) || Number(variables.id)

    const studentPaymentId = Number(variables.studentPaymentId)
    const receiverId = Number(variables.receiverId)
    const isCard = variables.cashOrCard === '카드'
    const normalizedPaymentDate = toTimestampString(variables.paymentDate)

    let mutationOk = false
    let message = '결제 수정 완료'

    updateStudentDb(db => {
      const payment = db.payments.find(p => p.id === studentPaymentId)

      if (!payment || !payment.paymentDetail?.length) {
        mutationOk = false
        message = '수강결제 정보 없음'
        return
      }

      const detailIndex = payment.paymentDetail.findIndex(
        d => d.id === editPaymentDetailId,
      )

      if (detailIndex === -1) {
        mutationOk = false
        message = '결제 상세 정보 없음'
        return
      }

      const targetDetail = payment.paymentDetail[detailIndex]

      const prevAmount =
        targetDetail.cashOrCard === '카드'
          ? Number(targetDetail.amountPayment ?? 0)
          : Number(targetDetail.depositAmount ?? 0)

      const nextAmount = isCard
        ? Number(variables.amountPayment ?? 0)
        : Number(variables.depositAmount ?? 0)

      const currentAmountReceived = Number(payment.amountReceived ?? 0)
      const maxAllowed = Number(payment.actualAmount ?? 0)

      const nextTotalAmountReceived =
        currentAmountReceived - prevAmount + nextAmount

      if (nextTotalAmountReceived > maxAllowed) {
        mutationOk = false
        message = '미 수납액보다 큽니다.'
        return
      }

      payment.paymentDetail[detailIndex] = {
        ...targetDetail,
        __typename: 'PaymentDetail' as const,
        cashOrCard: variables.cashOrCard as '현금' | '카드',

        paymentDate: normalizedPaymentDate,
        lastModifiedTime: toTimestampString(variables.lastModifiedTime),

        receiverId,
        receiver: {
          __typename: 'ManageUser' as const,
          id: receiverId,
          mUserId: 'general',
          mUsername: '직원',
        },

        accountingManager: '직원',

        amountPayment: isCard ? nextAmount : null,
        cardCompany: isCard ? (variables.cardCompany ?? null) : null,
        cardNum: isCard ? (variables.cardNum ?? null) : null,
        installment: isCard ? Number(variables.installment ?? 0) : null,
        ApprovalNum: isCard ? (variables.approvalNum ?? null) : null,

        depositAmount: isCard ? null : nextAmount,
        bankName: isCard ? null : (variables.bankName ?? null),
        depositorName: isCard ? null : (variables.depositorName ?? null),
        depositDate: isCard ? null : normalizedPaymentDate,
        cashReceipts: isCard ? null : (variables.cashReceipts ?? null),

        studentPayment: {
          id: payment.id,
          subjectId: payment.subjectId ?? null,
          processingManagerId: payment.processingManagerId ?? null,
          amountReceived: payment.amountReceived ?? 0,
          subject: {
            round: payment.subject?.round ?? null,
            subjectName: payment.subject?.subjectName ?? '',
          },
        },
      }

      if (targetDetail.cashOrCard === '카드') {
        payment.cardAmount = Math.max(
          0,
          Number(payment.cardAmount ?? 0) - prevAmount,
        )
      } else {
        payment.cashAmount = Math.max(
          0,
          Number(payment.cashAmount ?? 0) - prevAmount,
        )
      }

      if (isCard) {
        payment.cardAmount = Number(payment.cardAmount ?? 0) + nextAmount
      } else {
        payment.cashAmount = Number(payment.cashAmount ?? 0) + nextAmount
      }

      payment.updatedAt = String(Date.now())
      payment.lastModifiedTime = String(Date.now())

      mutationOk = true
    })

    return HttpResponse.json({
      data: {
        editPaymentDetail: {
          __typename: 'MutationOutput',
          ok: mutationOk,
          message,
          error: mutationOk ? null : 'BAD_REQUEST',
        },
      },
    })
  }

  return
}

export const accountingHandlers = [http.post('*/graphql', accountingHandler)]
