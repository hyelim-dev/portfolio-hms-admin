import { gql } from '@apollo/client'

// Dashboard
export const DASHBOARD_TODAY_QUERY = gql`
  query Query($today: [String], $yesterday: [String]) {
    dashboardToday(today: $today, yesterday: $yesterday) {
      compareToday
      error
      message
      ok
      today
    }
  }
`
export const DASHBOARD_MONTH_QUERY = gql`
  query DashboardMonth {
    dashboardMonth {
      ok
      month
      compareMonth
    }
  }
`
export const DASHBOARD_UNP_QUERY = gql`
  query DashboardUnp {
    dashboardUnp {
      ok
      unpCount
    }
  }
`
export const DASHBOARD_AT_QUERY = gql`
  query DashboardAT($period: [String]) {
    dashboardAT(period: $period) {
      count
      topFiveName
      totalStudentState
    }
  }
`
export const DASHBOARD_RD_QUERY = gql`
  query DashboardRD($period: [String]) {
    dashboardRD(period: $period) {
      count
      receiptDiv
    }
  }
`

// Components
export const MME_QUERY = gql`
  query MMe {
    mMe {
      Stamp {
        id
        imageUrl
      }
      mZipCode
      mAddressDetail
      mAddresses
      mAvatar
      mGrade
      mJoiningDate
      mPart
      mPassword
      mPhoneNum
      mPhoneNumCompany
      mPhoneNumFriend
      mPhoneNumInside
      mRank
      mUserId
      mUsername
      resign
      email
      id
      createdAt
      branchId
      lastModifiedBy
      lastModifiedTime
      favoriteStudentState
      ConsultationMemo {
        id
        content
        createdAt
        manageUserId
        studentStateId
        lastModifiedTime
      }
    }
  }
`
export const SEARCH_PERMISSIONS_GRANTED_QUERY = gql`
  query SearchPermissionsGranted(
    $manageUserId: Int
    $searchPermissionsGrantedId: Int
    $permissionName: String
    $topic: String
  ) {
    searchPermissionsGranted(
      manageUserId: $manageUserId
      id: $searchPermissionsGrantedId
      permissionName: $permissionName
      topic: $topic
    ) {
      totalCount
      ok
      message
      error
      data {
        id
        permissionName
        topic
        ManageUser {
          id
          resign
          mUsername
          mUserId
          mRank
          mPhoneNum
          mPart
          mGrade
        }
        smsPermitted
        readOnly
        allPermitted
        createdAt
        updatedAt
        branchId
        lastModifiedTime
      }
    }
  }
`
export const SEE_ALARMS_TOTAL_QUERY = gql`
  query SeeAlarms {
    seeAlarms {
      totalCount
      ok
      message
      error
    }
  }
`
export const SEE_ALARMS_QUERY = gql`
  query Query($limit: Int, $page: Int) {
    seeAlarms(limit: $limit, page: $page) {
      totalCount
      ok
      message
      error
      data {
        id
        personalTarget
        title
        createdAt
        content
      }
    }
  }
`

export const MME_FAVO_QUERY = gql`
  query MMe {
    mMe {
      favoriteStudentState
    }
  }
`
export const ISMME_QUERY = gql`
  query IsMme($isMmeId: Int!) {
    isMme(id: $isMmeId) {
      ok
      error
    }
  }
`
export const SEE_STUDENT_STATE_QUERY = gql`
  query SeeStudentState($page: Int!, $limit: Int) {
    seeStudentState(page: $page, limit: $limit) {
      message
      ok
      totalCount
      studentState {
        adviceTypes {
          id
          type
        }
        createdAt
        id
        phoneNum1
        pic
        progress
        receiptDiv
        stName
        stVisit
        subDiv
        classMethod
      }
    }
  }
`
export const SEE_ADVICE_TYPE_QUERY = gql`
  query SeeAdviceType($category: String!, $page: Int, $limit: Int) {
    seeAdviceType(category: $category, page: $page, limit: $limit) {
      ok
      message
      error
      adviceType {
        category
        id
        indexNum
        onOff
        type
      }
      totalCount
    }
  }
`

export const SEE_ADVICE_TYPE_ORDER_QUERY = gql`
  query SeeAdviceType($category: String!, $page: Int, $limit: Int) {
    seeAdviceType(category: $category, page: $page, limit: $limit) {
      ok
      message
      error
      adviceType {
        category
        id
        indexNum
        onOff
        type
      }
      totalCount
    }
  }
`

