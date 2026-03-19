import { atom } from 'recoil'

// screen
export const isScreenState = atom<boolean>({
  key: 'isScreenState',
  default: false,
})

// GNB
export const navSubCateState = atom({
  key: 'navSubCate',
  default: false,
})

export const navScrollPositionState = atom({
  key: 'navScrollPosition',
  default: 0,
})

export const navOpenState = atom<boolean>({
  key: 'navOpenState',
  default: false,
})

export const newStudentState = atom<boolean>({
  key: 'newStudent',
  default: false,
})

export const categoryMenuState = atom<{}>({
  key: 'categoryMenuState',
  default: {
    상담관리: true,
    강의관리: true,
    수강생관리: true,
    회계관리: true,
    통계: true,
    인사관리: true,
    메시지: true,
    환경설정: true,
  },
})

export const activeCategoryState = atom<number>({
  key: 'activeCategoryState',
  default: 0,
})

export const alarmsTotalState = atom<number>({
  key: 'alarmsTotal',
  default: 0,
})

//Login
export const loginIdFocuseState = atom<boolean>({
  key: 'loginIdFocuseState',
  default: false,
})

export const loginPasswordFocuseState = atom<boolean>({
  key: 'loginPasswordFocuseState',
  default: false,
})

export const userGraderState = atom<number>({
  key: 'userGraderState',
  default: 99,
})

export const assignmentState = atom({
  key: 'assignmentState',
  default: {
    assignment: '배정',
    unassigned: '미배정',
    withdrawal: '수강철회',
  },
})

export const completionStatus = atom({
  key: 'completionStatus',
  default: {
    completed: '수료',
    notCompleted: '미수료',
    dropout: '중도포기',
    inTraining: '훈련중',
    notAttended: '미참여',
  },
})

export const employmentStatus = atom({
  key: 'employmentStatus',
  default: {
    employed: '취업',
    unemployed: '미취업',
    startup: '창업',
  },
})

//grade
export const gradeState = atom({
  key: 'gradeState',
  default: {
    dev: 0,
    master: 1,
    subMaster: 2,
    general: 9,
    teacher: 99,
    guest: 999,
  },
})

//Button
export const ripplesState = atom({
  key: 'ripplesState',
  default: [] as { id: number; size: number; x: number; y: number }[],
})

export const progressStatusState = atom({
  key: 'progressStatus',
  default: {
    0: {
      name: '접수대기',
      color: '#c40403',
    },
    10: {
      name: '가망고객',
      color: '#ff8d4a',
    },
    20: {
      name: '방문예정',
      color: '#c9ab00',
    },
    30: {
      name: '방문완료',
      color: '#7dce00',
    },
    40: {
      name: '등록예정',
      color: '#0eacab',
    },
    50: {
      name: '미납고객',
      color: '#0070ad',
    },
    60: {
      name: '등록완료',
      color: '#043999',
    },
    70: {
      name: '장기가망',
      color: '#be058e',
    },
    110: {
      name: '오류/거부',
      color: '#cdcdcd',
    },
    999: {
      name: '미처리',
      color: '#FF5900',
    },
    // 60,110 고정
  },
})

export const studentProgressStatusState = atom({
  key: 'studentProgressStatus',
  default: {
    0: {
      name: '신규',
      color: '#c40403',
    },
    10: {
      name: '미배정',
      color: '#FF5900',
    },
    20: {
      name: '배정완료',
      color: '#7dce00',
    },
    30: {
      name: '이수자',
      color: '#0eacab',
    },
    40: {
      name: '중도포기',
      color: '#7a0075',
    },
  },
})

export const additionalAmountState = atom({
  key: 'additionalAmount',
  default: {
    basic: 1.2,
    frist: 1.5,
  },
})

export const cardNameState = atom({
  key: 'cardName',
  default: {
    0: '카드사 선택',
    1: '온라인입금',
    2: '신한카드',
    3: 'NH카드',
    4: 'KB카드',
    5: '우리카드',
    6: '현대카드',
    7: '롯데카드',
    8: '삼성카드',
    9: '비씨카드',
    10: '외환카드',
    11: '하나카드',
    12: '광주카드',
    13: '전북카드',
    14: '국민엘지유플러스',
    15: '신한엘지유플러스',
    16: '삼성엘지유플러스',
    17: '현대엘지유플러스',
    18: '롯데엘지유플러스',
    19: '외환엘지유플러스',
    20: '비씨엘지유플러스',
    21: '엘지유플러스계좌이체',
    22: '카카오페이',
    23: '페이나우',
    24: 'NH엘지유플러스',
    25: '하나엘지유플러스',
    26: '우리엘지유플러스',
  },
})

export const bankNameState = atom({
  key: 'bankName',
  default: {
    0: '은행 선택',
    1: '직접납부',
    2: '신한은행',
    3: 'KB은행',
    4: '농협',
    5: '제일은행',
    6: '하나은행',
    7: '광주은행',
    8: '기업은행',
    9: '우리은행',
    10: '카카오뱅크',
  },
})

// SMS data
export const attendanceSMSState = atom<boolean>({
  key: 'attendanceSMS',
  default: false,
})
export const attendanceSelectedStudentState = atom<[]>({
  key: 'attendanceSelectedStudent',
  default: [],
})

