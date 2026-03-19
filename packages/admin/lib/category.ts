interface Category {
  id?: number
  href: string
  iconSrc?: string
  name: string
  children: Children[]
  resetItems?: string[]
  exposure: boolean
  isBreadcrumb?: boolean
  teacher?: boolean
}

interface Children {
  href: string
  name: string
  exposure: boolean
  isBreadcrumb: boolean
  teacher?: boolean
}

const category: Category[] = [
  {
    id: 0,
    href: '/',
    iconSrc: 'xi-home-o',
    name: '대시보드',
    exposure: true,
    isBreadcrumb: false,
    children: [],
  },
  {
    href: '/consult',
    iconSrc: 'xi-forum-o',
    name: '상담관리',
    resetItems: [
      'resetConsultPage',
      'resetConsultLimit',
      'resetConsultFilterActive',
      'resetConsultFilterSearch',
      'resetConsultFilter',
      'resetConsultFilterLimit',
    ],
    exposure: true,
    children: [
      {
        href: '/',
        name: '상담 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/detail',
        name: '상담 상세',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/write',
        name: '상담 등록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/registered',
        name: '등록완료 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/reject',
        name: '오류/거부 목록',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/subjects',
    iconSrc: 'xi-library-books-o',
    name: '과정관리',
    resetItems: [
      'resetSubjectPage',
      'resetSubjectFilterActive',
      'resetSubjectFilterSearch',
      'resetSubjectFilter',
    ],
    exposure: true,
    isBreadcrumb: true,
    children: [
      {
        href: '/detail',
        name: '과정 상세',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/write',
        name: '과정 등록',
        exposure: false,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/students',
    iconSrc: 'xi-user-address',
    name: '수강생관리',
    resetItems: [
      'resetStudentPage',
      'resetStudentFilterActive',
      'resetStudentFilterSearch',
      'resetStudentFilter',
    ],
    exposure: true,
    isBreadcrumb: true,
    children: [
      {
        href: '/',
        name: '수강생 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/nonassigned',
        name: '미배정 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/detail',
        name: '수강생 상세',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/write',
        name: '수강생 등록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/edit',
        name: '수강생 수정',
        exposure: false,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/lecture',
    iconSrc: 'xi-presentation',
    name: '강의관리',
    resetItems: [],
    exposure: true,
    isBreadcrumb: true,
    teacher: true,
    children: [
      {
        href: '/',
        name: '강의 목록',
        exposure: true,
        isBreadcrumb: true,
        teacher: true,
      },
      {
        href: '/detail',
        name: '강의 상세',
        exposure: false,
        isBreadcrumb: true,
        teacher: true,
      },
      {
        href: '/attendance',
        name: '출석부',
        exposure: false,
        isBreadcrumb: true,
        teacher: true,
      },
      {
        href: '/employment',
        name: '학적부 목록',
        exposure: true,
        isBreadcrumb: true,
        teacher: false,
      },
      {
        href: '/employmentDetail',
        name: '학적부 상세',
        exposure: false,
        isBreadcrumb: true,
        teacher: false,
      },
      {
        href: '/write',
        name: '강의 등록',
        exposure: false,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/accounting',
    iconSrc: 'xi-money',
    name: '회계관리',
    exposure: true,
    resetItems: [
      'resetPaymentPage',
      'resetPaymentFilterActive',
      'resetPaymentFilterSearch',
      'resetPaymentFilter',
      'resetPaymentDetailPage',
      'resetPaymentDetailFilterActive',
      'resetPaymentDetailFilterSearch',
      'resetPaymentDetailFilterPage',
      'resetPaymentDetailFilter',
      'resetRefundPage',
      'resetRefundFilterActive',
      'resetRefundFilterSearch',
      'resetRefundFilter',
      'resetReqRefundPage',
      'resetReqRefundFilterActive',
      'resetReqRefundFilterSearch',
      'resetReqRefundFilter',
    ],
    children: [
      {
        href: '/',
        name: '결제 내역',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/outstanding',
        name: '미수금 내역',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/request',
        name: '환불 신청 내역',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/refund',
        name: '환불 완료 내역',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/sales',
        name: '매출 내역',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/statistics',
    iconSrc: 'xi-chart-line',
    name: '통계',
    exposure: true,
    resetItems: [
      'resetParformanceFilterActiveState',
      'resetParformanceFilterState',
      'resetParformanceSearchState',
      'resetRecruitmentFilterActiveState',
      'resetRecruitmentPageState',
      'resetRecruitmentFilterState',
      'resetRecruitmentSearchState',
    ],
    children: [
      {
        href: '/',
        name: '영업 성과',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/hr',
    iconSrc: 'xi-users-o',
    name: '인사관리',
    resetItems: [],
    exposure: true,
    isBreadcrumb: true,
    children: [
      {
        href: '/',
        name: '직원 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/detail',
        name: '직원 상세',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/write',
        name: '직원 등록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/teacher',
        name: '강사 목록',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/teacherDetail',
        name: '강사 상세',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/teacherWrite',
        name: '강사 등록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/timesheet',
        name: '출근 기록',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/message',
    iconSrc: 'xi-mail-o',
    name: '메시지',
    resetItems: [],
    exposure: true,
    children: [
      {
        href: '/',
        name: '받은요청 목록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/request',
        name: '보낸요청 목록',
        exposure: false,
        isBreadcrumb: true,
      },
      {
        href: '/sms',
        name: '문자발송',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/setting',
    iconSrc: 'xi-cog',
    name: '환경설정',
    resetItems: [],
    exposure: true,
    children: [
      {
        href: '/types',
        name: '분야관리',
        exposure: true,
        isBreadcrumb: true,
      },
      {
        href: '/permissions',
        name: '권한설정',
        exposure: true,
        isBreadcrumb: true,
      },
    ],
  },
  {
    href: '/member',
    iconSrc: '',
    name: '프로필',
    exposure: false,
    isBreadcrumb: true,
    children: [],
  },
]

export default category