export const CREATE_STAMP_QUERY = gql`
  query Query($manageUserId: Int!) {
    createStamp(manageUserId: $manageUserId) {
      error
      message
      ok
    }
  }
`

export const SEE_MANAGEUSER_QUERY = gql`
  query Query($limit: Int, $page: Int, $resign: String) {
    seeManageUser(limit: $limit, page: $page, resign: $resign) {
      totalCount
      ok
      message
      error
      data {
        ConsultationMemo {
          id
          createdAt
          content
          manageUserId
          studentStateId
        }
        resign
        mUsername
        mUserId
        mRank
        mPhoneNumInside
        mPhoneNumFriend
        mPhoneNumCompany
        mPhoneNum
        mPart
        mJoiningDate
        mGrade
        mAvatar
        mAddresses
        lastModifiedBy
        id
        favoriteStudentState
        email
        createdAt
        Stamp {
          id
          imageUrl
        }
        frequentlyUsed
      }
    }
  }
`
export const SEARCH_MANAGEUSER_QUERY = gql`
  query Query(
    $mGrade: Int
    $limit: Int
    $resign: String
    $searchManageUserId: Int
    $mUserId: String
    $mUsername: String
    $mRank: String
    $mPhoneNum: String
    $mPart: String
    $mJoiningDate: [String]
    $page: Int
  ) {
    searchManageUser(
      mGrade: $mGrade
      limit: $limit
      resign: $resign
      id: $searchManageUserId
      mUserId: $mUserId
      mUsername: $mUsername
      mRank: $mRank
      mPhoneNum: $mPhoneNum
      mPart: $mPart
      mJoiningDate: $mJoiningDate
      page: $page
    ) {
      totalCount
      ok
      message
      error
      data {
        Stamp {
          id
          imageUrl
        }
        mUserId
        mUsername
        email
        createdAt
        id
        mAddresses
        mAvatar
        mGrade
        mJoiningDate
        mPart
        mPhoneNum
        mPhoneNumCompany
        mPhoneNumFriend
        mPhoneNumInside
        mAddressDetail
        mZipCode
        mRank
        resign
        lastModifiedTime
        lastModifiedBy
      }
    }
  }
`

export const SEE_FAVORITESTATE_QUERY = gql`
  query Query {
    seeFavorite {
      adviceTypes {
        id
        type
      }
      createdAt
      id
      phoneNum1
      pic
      progress
      receiptDiv
      stName
      stVisit
      subDiv
    }
  }
`

export const SEE_SUBJECT_QUERY = gql`
  query Query($page: Int, $limit: Int) {
    seeSubject(page: $page, limit: $limit) {
      subject {
        id
        subDiv
        subjectName
        createdAt
        fee
        startDate
        endDate
        roomNum
        exposure
        totalTime
        teacherName
        subjectCode
        round
      }
      ok
      error
      message
      totalCount
    }
  }
`

//student
export const SEE_STUDENT_QUERY = gql`
  query Query($page: Int, $limit: Int) {
    seeStudent(page: $page, limit: $limit) {
      error
      message
      ok
      totalCount
      student {
        birthday
        createdAt
        name
        phoneNum1
        writer
        smsAgreement
        id
        studentPayment {
          id
          lectureAssignment
        }
      }
    }
  }
`

export const SEE_AMOUNT_STUDENT_QUERY = gql`
  query Query($page: Int, $limit: Int) {
    seeStudent(page: $page, limit: $limit) {
      error
      message
      ok
      totalCount
      student {
        studentPayment {
          amountReceived
          cardAmount
          cashAmount
          discountAmount
          id
          processingManager {
            mUserId
            mUsername
            id
          }
          paymentDate
          tuitionFee
          unCollectedAmount
          subject {
            subjectName
            subDiv
            id
          }
        }
        phoneNum1
        name
      }
    }
  }
`

// 회계
export const SEE_PAYMENT_QUERY = gql`
  query SeeStudentPayment($page: Int, $limit: Int) {
    seeStudentPayment(page: $page, limit: $limit) {
      totalCount
      ok
      message
      error
      StudentPayment {
        amountReceived
        actualAmount
        discountAmount
        unCollectedAmount
        tuitionFee
        createdAt
        subject {
          id
          subjectName
          round
        }
        processingManager {
          mUsername
        }
        student {
          name
          id
        }
        id
      }
    }
  }
`
export const SEE_PAYMENT_DETAIL_QUERY = gql`
  query Query($page: Int, $limit: Int) {
    seePaymentDetail(page: $page, limit: $limit) {
      ok
      message
      error
      totalCount
      PaymentDetail {
        id
        cashOrCard
        amountPayment
        ApprovalNum
        accountingManager
        paymentDate
        depositAmount
        studentPaymentId
        studentPayment {
          subject {
            id
            subjectName
            round
          }
        }
        receiver {
          id
          mUserId
          mUsername
        }
        receiverId
        refundApproval
        stName
        studentId
      }
    }
  }
`