//filter
export const consultFilterActiveState = atom<boolean>({
  key: 'consultFilterActive',
  default: false,
})
export const consultPageState = atom<number>({
  key: 'consultPage',
  default: 1,
})
export const consultLimitState = atom<number>({
  key: 'consultLimit',
  default: 10,
})
export const consultFilterState = atom<boolean>({
  key: 'consultFilter',
  default: false,
})
export const consultFilterLimitState = atom<number>({
  key: 'consultFilterLimit',
  default: 10,
})
export const consultSearchState = atom({
  key: 'consultSearch',
  default: {} as {
    receiptDiv: string
    subDiv: string
    pic: string
    createdAt: []
    stVisit: []
    stName: string
    progress: number
    phoneNum1: string
    adviceType: []
  },
})
export const consultManagerSearchState = atom({
  key: 'consultManagerSearch',
  default: {} as {
    receiptDiv: string
    subDiv: string
    createdAt: []
    stVisit: []
    stName: string
    progress: number
    phoneNum1: string
    adviceType: []
  },
})
export const subjectFilterActiveState = atom<boolean>({
  key: 'subjectFilterActive',
  default: false,
})
export const subjectPageState = atom<number>({
  key: 'subjectPage',
  default: 1,
})
export const subjectFilterState = atom<boolean>({
  key: 'subjectFilter',
  default: false,
})
export const subjectSearchState = atom({
  key: 'subjectSearch',
  default: {} as {
    subjectName: string
    subDiv: string
    exposure: boolean
  },
})

export const studentFilterActiveState = atom<boolean>({
  key: 'subjectFilterActive',
  default: false,
})
export const studentPageState = atom<number>({
  key: 'studentPage',
  default: 1,
})
export const studentFilterState = atom<boolean>({
  key: 'studentFilter',
  default: false,
})

export const studentSearchState = atom({
  key: 'studentSearch',
  default: {} as {
    studentName: string
    phoneNum: string
    birthday: string
    createdAt: string
  },
})
export const paymentDetailFilterActiveState = atom<boolean>({
  key: 'paymentDetailFilterActive',
  default: true,
})
export const paymentDetailPageState = atom<number>({
  key: 'paymentDetailPage',
  default: 1,
})
export const paymentDetailFilterState = atom<boolean>({
  key: 'paymentDetailFilter',
  default: false,
})
export const paymentDetailFilterPageState = atom<number>({
  key: 'paymentDetailFilterPage',
  default: 1,
})
export const paymentDetailSearchState = atom({
  key: 'paymentSearch',
  default: {} as {
    paymentDate: []
    stName: string
    approvalNum: string
  },
})
export const paymentFilterActiveState = atom<boolean>({
  key: 'paymentFilterActive',
  default: true,
})
export const paymentPageState = atom<number>({
  key: 'paymentPage',
  default: 1,
})
export const paymentFilterState = atom<boolean>({
  key: 'paymentFilter',
  default: false,
})
export const paymentSearchState = atom({
  key: 'paymentSearch',
  default: {} as {
    period: []
    studentName: string
  },
})
export const refundFilterActiveState = atom<boolean>({
  key: 'refundFilterActive',
  default: true,
})
export const refundPageState = atom<number>({
  key: 'refundPage',
  default: 1,
})
export const refundFilterState = atom<boolean>({
  key: 'refundFilter',
  default: false,
})
export const refundSearchState = atom({
  key: 'refundSearch',
  default: {} as {
    createdAt: []
    stName: string
  },
})
export const reqRefundFilterActiveState = atom<boolean>({
  key: 'reqRefundFilterActive',
  default: true,
})
export const reqRefundPageState = atom<number>({
  key: 'reqRefundPage',
  default: 1,
})
export const reqRefundFilterState = atom<boolean>({
  key: 'reqRefundFilter',
  default: false,
})
export const reqRefundSearchState = atom({
  key: 'reqRefundSearch',
  default: {} as {
    createdAt: []
    stName: string
  },
})

export const parformanceFilterActiveState = atom<boolean>({
  key: 'parformanceFilterActive',
  default: false,
})
export const parformanceFilterState = atom<boolean>({
  key: 'parformanceFilter',
  default: false,
})
export const parformanceSearchState = atom({
  key: 'parformanceSearch',
  default: {} as {
    period: [string]
    processingManagerId: [number]
  },
})
export const recruitmentFilterActiveState = atom<boolean>({
  key: 'recruitmentFilterActive',
  default: false,
})
export const recruitmentPageState = atom<number>({
  key: 'recruitmentPage',
  default: 1,
})
export const recruitmentFilterState = atom<boolean>({
  key: 'recruitmentFilter',
  default: false,
})
export const recruitmentSearchState = atom({
  key: 'recruitmentSearch',
  default: {} as {
    subjectName: string
  },
})

export const smsPageState = atom<number>({
  key: 'smsPage',
  default: 1,
})
export const smsFilterState = atom<boolean>({
  key: 'smsFilter',
  default: false,
})
export const smsSearchState = atom({
  key: 'smsSearch',
  default: {} as {
    receiver: string
  },
})
