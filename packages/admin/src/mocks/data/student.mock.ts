export type MockStudent = {
  __typename?: 'Student'
  id: number
  name: string
  phone: string
  phoneNum1?: string
  birthday?: string | null
  writer?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  lastModifiedTime?: string | null
  branchId: number
}

export type MockLectureTeacher = {
  __typename?: 'ManageUser'
  mUsername: string
}

export type MockLecture = {
  __typename?: 'Lecture'
  id: number
  sessionNum: number
  temporaryName: string
  lecturePeriodStart: string
  lecturePeriodEnd: string
  lectureTime: [string, string]
  roomNum: string
  teachers: MockLectureTeacher[]
}

export type MockSubject = {
  __typename?: 'Subject'
  id: number
  subjectCode: string
  subjectName: string
  subDiv: string
  round?: number | string | null
  fee?: number | null
  lastModifiedTime?: string | null
  lectures?: MockLecture | null
}

export type MockManageUserLite = {
  __typename?: 'ManageUser'
  id: number
  mUserId: string
  mUsername: string
}

export type MockPaymentDetail = {
  __typename?: 'PaymentDetail'
  id: number
  studentPaymentId: number
  studentId: number
  stName: string
  cashOrCard: '현금' | '카드'
  paymentDate: string | null
  createdAt?: string | null
  lastModifiedTime?: string | null

  reqRefund: boolean
  reqRefundDate?: string | null
  reqRefundManager?: string | null

  refundApproval: boolean
  refundApprovalDate?: string | null
  refundManager?: string | null

  accountingManager?: string | null

  receiverId?: number | null
  receiver?: MockManageUserLite | null

  depositAmount?: number | null
  bankName?: string | null
  depositorName?: string | null
  depositDate?: string | null
  cashReceipts?: string | null

  amountPayment?: number | null
  ApprovalNum?: string | null
  cardCompany?: string | null
  cardNum?: string | null
  installment?: number | null

  studentPayment?: {
    id: number
    subjectId?: number | null
    processingManagerId?: number | null
    amountReceived?: number | null
    subject?: {
      round?: number | string | null
      subjectName?: string
    } | null
  } | null
}

export type MockStudentPayment = {
  __typename?: 'StudentPayment'
  id: number
  studentId: number
  subjectId?: number | null
  processingManagerId?: number | null
  branchId: number
  campus?: string | null
  seScore?: number | null
  tuitionFee?: number | null
  dueDate?: string | null
  subDiv?: string | null
  amountReceived?: number | null
  situationReport?: boolean | null
  paymentDate?: string | null
  unCollectedAmount?: number | null
  actualAmount?: number | null
  discountAmount?: number | string | null
  isWeekend?: string | null
  lectureAssignment?: string | null
  courseComplete?: string | null
  employment?: string | null
  cardAmount?: number | null
  cashAmount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
  lastModifiedTime?: string | null
  lastModifiedByName?: string | null
  lastModifiedByUserId?: string | null
  student?: MockStudent | null
  subject?: MockSubject | null
  processingManager?: MockManageUserLite | null
  paymentDetail?: MockPaymentDetail[]
  receiptClassification?: unknown[]
  attendance?: unknown[]
  StudentConsultation?: unknown[]
  StudentPortfolio?: unknown[]
  PreInspection?: unknown[]
  HopeForEmployment?: unknown[]
  EmploymentStatus?: unknown[]
  EmploymentRecommendation?: unknown[]
  EduInfomation?: unknown[]
  Certificate?: unknown[]
  Career?: unknown[]
  Branch?: unknown | null
  dateOfDroppingOut?: string | null
  reasonFordroppingOut?: string | null
}

export type MockRefundRequest = {
  id: number
  paymentId: number
  paymentDetailId: number
  studentId: number
  studentName: string
  refundAmount: number
  requestedAt: string
  branchId: number
}

export type MockRefundCompleted = {
  id: number
  paymentId: number
  paymentDetailId: number
  studentId: number
  studentName: string
  refundAmount: number
  approvedAt: string
  branchId: number
}

type StudentMockDb = {
  students: MockStudent[]
  payments: MockStudentPayment[]
  refundRequests: MockRefundRequest[]
  refundCompleted: MockRefundCompleted[]
  paymentSeq: number
  paymentDetailSeq: number
  refundSeq: number
}

declare global {
  var __STUDENT_MOCK_DB__: StudentMockDb | undefined
}

