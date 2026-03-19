import { http } from 'msw'
import { getRootField, type GqlBody } from '@/src/mocks/utils/listFactory'
import { createSearchHandler } from '@/src/mocks/utils/searchFactory'
import { STUDENT_STATE_ALL } from '@/src/mocks/data/studentState.data'
import { MANAGE_USER_ALL } from '@/src/mocks/data/manageUser.mock'

const toNum = (v: any) => {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? ''), 10)
  return Number.isFinite(n) ? n : 0
}

const searchResolvers: Record<string, (v?: Record<string, any>) => any> = {
  // ✅ 상담관리 검색(리스트/상세 둘 다 커버)
  // mutation searchStudentState(...) { studentState ... }
  searchStudentState: createSearchHandler({
    rootField: 'searchStudentState',
    listField: 'studentState',
    resultTypename: 'SearchStudentStateResult',
    itemTypename: 'StudentState',
    all: STUDENT_STATE_ALL,

    // 정렬: createdAt 최신순(너 원하면 제거)
    sort: (a: any, b: any) => toNum(b.createdAt) - toNum(a.createdAt),

    filter: (item: any, v) => {
      const vars = v ?? {}

      if (
        vars.searchStudentStateId != null &&
        item.id !== vars.searchStudentStateId
      )
        return false
      if (vars.receiptDiv && item.receiptDiv !== vars.receiptDiv) return false
      if (vars.subDiv && item.subDiv !== vars.subDiv) return false
      if (vars.pic && item.pic !== vars.pic) return false

      if (
        vars.phoneNum1 &&
        !String(item.phoneNum1 ?? '').includes(vars.phoneNum1)
      )
        return false
      if (vars.stName && !String(item.stName ?? '').includes(vars.stName))
        return false

      if (vars.adviceType) {
        const ok = (item.adviceTypes ?? []).some((a: any) =>
          String(a?.type ?? '').includes(vars.adviceType),
        )
        if (!ok) return false
      }

      if (vars.progress?.length) {
        const set = new Set(vars.progress)
        if (!set.has(Number(item.progress))) return false
      }

      // createdAt/stVisit range는 너 변수 스펙 확정되면 여기 추가하면 됨
      return true
    },
  }),

  searchManageUser: createSearchHandler({
    rootField: 'searchManageUser',
    listField: 'data', // ✅ 중요: 응답 리스트 키가 data
    resultTypename: 'SearchManageUserResult',
    itemTypename: 'ManageUser',
    all: MANAGE_USER_ALL,

    // 정렬: id 오름차순(원하면 변경)
    sort: (a: any, b: any) => toNum(a.id) - toNum(b.id),

    filter: (item: any, v) => {
      const vars = v ?? {}

      // ✅ 퇴사 여부
      if (vars.resign && String(item.resign ?? '') !== String(vars.resign))
        return false

      // ✅ id (쿼리 변수명이 searchManageUserId)
      if (
        vars.searchManageUserId != null &&
        toNum(item.id) !== toNum(vars.searchManageUserId)
      )
        return false

      // ✅ grade
      if (vars.mGrade != null && toNum(item.mGrade) !== toNum(vars.mGrade))
        return false

      // ✅ rank
      if (vars.mRank && String(item.mRank ?? '') !== String(vars.mRank))
        return false

      // ✅ userId / username / phone
      if (
        vars.mUserId &&
        !String(item.mUserId ?? '').includes(String(vars.mUserId))
      )
        return false
      if (
        vars.mUsername &&
        !String(item.mUsername ?? '').includes(String(vars.mUsername))
      )
        return false
      if (
        vars.mPhoneNum &&
        !String(item.mPhoneNum ?? '').includes(String(vars.mPhoneNum))
      )
        return false

      // ✅ part: 쿼리는 String 단일, 데이터는 string[]일 수 있음
      if (vars.mPart) {
        const parts = Array.isArray(item.mPart)
          ? item.mPart
          : item.mPart
            ? [item.mPart]
            : []
        const ok = parts.some((p: any) =>
          String(p ?? '').includes(String(vars.mPart)),
        )
        if (!ok) return false
      }

      // ✅ mJoiningDate range ([String])는 필요해지면 여기서 추가
      return true
    },
  }),
}

// =====================
// MSW handler (listFactory 스타일 그대로)
// =====================
const handler = async ({ request }: { request: Request }) => {
  const body = (await request.clone().json()) as GqlBody

  const rootField = getRootField(body.query)
  if (!rootField) return

  const resolver = searchResolvers[rootField]
  if (!resolver) return // ✅ 담당 아닌 요청이면 패스(중요!)

  return resolver(body.variables ?? {})
}

export const searchHandlers = [http.post('*/graphql', handler)]
