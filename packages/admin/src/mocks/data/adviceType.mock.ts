export const ADVICE_CATEGORIES = {
  RECEIVE: '접수구분',
  COURSE: '수강구분',
  COUNSEL: '상담분야',
} as const

export const adviceTypeMockData = [
  // =====================
  // 접수구분
  // =====================
  {
    __typename: 'AdviceType',
    id: 1,
    category: ADVICE_CATEGORIES.RECEIVE,
    indexNum: 1,
    onOff: 'Y',
    type: '카카오톡',
  },
  {
    __typename: 'AdviceType',
    id: 2,
    category: ADVICE_CATEGORIES.RECEIVE,
    indexNum: 2,
    onOff: 'Y',
    type: '네이버',
  },
  {
    __typename: 'AdviceType',
    id: 3,
    category: ADVICE_CATEGORIES.RECEIVE,
    indexNum: 3,
    onOff: 'Y',
    type: '홈페이지',
  },
  {
    __typename: 'AdviceType',
    id: 4,
    category: ADVICE_CATEGORIES.RECEIVE,
    indexNum: 4,
    onOff: 'Y',
    type: '인스타',
  },
  {
    __typename: 'AdviceType',
    id: 5,
    category: ADVICE_CATEGORIES.RECEIVE,
    indexNum: 5,
    onOff: 'Y',
    type: '국비',
  },

  // =====================
  // 수강구분
  // =====================
  {
    __typename: 'AdviceType',
    id: 6,
    category: ADVICE_CATEGORIES.COURSE,
    indexNum: 1,
    onOff: 'Y',
    type: '국비',
  },
  {
    __typename: 'AdviceType',
    id: 7,
    category: ADVICE_CATEGORIES.COURSE,
    indexNum: 2,
    onOff: 'Y',
    type: '일반',
  },
  {
    __typename: 'AdviceType',
    id: 8,
    category: ADVICE_CATEGORIES.COURSE,
    indexNum: 3,
    onOff: 'Y',
    type: '기업',
  },

  // =====================
  // 상담분야
  // =====================
  {
    __typename: 'AdviceType',
    id: 9,
    category: ADVICE_CATEGORIES.COUNSEL,
    indexNum: 1,
    onOff: 'Y',
    type: '프론트엔드',
  },
  {
    __typename: 'AdviceType',
    id: 10,
    category: ADVICE_CATEGORIES.COUNSEL,
    indexNum: 2,
    onOff: 'Y',
    type: '백엔드',
  },
  {
    __typename: 'AdviceType',
    id: 11,
    category: ADVICE_CATEGORIES.COUNSEL,
    indexNum: 3,
    onOff: 'Y',
    type: '데이터',
  },
  {
    __typename: 'AdviceType',
    id: 12,
    category: ADVICE_CATEGORIES.COUNSEL,
    indexNum: 4,
    onOff: 'Y',
    type: 'AI',
  },
  {
    __typename: 'AdviceType',
    id: 13,
    category: ADVICE_CATEGORIES.COUNSEL,
    indexNum: 5,
    onOff: 'Y',
    type: '디자인',
  },
]