const createStudentMockDb = (): StudentMockDb => {
  const now = Date.now()

  return {
    students: [
      {
        __typename: 'Student',
        id: 1,
        name: '김민지',
        phone: '01011111111',
        phoneNum1: '01011111111',
        birthday: '1995-03-10',
        writer: 'MSW',
        createdAt: String(now - 1000 * 60 * 60 * 24 * 30),
        updatedAt: String(now - 1000 * 60 * 60 * 24 * 2),
        lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 2),
        branchId: 1,
      },
      {
        __typename: 'Student',
        id: 2,
        name: '이서연',
        phone: '01022222222',
        phoneNum1: '01022222222',
        birthday: '1997-08-21',
        writer: 'MSW',
        createdAt: String(now - 1000 * 60 * 60 * 24 * 20),
        updatedAt: String(now - 1000 * 60 * 60 * 24 * 1),
        lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 1),
        branchId: 1,
      },
      {
        __typename: 'Student',
        id: 3,
        name: '박지훈',
        phone: '01033333333',
        phoneNum1: '01033333333',
        birthday: '1993-11-02',
        writer: 'MSW',
        createdAt: String(now - 1000 * 60 * 60 * 24 * 10),
        updatedAt: String(now - 1000 * 60 * 60 * 12),
        lastModifiedTime: String(now - 1000 * 60 * 60 * 12),
        branchId: 1,
      },
    ] as MockStudent[],

    payments: [
      {
        __typename: 'StudentPayment',
        id: 1,
        studentId: 1,
        subjectId: 101,
        processingManagerId: 2,
        branchId: 1,
        campus: '본원',
        seScore: 82,
        tuitionFee: 1200000,
        dueDate: String(now),
        subDiv: '국가기간',
        amountReceived: 700000,
        situationReport: true,
        paymentDate: String(now - 1000 * 60 * 60 * 24 * 5),
        unCollectedAmount: 300000,
        actualAmount: 1000000,
        discountAmount: 200000,
        isWeekend: 'N',
        lectureAssignment: '배정',
        courseComplete: '훈련중',
        employment: '미취업',
        cardAmount: 500000,
        cashAmount: 200000,
        createdAt: String(now - 1000 * 60 * 60 * 24 * 5),
        updatedAt: String(now - 1000 * 60 * 60 * 2),
        lastModifiedTime: String(now - 1000 * 60 * 60 * 2),
        lastModifiedByName: '직원',
        lastModifiedByUserId: 'general',
        processingManager: {
          __typename: 'ManageUser',
          id: 2,
          mUserId: 'general',
          mUsername: '직원',
        },
        student: {
          __typename: 'Student',
          id: 1,
          name: '김민지',
          phone: '01011111111',
          phoneNum1: '01011111111',
          birthday: '1995-03-10',
          writer: 'MSW',
          createdAt: String(now - 1000 * 60 * 60 * 24 * 30),
          updatedAt: String(now - 1000 * 60 * 60 * 24 * 2),
          lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 2),
          branchId: 1,
        },
        subject: {
          __typename: 'Subject',
          id: 101,
          subjectCode: 'SUB-101',
          subjectName: '프론트엔드 실무 과정',
          subDiv: '국가기간',
          round: 3,
          fee: 1200000,
          lastModifiedTime: String(now - 1000 * 60 * 60 * 24),
          lectures: {
            __typename: 'Lecture',
            id: 1001,
            sessionNum: 3,
            temporaryName: '프론트엔드 실무 3회차',
            lecturePeriodStart: String(now - 1000 * 60 * 60 * 24 * 30),
            lecturePeriodEnd: String(now + 1000 * 60 * 60 * 24 * 60),
            lectureTime: [
              new Date('2026-03-10T09:00:00').toISOString(),
              new Date('2026-03-10T17:30:00').toISOString(),
            ],
            roomNum: '301호',
            teachers: [{ __typename: 'ManageUser', mUsername: '강사' }],
          },
        },
        paymentDetail: [
          {
            __typename: 'PaymentDetail',
            id: 1,
            studentPaymentId: 1,
            studentId: 1,
            stName: '김민지',
            cashOrCard: '카드',
            paymentDate: String(now - 1000 * 60 * 60 * 24 * 4),
            createdAt: String(now - 1000 * 60 * 60 * 24 * 4),
            lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 4),
            reqRefund: false,
            reqRefundDate: null,
            reqRefundManager: null,
            refundApproval: false,
            refundApprovalDate: null,
            refundManager: null,
            accountingManager: '직원',
            receiverId: 2,
            receiver: {
              __typename: 'ManageUser',
              id: 2,
              mUserId: 'general',
              mUsername: '직원',
            },
            amountPayment: 500000,
            ApprovalNum: 'APPROVAL-0001',
            cardCompany: '신한카드',
            cardNum: '1234-****-****-5678',
            installment: 3,
            studentPayment: {
              id: 1,
              subjectId: 101,
              processingManagerId: 2,
              amountReceived: 700000,
              subject: {
                round: 3,
                subjectName: '프론트엔드 실무 과정',
              },
            },
          },
          {
            __typename: 'PaymentDetail',
            id: 2,
            studentPaymentId: 1,
            studentId: 1,
            stName: '김민지',
            cashOrCard: '현금',
            paymentDate: String(now - 1000 * 60 * 60 * 24 * 2),
            createdAt: String(now - 1000 * 60 * 60 * 24 * 2),
            lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 2),
            reqRefund: true,
            reqRefundDate: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
            reqRefundManager: '직원',
            refundApproval: false,
            refundApprovalDate: null,
            refundManager: null,
            accountingManager: '직원',
            receiverId: 2,
            receiver: {
              __typename: 'ManageUser',
              id: 2,
              mUserId: 'general',
              mUsername: '직원',
            },
            depositAmount: 200000,
            bankName: '국민은행',
            depositorName: '김민지',
            depositDate: String(now - 1000 * 60 * 60 * 24 * 2),
            cashReceipts: 'Y',
            studentPayment: {
              id: 1,
              subjectId: 101,
              processingManagerId: 2,
              amountReceived: 700000,
              subject: {
                round: 3,
                subjectName: '프론트엔드 실무 과정',
              },
            },
          },
        ],
      },
      {
        __typename: 'StudentPayment',
        id: 2,
        studentId: 2,
        subjectId: 102,
        processingManagerId: 2,
        branchId: 1,
        campus: '본원',
        seScore: 75,
        tuitionFee: 900000,
        dueDate: String(now - 1000 * 60 * 60 * 24),
        subDiv: '일반',
        amountReceived: 0,
        situationReport: false,
        paymentDate: String(now - 1000 * 60 * 60 * 24 * 8),
        unCollectedAmount: 900000,
        actualAmount: 900000,
        discountAmount: 0,
        isWeekend: 'Y',
        lectureAssignment: '미배정',
        courseComplete: '미참여',
        employment: '미취업',
        cardAmount: 900000,
        cashAmount: 0,
        createdAt: String(now - 1000 * 60 * 60 * 24 * 8),
        updatedAt: String(now - 1000 * 60 * 60),
        lastModifiedTime: String(now - 1000 * 60 * 60),
        lastModifiedByName: '직원',
        lastModifiedByUserId: 'general',
        processingManager: {
          __typename: 'ManageUser',
          id: 2,
          mUserId: 'general',
          mUsername: '직원',
        },
        student: {
          __typename: 'Student',
          id: 2,
          name: '이서연',
          phone: '01022222222',
          phoneNum1: '01022222222',
          birthday: '1997-08-21',
          writer: 'MSW',
          createdAt: String(now - 1000 * 60 * 60 * 24 * 20),
          updatedAt: String(now - 1000 * 60 * 60 * 24),
          lastModifiedTime: String(now - 1000 * 60 * 60 * 24),
          branchId: 1,
        },
        subject: {
          __typename: 'Subject',
          id: 102,
          subjectCode: 'SUB-102',
          subjectName: 'React 심화 과정',
          subDiv: '일반',
          round: 5,
          fee: 900000,
          lastModifiedTime: String(now - 1000 * 60 * 60 * 24),
          lectures: null,
        },
        paymentDetail: [
          {
            __typename: 'PaymentDetail',
            id: 3,
            studentPaymentId: 2,
            studentId: 2,
            stName: '이서연',
            cashOrCard: '카드',
            paymentDate: String(now - 1000 * 60 * 60 * 24 * 8),
            createdAt: String(now - 1000 * 60 * 60 * 24 * 8),
            lastModifiedTime: String(now - 1000 * 60 * 60 * 24 * 8),
            reqRefund: true,
            reqRefundDate: new Date(
              now - 1000 * 60 * 60 * 24 * 3,
            ).toISOString(),
            reqRefundManager: '직원',
            refundApproval: true,
            refundApprovalDate: new Date(
              now - 1000 * 60 * 60 * 24 * 2,
            ).toISOString(),
            refundManager: '직원',
            accountingManager: '직원',
            receiverId: 2,
            receiver: {
              __typename: 'ManageUser',
              id: 2,
              mUserId: 'general',
              mUsername: '직원',
            },
            amountPayment: 900000,
            ApprovalNum: 'APPROVAL-0002',
            cardCompany: '국민카드',
            cardNum: '9876-****-****-1111',
            installment: 0,
            studentPayment: {
              id: 2,
              subjectId: 102,
              processingManagerId: 2,
              amountReceived: 0,
              subject: {
                round: 5,
                subjectName: 'React 심화 과정',
              },
            },
          },
        ],
      },
    ] as MockStudentPayment[],

    refundRequests: [
      {
        id: 1,
        paymentId: 1,
        paymentDetailId: 2,
        studentId: 1,
        studentName: '김민지',
        refundAmount: 200000,
        requestedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        branchId: 1,
      },
    ] as MockRefundRequest[],

    refundCompleted: [
      {
        id: 2,
        paymentId: 2,
        paymentDetailId: 3,
        studentId: 2,
        studentName: '이서연',
        refundAmount: 900000,
        approvedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
        branchId: 1,
      },
    ] as MockRefundCompleted[],

    paymentSeq: 3,
    paymentDetailSeq: 4,
    refundSeq: 3,
  }
}

export const STUDENT_MOCK_DB =
  globalThis.__STUDENT_MOCK_DB__ ??
  (globalThis.__STUDENT_MOCK_DB__ = createStudentMockDb())