export const SEE_REFUND_QUERY = gql`
  query SeePaymentDetail($page: Int, $limit: Int) {
    seePaymentDetail(page: $page, limit: $limit) {
      ok
      error
      message
      totalCount
      PaymentDetail {
        amountPayment
        cashOrCard
        id
        receiver {
          mUsername
        }
        studentPaymentId
        studentPayment {
          processingManagerId
          amountReceived
          subjectId
          subject {
            subjectName
            id
          }
          subject {
            subjectName
          }
        }
        depositAmount
        reqRefund
        reqRefundManager
        bankName
        cardCompany
        receiverId
        refundApproval
        refundManager
        stName
      }
    }
  }
`

// 통계
export const GET_SALES_QUERY = gql`
  query GetSalesData($startDate: String!, $endDate: String!) {
    getSalesData(startDate: $startDate, endDate: $endDate) {
      cardRefundTotal
      cardTotal
      cashRefundTotal
      cashTotal
      paymentTotal
      date
      refundTotal
      totalAmount
    }
  }
`

//강의
export const SEE_LECTURES_QUERY = gql`
  query Query($page: Int, $limit: Int) {
    seeLectures(page: $page, limit: $limit) {
      totalCount
      ok
      message
      error
      data {
        ApprovedNum
        campus
        confirmedNum
        createdAt
        eduStatusReport
        id
        lectureDetails
        lecturePeriodEnd
        lecturePeriodStart
        lectureTime
        roomNum
        timetableAttached
        temporaryName
        subjectId
        subject {
          id
          subjectName
          subjectCode
          subDiv
          round
          StudentPayment {
            id
            lectureAssignment
            employment
            courseComplete
            EmploymentStatus {
              imploymentInsurance
              proofOfImployment
              completionType
              employmentType
            }
          }
        }
        subDiv
        sessionNum
        teachers {
          id
          mUserId
          mUsername
        }
      }
    }
  }
`

export const SEE_ATTENDANCE_ALL_QUERY = gql`
  query Query($attendanceDate: String!, $lecturesId: Int!) {
    seeAttendance(attendanceDate: $attendanceDate, lecturesId: $lecturesId) {
      ok
      message
      error
      enrollCount
      enrollData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
        }
      }
      leaveEarlyCount
      leaveEarlyData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
      }
    }
  }
`

export const SEE_ATTENDANCE_QUERY = gql`
  query Query($attendanceDate: String!, $lecturesId: Int!) {
    seeAttendance(attendanceDate: $attendanceDate, lecturesId: $lecturesId) {
      ok
      message
      error
      absentCount
      absentData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
      attendanceCount
      attendanceData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
      enrollCount
      enrollData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
      leaveEarlyCount
      leaveEarlyData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
      outingCount
      outingData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
      tardyCount
      tardyData {
        id
        student {
          name
        }
        attendanceDate
        attendanceState
        studentId
        studentPaymentId
        studentPayment {
          lectureAssignment
          courseComplete
        }
      }
    }
  }
`
export const SEARCH_WORKLOGS_QUERY = gql`
  query Query($workLogsDate: String, $lecturesId: Int) {
    searchWorkLogs(workLogsDate: $workLogsDate, lecturesId: $lecturesId) {
      data {
        absentSt
        attendanceCount
        createdAt
        etc
        id
        instruction
        leaveEarlySt
        lectures {
          ApprovedNum
          confirmedNum
          lectureDetails
          lecturePeriodEnd
          lecturePeriodStart
          temporaryName
          id
        }
        outingSt
        paymentOne
        paymentThree
        paymentTwo
        tardySt
        trainingInfoEight
        trainingInfoFive
        trainingInfoFour
        trainingInfoOne
        trainingInfoSeven
        trainingInfoSix
        trainingInfoThree
        trainingInfoTwo
        trainingTimeOneday
        trainingTimeTotal
        lastModifiedTime
        workLogsDate
        checkList
        checkContext
      }
      totalCount
      ok
      message
      error
    }
  }
`
export const SEARCH_TIME_TOTAL_QUERY = gql`
  query Query($workLogsDate: String, $lecturesId: Int) {
    searchWorkLogs(workLogsDate: $workLogsDate, lecturesId: $lecturesId) {
      data {
        trainingTimeOneday
        trainingTimeTotal
      }
      ok
      message
      error
    }
  }
`
export const SIGN_WORKLOGS_QUERY = gql`
  query SignWorkLogs($signWorkLogsId: Int!, $lastModifiedTime: String) {
    signWorkLogs(id: $signWorkLogsId, lastModifiedTime: $lastModifiedTime) {
      stampUrl
      ok
      message
      error
    }
  }
`
export const SEARCH_ATTENDANCE_QUERY = gql`
  query Query($lecturesId: Int!, $attendanceDate: [String]) {
    searchAttendance(lecturesId: $lecturesId, attendanceDate: $attendanceDate) {
      totalCount
      ok
      message
      error
      data {
        attendanceState
        student {
          name
        }
      }
    }
  }
`
export const SEE_MESSAGE_STORAGE_QUERY = gql`
  query SeeMessageStorage($limit: Int, $page: Int, $saveType: String!) {
    seeMessageStorage(limit: $limit, page: $page, saveType: $saveType) {
      data {
        saveType
        message
        manageUserId
        branchId
        id
        createdAt
      }
      totalCount
      ok
      message
      error
    }
  }
`

