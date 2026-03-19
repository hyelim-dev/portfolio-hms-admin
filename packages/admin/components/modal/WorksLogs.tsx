import styled from 'styled-components'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  ScrollShadow,
  Textarea,
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { EDIT_WORKLOGS_MUTATION } from '@/graphql/mutations'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import WorksSchedule from '@/components/table/WorksSchedule'
import WorksTime from '@/components/table/WorksTime'
import WorksRemark from '@/components/table/WorksRemark'
import { SEARCH_WORKLOGS_QUERY, SIGN_WORKLOGS_QUERY } from '@/graphql/queries'
import useMmeQuery from '@/utils/mMe'
import { useReactToPrint } from 'react-to-print'
// import useUserLogsMutation from '@/utils/userLogs'
import { useRecoilValue } from 'recoil'
import {
  assignmentState,
  completionStatus,
  gradeState,
} from '@/lib/recoilAtoms'

const Title = styled.h2`
  position: relative;
  font-size: 1.2rem;
  font-weight: 600;
  padding-left: 1rem;

  &:after {
    content: '';
    width: 0.3rem;
    height: 100%;
    background: ${({ theme }) => theme.colors.secondary};
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.3rem;
  }
`
const SubText = styled.span`
  font-size: 0.875rem;
  padding-left: 0.5rem;
  font-weight: 400;

  > span {
    color: red;
  }
`

const DatailBody = styled.div`
  @media (max-width: 768px) {
    /* overflow-y: auto; */
    overflow-x: hidden;
    height: 60vh;
  }
`

const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
  @media print {
    gap: 1.5rem !important;
  }

  &.scroll {
    margin-top: 1rem;
    height: 40vh;
    overflow-x: hidden;
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
  @media print {
    flex-direction: row !important;
  }

  &.reverse {
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }
`

const FlexBoxNum = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media print {
    flex-direction: column !important;
  }

  &.reverse {
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }
`

const AreaTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  h4 {
    font-size: 1rem;
    font-weight: 600;
  }
`
const AreaSection = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 1.5rem;

  &.last {
    padding-bottom: 1rem;
  }
`

const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`

const FlexAreaBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;

  > div {
    flex: 1;
  }
`
const FlexColBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  > div {
    flex: 1;
  }
`

const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

const StempBox = styled.div`
  display: flex;
  padding: 0.6rem 0;
  height: 5.1rem;
  border: 2px solid hsl(240 6% 90%);
  border-radius: 0.5rem;
  justify-content: center;
  align-items: center;

  > img {
    height: 100%;
  }
`
const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  span {
    color: red;
  }

  &.color {
    color: inherit;
  }
`

const CheckLabel = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
  position: relative;
  &:after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: ${({ theme }) => theme.colors.primary};
    position: absolute;
    top: 0.6rem;
    left: -1rem;
    transform: translateY(-50%);
  }
`

const TopInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    align-items: flex-end;
    flex-direction: column-reverse;
  }
`
const UpdateTime = styled.div`
  display: flex;
  gap: 0.3rem;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`
const UpdateCon = styled.p`
  > span {
    color: #555;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    align-items: flex-end;
  }
`

