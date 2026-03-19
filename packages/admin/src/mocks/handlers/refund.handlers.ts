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

function getRootField(query?: string) {
  if (typeof query !== 'string') return undefined
  return query.replace(/\s+/g, ' ').match(/\{\s*(\w+)/)?.[1]
}

const reqRefundHandler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody
  const rootField = getRootField(body.query)

  if (rootField !== 'reqRefund') return

  const reqRefundId =
    Number(body.variables?.reqRefundId) || Number(body.variables?.id)
  const reqRefund = Boolean(body.variables?.reqRefund)
  const reqRefundDateRaw = body.variables?.reqRefundDate

  let mutationOk = false

  updateStudentDb(db => {
    let targetPayment: (typeof db.payments)[number] | undefined
    let targetDetail:
      | NonNullable<(typeof db.payments)[number]['paymentDetail']>[number]
      | undefined

    for (const payment of db.payments) {
      const foundDetail = payment.paymentDetail?.find(
        detail => detail.id === reqRefundId,
      )
      if (foundDetail) {
        targetPayment = payment
        targetDetail = foundDetail
        break
      }
    }

    if (!targetPayment || !targetDetail) {
      mutationOk = false
      return
    }

    const requestedAt =
      reqRefundDateRaw instanceof Date
        ? reqRefundDateRaw.toISOString()
        : reqRefundDateRaw
          ? String(reqRefundDateRaw)
          : new Date().toISOString()

    targetDetail.reqRefund = reqRefund
    targetDetail.reqRefundDate = reqRefund ? requestedAt : null
    targetDetail.reqRefundManager = reqRefund ? '직원' : null
    targetDetail.lastModifiedTime = String(Date.now())

    const refundAmount =
      targetDetail.cashOrCard === '현금'
        ? Number(targetDetail.depositAmount ?? 0)
        : Number(targetDetail.amountPayment ?? 0)

    if (reqRefund) {
      const exists = db.refundRequests.find(
        item => item.paymentDetailId === targetDetail!.id,
      )

      if (!exists) {
        db.refundRequests.push({
          id: db.refundSeq++,
          paymentId: targetPayment.id,
          paymentDetailId: targetDetail.id,
          studentId: targetPayment.studentId,
          studentName: targetDetail.stName ?? targetPayment.student?.name ?? '',
          refundAmount,
          requestedAt,
          branchId: targetPayment.branchId,
        })
      }
    } else {
      db.refundRequests = db.refundRequests.filter(
        item => item.paymentDetailId !== targetDetail!.id,
      )
    }

    mutationOk = true
  })

  return HttpResponse.json({
    data: {
      reqRefund: {
        __typename: 'MutationOutput',
        ok: mutationOk,
        message: reqRefund
          ? '결제 취소 요청 되었습니다.'
          : '결제 취소 요청이 철회되었습니다.',
        error: mutationOk ? null : 'NOT_FOUND',
      },
    },
  })
}

export const refundHandlers = [http.post('*/graphql', reqRefundHandler)]