export const SEARCH_SMS_QUERY = gql`
  query Query($page: Int, $limit: Int, $branchId: Int, $receiver: String) {
    searchSms(
      page: $page
      limit: $limit
      branchId: $branchId
      receiver: $receiver
    ) {
      totalCount
      ok
      message
      error
      data {
        id
        manageUser {
          mUsername
        }
        failureReason
        successType
        sender
        receiver
        rTime
        rDate
        message
        createdAt
      }
    }
  }
`
// 학적부
export const SEARCH_SM_QUERY = gql`
  query SearchSM(
    $modelType: String!
    $studentPaymentId: Int
    $lectureId: Int
    $subjectId: Int
    $limit: Int
    $page: Int
  ) {
    searchSM(
      modelType: $modelType
      studentPaymentId: $studentPaymentId
      lectureId: $lectureId
      subjectId: $subjectId
      limit: $limit
      page: $page
    ) {
      totalCount
      ok
      message
      error
      data {
        ... on Career {
          id
          lectureId
          studentId
          stName
          careerDetails
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on EduInfomation {
          id
          lectureId
          studentId
          stName
          eduType
          eduName
          major
          graduationStatus
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on Certificate {
          id
          lectureId
          studentId
          stName
          CAdate
          certificateName
          certificateLevel
          CertificateIssuer
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on StudentConsultation {
          id
          lectureId
          studentId
          stName
          typeOfConsultation
          dateOfConsultation
          detailsOfConsultation
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on HopeForEmployment {
          id
          lectureId
          studentId
          stName
          workingArea
          fieldOfHope
          hopefulReward
          workType
          workingHours
          opinion
          subjectId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on EmploymentRecommendation {
          id
          lectureId
          studentId
          stName
          dateOfRecommendation
          recruitmentField
          companyName
          location
          phoneNum
          dateOfInterview
          employmentStatus
          reasonForNonEmployment
          certificateOfEmploymentStatus
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on EmploymentStatus {
          id
          lectureId
          studentId
          stName
          employmentType
          dateOfEmployment
          companyName
          businessNum
          responsibilities
          location
          phoneNum
          businessSize
          imploymentInsurance
          proofOfImployment
          relatedFields
          completionType
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on PreInspection {
          id
          lectureId
          studentId
          stName
          dateOfPreInspection
          preScreenerType
          preInspectionDetails
          actionTaken
          subjectId
          studentPaymentId
          createdAt
          updatedAt
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
        ... on StudentPortfolio {
          id
          lectureId
          studentId
          stName
          isBest
          filePath
          details
          url
          createdAt
          updatedAt
          studentPaymentId
          subjectId
          branchId
          lastModifiedByUserId
          lastModifiedByName
          lastModifiedTime
        }
      }
    }
  }
`
export const SEARCH_PORTFLIO_STUDDENTS_QUERY = gql`
  query SearchSM($modelType: String!, $lectureId: Int) {
    searchSM(modelType: $modelType, lectureId: $lectureId) {
      totalCount
      ok
      message
      error
      data {
        ... on StudentPortfolio {
          stName
          lectureId
          id
          studentPaymentId
          studentId
        }
      }
    }
  }
`
export const SEE_REGULAREVALUATION_SET_QUERY = gql`
  query Query($lectureId: Int, $subjectId: Int, $page: Int, $limit: Int) {
    seeRegularEvaluationSet(
      lectureId: $lectureId
      subjectId: $subjectId
      page: $page
      limit: $limit
    ) {
      totalCount
      ok
      message
      error
      data {
        id
        lectureId
        statusType
        evaluationDetails
        points
        subjectId
        createdAt
        branchId
        lastModifiedByUserId
        lastModifiedByName
        lastModifiedTime
      }
    }
  }
`
// 학적부
export const SEE_EMPLOYMENT_STUDENTPAYMENT_QUERY = gql`
  query SeeStudentPayment($page: Int, $limit: Int) {
    seeStudentPayment(page: $page, limit: $limit) {
      totalCount
      ok
      message
      error
      StudentPayment {
        EmploymentStatus {
          id
          lectureId
          employmentType
          dateOfEmployment
          companyName
          location
          businessSize
          branchId
          phoneNum
        }
        StudentConsultation {
          id
          createdAt
          typeOfConsultation
        }
        supportType
        employment
        lectureAssignment
        subDiv
        situationReport
        subjectId
        subject {
          id
          round
          lectures {
            temporaryName
            teachers {
              id
              mUsername
            }
            sessionNum
            lecturePeriodStart
            lecturePeriodEnd
          }
        }
        studentId
        student {
          id
          name
          phoneNum1
          birthday
        }
      }
    }
  }
`
export const SEARCH_STUDENT_RECORD_QUERY = gql`
  query SearchAcademyRecord($searchAcademyRecordId: Int) {
    searchAcademyRecord(id: $searchAcademyRecordId) {
      ok
      message
      error
      result {
        seScore
        lastModifiedTime
        lastModifiedByUserId
        lastModifiedByName
        createdAt
        supportType
        subDiv
        student {
          id
          birthday
          name
          phoneNum1
        }
        mZipCode
        mAddresses
        mAddressDetail
        id
        employment
        courseComplete
        subjectId
        subject {
          id
          subjectCode
          lectures {
            id
            lastModifiedTime
            lecturePeriodStart
            lecturePeriodEnd
            lectureTime
            sessionNum
            roomNum
            subDiv
            createdAt
            temporaryName
            subject {
              subjectCode
            }
            teachers {
              id
              mUsername
            }
            ApprovedNum
            confirmedNum
          }
        }
      }
    }
  }
`
export const SEARCH_ACADEMY_RECORD_QUERY = gql`
  query Query(
    $page: Int
    $limit: Int
    $teacherName: String
    $subDiv: String
    $lectureName: String
    $phoneNum: String
    $studentName: String
    $searchAcademyRecordId: Int
  ) {
    searchAcademyRecord(
      page: $page
      limit: $limit
      teacherName: $teacherName
      subDiv: $subDiv
      lectureName: $lectureName
      phoneNum: $phoneNum
      studentName: $studentName
      id: $searchAcademyRecordId
    ) {
      totalCount
      ok
      message
      error
      result {
        supportType
        subDiv
        subject {
          id
          lectures {
            id
            temporaryName
            teachers {
              id
              mUsername
            }
            lecturePeriodEnd
            lecturePeriodStart
            subDiv
            sessionNum
          }
        }
        student {
          name
          birthday
          id
          phoneNum1
        }
        lectureAssignment
        employment
        id
        courseComplete
        StudentPortfolio {
          id
        }
        StudentConsultation {
          dateOfConsultation
          typeOfConsultation
        }
        EmploymentStatus {
          companyName
          dateOfEmployment
        }
        EmploymentRecommendation {
          companyName
          dateOfInterview
          dateOfRecommendation
        }
      }
    }
  }
`
export const SEARCH_ATTENDANCE_RECORD_TOTAL_QUERY = gql`
  query Query($period: [String], $mUserId: String) {
    searchAttendanceRecord(period: $period, mUserId: $mUserId) {
      totalCount
      error
      message
      ok
      result {
        clockIn
        ManageUser {
          mPart
          mAvatar
          mUserId
          mUsername
          mRank
        }
      }
    }
  }
`
export const SEARCH_ATTENDANCE_RECORD_ID_QUERY = gql`
  query Query(
    $period: [String]
    $mUserId: String
    $mUsername: String
    $page: Int
    $limit: Int
  ) {
    searchAttendanceRecord(
      period: $period
      mUserId: $mUserId
      mUsername: $mUsername
      page: $page
      limit: $limit
    ) {
      totalCount
      error
      message
      ok
      result {
        clockIn
        ManageUser {
          mPart
          mAvatar
          mUserId
          mUsername
          mRank
        }
      }
    }
  }
`