export default function WorksLogsModal({
  isOpen,
  onClose,
  lectureId,
  workLogeDate,
  workLogData,
  attendanceData,
  timeTotal,
  setWorkLogData,
  setTimeTotal,
  setAttendanceData,
}) {
  const grade = useRecoilValue(gradeState)
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  const { useMme } = useMmeQuery()
  const mId = useMme('id')
  const mGrade = useMme('mGrade')
  const mPart = useMme('mPart') || []
  const mUsername = useMme('mUsername')
  // const { userLogs } = useUserLogsMutation()
  const [signWorkLog] = useLazyQuery(SIGN_WORKLOGS_QUERY)
  const [editWrokLogs] = useMutation(EDIT_WORKLOGS_MUTATION)
  const [attendanceTotals, setAttendanceTotals] = useState(null)
  const [signOne, setSignOne] = useState(null)
  const [signTwo, setSignTwo] = useState(null)
  const [signThree, setSignThree] = useState(null)
  const [trainingData, setTrainingData] = useState(null)
  const [trainingTimes, setTrainingTimes] = useState(null)
  const [trainingTimesTotal, setTrainingTimesTotal] = useState(null)
  const [attendanceState, setAttendanceState] = useState(null)
  const [isChecked1, setIsChecked1] = useState('N')
  const [isChecked2, setIsChecked2] = useState('N')
  const [sign, setSign] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    setValue,
    control,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      trainingInfoOne: '',
      trainingInfoTwo: '',
      trainingInfoThree: '',
      trainingInfoFour: '',
      trainingInfoFive: '',
      trainingInfoSix: '',
      trainingInfoSeven: '',
      trainingInfoEight: '',
      trainingTimeOneday: '',
      trainingTimeTotal: '',
      instruction: '',
      absentSt: '',
      tardySt: '',
      leaveEarlySt: '',
      outingSt: '',
      etc: '',
      attendanceCount: '',
      check1: '',
      check2: '',
      check1con: '',
      check2con: '',
    },
  })

  const getStudentTotal = data => {
    if (!data && data.length === 0) {
      return 0
    }

    return data.filter(
      student =>
        student.studentPayment.lectureAssignment !== assignment.withdrawal &&
        student.studentPayment.courseComplete !== completion.dropout,
    ).length
  }
  const getSortedStudentNames = data => {
    if (!data && data.length === 0) {
      return ''
    }

    return data
      .filter(
        student =>
          student.studentPayment.lectureAssignment !== assignment.withdrawal &&
          student.studentPayment.courseComplete !== completion.dropout,
      )
      .map(attendance => attendance.student.name)
      .sort()
      .join(', ')
  }

  useEffect(() => {
    reset()
  }, [isOpen])

  useEffect(() => {
    reset({
      trainingInfoOne: workLogData?.trainingInfoOne || '',
      trainingInfoTwo: workLogData?.trainingInfoTwo || '',
      trainingInfoThree: workLogData?.trainingInfoThree || '',
      trainingInfoFour: workLogData?.trainingInfoFour || '',
      trainingInfoFive: workLogData?.trainingInfoFive || '',
      trainingInfoSix: workLogData?.trainingInfoSix || '',
      trainingInfoSeven: workLogData?.trainingInfoSeven || '',
      trainingInfoEight: workLogData?.trainingInfoEight || '',
      trainingTimeOneday: workLogData?.trainingTimeOneday || '',
      trainingTimeTotal: workLogData?.trainingTimeTotal || '',
      instruction: workLogData?.instruction || '',
      absentSt: workLogData?.absentSt || '',
      tardySt: workLogData?.tardySt || '',
      leaveEarlySt: workLogData?.leaveEarlySt || '',
      outingSt: workLogData?.outingSt || '',
      etc: workLogData?.etc || '',
      attendanceCount: workLogData?.attendanceCount || '',
      check1: workLogData?.checkList[0] || '',
      check2: workLogData?.checkList[1] || '',
      check1con: workLogData?.checkContext[0] || '',
      check2con: workLogData?.checkContext[1] || '',
    })

    if (workLogData && attendanceData && timeTotal) {
      if (workLogData.attendanceCount.length > 0) {
        setAttendanceTotals(workLogData.attendanceCount)
      } else {
        setAttendanceTotals([
          getStudentTotal(attendanceData.enrollData),
          getStudentTotal(attendanceData.attendanceData),
          getStudentTotal(attendanceData.absentData),
          getStudentTotal(attendanceData.tardyData),
          getStudentTotal(attendanceData.leaveEarlyData),
          getStudentTotal(attendanceData.outingData),
        ])
      }
      setTrainingData({
        trainingInfoOne:
          workLogData.trainingInfoOne.length === 0
            ? ['1교시', mUsername, '', '', '']
            : workLogData.trainingInfoOne,
        trainingInfoTwo:
          workLogData.trainingInfoTwo.length === 0
            ? ['2교시', mUsername, '', '', '']
            : workLogData.trainingInfoTwo,
        trainingInfoThree:
          workLogData.trainingInfoThree.length === 0
            ? ['3교시', mUsername, '', '', '']
            : workLogData.trainingInfoThree,
        trainingInfoFour:
          workLogData.trainingInfoFour.length === 0
            ? ['4교시', mUsername, '', '', '']
            : workLogData.trainingInfoFour,
        trainingInfoFive:
          workLogData.trainingInfoFive.length === 0
            ? ['5교시', mUsername, '', '', '']
            : workLogData.trainingInfoFive,
        trainingInfoSix:
          workLogData.trainingInfoSix.length === 0
            ? ['6교시', mUsername, '', '', '']
            : workLogData.trainingInfoSix,
        trainingInfoSeven:
          workLogData.trainingInfoSeven.length === 0
            ? ['7교시', mUsername, '', '', '']
            : workLogData.trainingInfoSeven,
        trainingInfoEight:
          workLogData.trainingInfoEight.length === 0
            ? ['8교시', mUsername, '', '', '']
            : workLogData.trainingInfoEight,
      })
      setTrainingTimes(
        workLogData.trainingTimeOneday.length === 0
          ? [0, 0, 0, 0, 0]
          : workLogData.trainingTimeOneday,
      )

      setTrainingTimesTotal(
        workLogData.trainingTimeTotal.length === 0
          ? timeTotal.length === 0
            ? [0, 0, 0, 0, 0]
            : timeTotal
          : workLogData.trainingTimeTotal,
      )
      setAttendanceState({
        absentSt:
          workLogData.absentSt === null
            ? getSortedStudentNames(attendanceData.absentData)
            : workLogData.absentSt,
        tardySt:
          workLogData.tardySt === null
            ? getSortedStudentNames(attendanceData.tardyData)
            : workLogData.tardySt,
        leaveEarlySt:
          workLogData.leaveEarlySt === null
            ? getSortedStudentNames(attendanceData.leaveEarlyData)
            : workLogData.leaveEarlySt,
        outingSt:
          workLogData.outingSt === null
            ? getSortedStudentNames(attendanceData.outingData)
            : workLogData.outingSt,
        etc: workLogData.etc === null ? [] : workLogData.etc,
      })
      if (workLogData.checkList.length > 0) {
        setIsChecked1(workLogData.checkList[0])
        setIsChecked2(workLogData.checkList[1])
      }
    }
  }, [workLogData, attendanceData, timeTotal])
  const formatDate = (data, time) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (time) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  const getWorksLogsDate = data => {
    const week = ['일', '월', '화', '수', '목', '금', '토']

    const dayOfWeek = week[new Date(data).getDay()]

    return dayOfWeek
  }

  const clickSign = async type => {
    try {
      const { data } = await signWorkLog({
        variables: {
          signWorkLogsId: workLogData.id,
          lastModifiedTime: new Date(),
        },
      })
      if (data.signWorkLogs.ok) {
        const stampUrl = data.signWorkLogs.stampUrl
        if (type === '강사') {
          setSignOne(stampUrl)
        } else if (type === '담당자') {
          setSignTwo(stampUrl)
        } else {
          setSignThree(stampUrl)
        }
        // userLogs(`강의ID:${lectureId}의 ${workLogeDate}일지 서명`)
        setSign(true)
      } else {
        if (data.signWorkLogs.message === '권한이 없습니다.') {
          alert(data.signWorkLogs.message)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onSubmit = data => {
    if (isDirty) {
      if (sign) {
        const isWrite = workLogData?.paymentOne
          ? confirm(
              `강의ID:${lectureId}의 ${workLogeDate} 일지를 수정하시겠습니까?`,
            )
          : confirm(
              `강의ID:${lectureId}의 ${workLogeDate} 일지를 등록하시겠습니까?`,
            )
        if (isWrite) {
          editWrokLogs({
            variables: {
              editWorkLogsId: workLogData.id,
              trainingInfoOne: data.trainingInfoOne
                ? data.trainingInfoOne
                : workLogData.trainingInfoOne,
              trainingInfoTwo: data.trainingInfoTwo
                ? data.trainingInfoTwo
                : workLogData.trainingInfoTwo,
              trainingInfoThree: data.trainingInfoThree
                ? data.trainingInfoThree
                : workLogData.trainingInfoThree,
              trainingInfoFour: data.trainingInfoFour
                ? data.trainingInfoFour
                : workLogData.trainingInfoFour,
              trainingInfoFive: data.trainingInfoFive
                ? data.trainingInfoFive
                : workLogData.trainingInfoFive,
              trainingInfoSix: data.trainingInfoSix
                ? data.trainingInfoSix
                : workLogData.trainingInfoSix,
              trainingInfoSeven: data.trainingInfoSeven
                ? data.trainingInfoSeven
                : workLogData.trainingInfoSeven,
              trainingInfoEight: data.trainingInfoEight
                ? data.trainingInfoEight
                : workLogData.trainingInfoEight,
              trainingTimeOneday: data.trainingTimeOneday
                ? data.trainingTimeOneday
                : workLogData.trainingTimeOneday,
              trainingTimeTotal: data.trainingTimeTotal
                ? data.trainingTimeTotal
                : workLogData.trainingTimeTotal,
              instruction: data.instruction
                ? data.instruction
                : workLogData.instruction,
              absentSt: data.absentSt ? data.absentSt : workLogData.absentSt,
              tardySt: data.tardySt ? data.tardySt : workLogData.tardySt,
              leaveEarlySt: data.leaveEarlySt
                ? data.leaveEarlySt
                : workLogData.leaveEarlySt,
              outingSt: data.outingSt ? data.outingSt : workLogData.outingSt,
              etc: data.etc ? data.etc : workLogData.etc,
              attendanceCount: data.attendanceCount
                ? data.attendanceCount
                : workLogData.attendanceCount,
              checkList:
                data.check1 || data.check2
                  ? [data.check1, data.check2]
                  : workLogData.checkList,
              checkContext:
                data.check1con || data.check2con
                  ? [data.check1con, data.check2con]
                  : workLogData.checkList,
              lastModifiedTime: new Date(),
            },
            refetchQueries: [SEARCH_WORKLOGS_QUERY],
            onCompleted: result => {
              // if (workLogData?.paymentOne) {
              //   const dirtyFieldsArray = [...Object.keys(dirtyFields)]
              // userLogs(
              //   `${workLogeDate} 일지 수정`,
              //   `ok: ${result.editWorkLogs.ok} / ${dirtyFieldsArray.join(
              //     ', ',
              //   )}`,
              // )
              // } else {
              // userLogs(
              //   `${workLogeDate} 일지 등록`,
              //   `ok: ${result.editWorkLogs.ok}`,
              // )
              // }

              if (result.editWorkLogs.ok) {
                if (workLogData?.paymentOne) {
                  alert(`${workLogeDate} 일지가 수정되었습니다.`)
                } else {
                  alert(`${workLogeDate} 일지가 등록되었습니다.`)
                }
                setSign(false)
                handleClose()
                window.localStorage.setItem(
                  'scrollPosition',
                  window.scrollY.toString(),
                )
                // window.location.reload()
              }
            },
          })
        }
      } else {
        alert('서명을 해주세요.')
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm 10mm 5mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        div {
          overflow: visible !important;
          height: auto !important;
        }
        .workLogFooter{
          display:none !important;
        }
        .scrollbar {
          mask-image:none !important;
        }
        .signBox {
          height: 8rem !important;
        }
        .signBtn {
          display: none !important;
        }
      }
    `,
  })

  const handleClose = () => {
    reset()
    setWorkLogData(null)
    setTimeTotal(null)
    setAttendanceData(null)
    onClose()
  }

  return (
    <Modal
      size={'2xl'}
      isOpen={isOpen}
      onClose={handleClose}
      placement={'center'}
    >
      <ModalContent>
        {onClose => (
          <>
            <div ref={componentRef}>
              <ModalHeader className="flex flex-col gap-1">
                <Title>
                  업무일지
                  <SubText>
                    <span>*</span>서명 후 저장, 수정 가능합니다.
                  </SubText>
                </Title>
                <TopInfo>
                  <UpdateTime>
                    <UpdateCon>
                      <span>최근 업데이트 : </span>
                      {workLogData?.lastModifiedByName ||
                      workLogData?.lastModifiedByUserId ? (
                        <>
                          {workLogData?.lastModifiedByName &&
                            workLogData?.lastModifiedByName}
                          (
                          {workLogData?.lastModifiedByUserId &&
                            workLogData?.lastModifiedByUserId}
                          )
                        </>
                      ) : null}
                    </UpdateCon>
                    {workLogData?.lastModifiedByName ||
                    workLogData?.lastModifiedByUserId ? (
                      <span>-</span>
                    ) : null}
                    <UpdateCon>
                      {workLogData?.lastModifiedTime
                        ? formatDate(workLogData?.lastModifiedTime, true)
                        : formatDate(workLogData?.createdAt, true)}
                    </UpdateCon>
                  </UpdateTime>
                </TopInfo>
              </ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <DatailBody className="scrollbar_g">
                    <ScrollShadow orientation="vertical" className="scrollbar">
                      <DetailDiv>
                        <FlexBox className="reverse">
                          <FlexColBox>
                            <AreaBox>
                              <div>
                                <FilterLabel>훈련기간</FilterLabel>
                                <LineBox>
                                  {formatDate(
                                    workLogData?.lectures.lecturePeriodStart,
                                    false,
                                  ) +
                                    ' ~ ' +
                                    formatDate(
                                      workLogData?.lectures.lecturePeriodEnd,
                                      false,
                                    )}
                                </LineBox>
                              </div>
                            </AreaBox>
                            <AreaBox>
                              <div>
                                <FilterLabel>훈련일자</FilterLabel>
                                <LineBox>
                                  {workLogeDate}{' '}
                                  {getWorksLogsDate(workLogeDate)}
                                  요일 (
                                  {workLogData?.lectures.lectureDetails.indexOf(
                                    workLogeDate,
                                  ) + 1}
                                  일/
                                  {workLogData?.lectures.lectureDetails.length}
                                  일)
                                </LineBox>
                              </div>
                            </AreaBox>
                          </FlexColBox>
                          <FlexAreaBox>
                            <AreaBox>
                              <div>
                                <FilterLabel>강사</FilterLabel>
                                <StempBox className="signBox">
                                  {sign &&
                                  (signOne || workLogData?.paymentOne) ? (
                                    <img
                                      src={signOne || workLogData?.paymentOne}
                                      alt="강사 사인"
                                    />
                                  ) : (
                                    workLogData?.paymentOne && (
                                      <img
                                        src={workLogData?.paymentOne}
                                        alt="강사 사인"
                                      />
                                    )
                                  )}
                                </StempBox>
                                {mGrade <= grade.teacher && (
                                  <BtnBox>
                                    <Button
                                      isDisabled={sign}
                                      size="sm"
                                      color="primary"
                                      className="bg-accent signBtn"
                                      onClick={() => clickSign('강사')}
                                    >
                                      서명
                                    </Button>
                                  </BtnBox>
                                )}
                              </div>
                            </AreaBox>
                            <AreaBox>
                              <div>
                                <FilterLabel>담당자</FilterLabel>
                                <StempBox className="signBox">
                                  {sign &&
                                  (signTwo || workLogData?.paymentTwo) ? (
                                    <img
                                      src={signTwo || workLogData?.paymentTwo}
                                      alt="담당자 사인"
                                    />
                                  ) : (
                                    workLogData?.paymentTwo && (
                                      <img
                                        src={workLogData?.paymentTwo}
                                        alt="담당자 사인"
                                      />
                                    )
                                  )}
                                </StempBox>
                                {mGrade <= grade.general && (
                                  <BtnBox>
                                    <Button
                                      isDisabled={sign}
                                      size="sm"
                                      color="primary"
                                      className="bg-accent signBtn"
                                      onClick={() => clickSign('담당자')}
                                    >
                                      서명
                                    </Button>
                                  </BtnBox>
                                )}
                              </div>
                            </AreaBox>
                            <AreaBox>
                              <div>
                                <FilterLabel>관리자</FilterLabel>
                                <StempBox className="signBox">
                                  {sign &&
                                  (signThree || workLogData?.paymentThree) ? (
                                    <img
                                      src={
                                        signThree || workLogData?.paymentThree
                                      }
                                      alt="관리자 사인"
                                    />
                                  ) : (
                                    workLogData?.paymentThree && (
                                      <img
                                        src={workLogData?.paymentThree}
                                        alt="관리자 사인"
                                      />
                                    )
                                  )}
                                </StempBox>
                                {mGrade <= grade.subMaster && (
                                  <BtnBox>
                                    <Button
                                      isDisabled={sign}
                                      size="sm"
                                      color="primary"
                                      className="bg-accent signBtn"
                                      onClick={() => clickSign('관리자')}
                                    >
                                      서명
                                    </Button>
                                  </BtnBox>
                                )}
                              </div>
                            </AreaBox>
                          </FlexAreaBox>
                        </FlexBox>
                        <FlexBox>
                          <AreaBox>
                            <div>
                              <Textarea
                                label="훈련과정명"
                                isDisabled={true}
                                isReadOnly={true}
                                labelPlacement="outside"
                                defaultValue={
                                  workLogData?.lectures?.temporaryName
                                }
                                minRows={1}
                                variant="underlined"
                                size="md"
                                radius="sm"
                                classNames={{
                                  base: 'opacity-1',
                                }}
                              />
                            </div>
                          </AreaBox>
                        </FlexBox>
                        {attendanceTotals && (
                          <FlexBoxNum>
                            <FlexAreaBox>
                              <div className="text-secondary">
                                <FilterLabel className="color">
                                  재적
                                </FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[0]}</b>명
                                </LineBox>
                              </div>
                              <div className="text-primary">
                                <FilterLabel className="color">
                                  출석
                                </FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[1]}</b>명
                                </LineBox>
                              </div>
                              <div className="text-accent">
                                <FilterLabel className="color">
                                  결석
                                </FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[2]}</b>명
                                </LineBox>
                              </div>
                            </FlexAreaBox>
                            <FlexAreaBox>
                              <div>
                                <FilterLabel>지각</FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[3]}</b>명
                                </LineBox>
                              </div>
                              <div>
                                <FilterLabel>조퇴</FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[4]}</b>명
                                </LineBox>
                              </div>
                              <div>
                                <FilterLabel>외출</FilterLabel>
                                <LineBox>
                                  <b>{attendanceTotals[5]}</b>명
                                </LineBox>
                              </div>
                            </FlexAreaBox>
                          </FlexBoxNum>
                        )}
                      </DetailDiv>
                      <DetailDiv className="scroll">
                        <ScrollShadow
                          orientation="vertical"
                          className="scrollbar"
                        >
                          {trainingData && (
                            <AreaSection>
                              <AreaTitle>
                                <h4>훈련사항</h4>
                              </AreaTitle>
                              <WorksSchedule
                                setValue={setValue}
                                trainingData={trainingData}
                                setTrainingData={setTrainingData}
                              />
                            </AreaSection>
                          )}
                          {trainingTimes && (
                            <AreaSection className="printPage2">
                              <AreaTitle>
                                <h4>훈련시간</h4>
                              </AreaTitle>
                              <WorksTime
                                setValue={setValue}
                                timeTotal={timeTotal}
                                trainingTimes={trainingTimes}
                                setTrainingTimes={setTrainingTimes}
                                trainingTimesTotal={trainingTimesTotal}
                                setTrainingTimesTotal={setTrainingTimesTotal}
                              />
                              {errors.trainingTimeTotal && (
                                <p className="px-2 pt-2 text-xs text-red">
                                  {String(errors.trainingTimeTotal.message)}
                                </p>
                              )}
                              {errors.trainingTimeOneday && (
                                <p className="px-2 pt-2 text-xs text-red">
                                  {String(errors.trainingTimeOneday.message)}
                                </p>
                              )}
                            </AreaSection>
                          )}
                          {attendanceState && (
                            <AreaSection>
                              <AreaTitle>
                                <h4>출결사항</h4>
                              </AreaTitle>
                              <WorksRemark
                                setValue={setValue}
                                attendanceState={attendanceState}
                                setAttendanceState={setAttendanceState}
                              />
                            </AreaSection>
                          )}
                          <AreaSection>
                            <Controller
                              control={control}
                              name="check1"
                              render={({ field }) => (
                                <RadioGroup
                                  label={
                                    <CheckLabel>
                                      오늘 지각, 외출, 조퇴 시간의 합이 총 수업
                                      시간의 절반을 넘은 학생이 있습니까?
                                      <br />
                                      "예"를 체크한 경우 출석부를 결석으로
                                      변경해 주시고, 하단 특이사항에 자세한
                                      내용을 남겨주세요.
                                    </CheckLabel>
                                  }
                                  orientation="horizontal"
                                  value={isChecked1}
                                  onValueChange={e => {
                                    setIsChecked1(e)
                                    field.onChange(e)
                                  }}
                                  classNames={{
                                    base: 'pl-[1rem]',
                                    wrapper: 'z-0',
                                  }}
                                >
                                  <Radio key={'Y'} value={'Y'}>
                                    예
                                  </Radio>
                                  <Radio key={'N'} value={'N'}>
                                    아니오
                                  </Radio>
                                </RadioGroup>
                              )}
                            />
                            {isChecked1 === 'Y' && (
                              <>
                                <AreaTitle>
                                  <h4>특이사항</h4>
                                </AreaTitle>
                                <Textarea
                                  label=""
                                  placeholder="ex) 홍길동 학생이 지각 후 조퇴를 하였는데 수업참여시간이 절반이 되지 않아 결석으로 처리함."
                                  className="w-full"
                                  variant="bordered"
                                  minRows={5}
                                  onChange={e => {
                                    register('check1con').onChange(e)
                                  }}
                                  {...register('check1con', {
                                    required: {
                                      value: true,
                                      message:
                                        '특이사항을 자세히 입력해주세요.',
                                    },
                                    validate: {
                                      minLength: value => {
                                        if (value.trim().length < 11) {
                                          return '특이사항을 최소 10자 이상 입력해주세요.'
                                        }
                                        return true
                                      },
                                    },
                                  })}
                                />
                                {errors.check1con && (
                                  <p className="px-2 pt-2 text-xs text-red">
                                    {String(errors.check1con.message)}
                                  </p>
                                )}
                              </>
                            )}
                          </AreaSection>
                          <AreaSection className="last">
                            <Controller
                              control={control}
                              name="check2"
                              render={({ field }) => (
                                <RadioGroup
                                  label={
                                    <CheckLabel>
                                      수업을 듣지 못했거나, 부진한 학생이 있을
                                      경우 조치를 취하셨습니까?
                                      <br />
                                      "예"를 체크한 경우 하단 조치사항을
                                      학생이름과 내용을 자세히 작성해주세요.
                                    </CheckLabel>
                                  }
                                  orientation="horizontal"
                                  value={isChecked2}
                                  onValueChange={e => {
                                    setIsChecked2(e)
                                    field.onChange(e)
                                  }}
                                  classNames={{
                                    base: 'pl-[1rem]',
                                    wrapper: 'z-0',
                                  }}
                                >
                                  <Radio key={'Y'} value={'Y'}>
                                    예
                                  </Radio>
                                  <Radio key={'N'} value={'N'}>
                                    아니오
                                  </Radio>
                                </RadioGroup>
                              )}
                            />
                            {isChecked2 === 'Y' && (
                              <>
                                <AreaTitle>
                                  <h4>조치사항</h4>
                                </AreaTitle>
                                <Textarea
                                  label=""
                                  placeholder="ex) 홍길동 학생이 조퇴로 수업을 듣지못한 부분은 수업자료를 공유해주고, 동영상 강의로 대체함"
                                  className="w-full"
                                  variant="bordered"
                                  minRows={5}
                                  onChange={e => {
                                    register('check2con').onChange(e)
                                  }}
                                  {...register('check2con', {
                                    required: {
                                      value: true,
                                      message:
                                        '조치사항을 자세히 입력해주세요.',
                                    },
                                    validate: {
                                      minLength: value => {
                                        if (value.trim().length < 11) {
                                          return '조치사항을 최소 10자 이상 입력해주세요.'
                                        }
                                        return true
                                      },
                                    },
                                  })}
                                />
                                {errors.check2con && (
                                  <p className="px-2 pt-2 text-xs text-red">
                                    {String(errors.check2con.message)}
                                  </p>
                                )}
                              </>
                            )}
                          </AreaSection>
                          {/* <AreaSection className="last">
                              <AreaTitle>
                                <h4>지시사항</h4>
                              </AreaTitle>
                              <Textarea
                                label=""
                                defaultValue={workLogData?.instruction}
                                placeholder="내용을 작성해주세요."
                                className="w-full"
                                variant="bordered"
                                minRows={5}
                                onChange={e => {
                                  register('instruction').onChange(e)
                                }}
                                {...register('instruction')}
                              />
                              {errors.instruction && (
                                <p className="px-2 pt-2 text-xs text-red">
                                  {String(errors.instruction.message)}
                                </p>
                              )}
                            </AreaSection> */}
                        </ScrollShadow>
                      </DetailDiv>
                    </ScrollShadow>
                  </DatailBody>
                </ModalBody>
                <ModalFooter className="workLogFooter">
                  <Button
                    size="sm"
                    variant="bordered"
                    className="text-accent border-accent"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    onClick={handlePrint}
                  >
                    인쇄
                  </Button>
                  <Button size="sm" color="primary" type="submit">
                    {workLogData?.paymentOne ? '일지 수정' : '일지 등록'}
                  </Button>
                </ModalFooter>
              </form>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
