import { styled } from 'styled-components'
import { Button, Textarea, useDisclosure } from '@nextui-org/react'
import { useRecoilValue } from 'recoil'
import { assignmentState, completionStatus } from '@/lib/recoilAtoms'
import {
  getStudentDb,
  updateStudentDb,
} from '@/src/mocks/storage/studentStorage'
import DropOutInput from '@/components/modal/DropOutInput'
import { useState } from 'react'

const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaSmallBox = styled.div`
  @media (max-width: 768px) {
    width: 100% !important;
  }
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
`
const FlexBtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    button {
      width: calc(50% - 0.5rem);
    }
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

export default function AssignmentForm({
  paymentId,
  studentData,
  studentSubjectData,
  studentPaymentData,
  setStudentPaymentData,
  studentPaymentDetailData,
  editable,
}) {
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  const [dropOutType, setDropOutType] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const searchAndUpdateStudentPayment = async () => {
    const db = getStudentDb()
    const found = db.payments.find(
      item => Number(item.id) === Number(paymentId),
    )

    if (found) {
      setStudentPaymentData(found)
      return true
    }

    return false
  }

  const clickAssignment = async state => {
    if (!editable) {
      alert('권한이 없습니다.')
      return
    }

    if (studentSubjectData?.lectures === null) {
      alert('강의가 생성된 과정만 변경 가능합니다.')
      return
    }

    const changeAssignment = confirm(
      `${studentData?.name}학생을 "${state}"하시겠습니까? \n 과정명 : ${studentSubjectData?.subjectName}`,
    )

    if (!changeAssignment) return

    updateStudentDb(db => {
      const payment = db.payments.find(
        item => Number(item.id) === Number(studentPaymentData.id),
      )

      if (!payment) return

      payment.lectureAssignment = state
      payment.lastModifiedTime = String(Date.now())
      payment.updatedAt = String(Date.now())
      payment.lastModifiedByName = '직원'
      payment.lastModifiedByUserId = 'general'

      if (state === assignment.assignment) {
        payment.courseComplete = completion.inTraining
      } else {
        payment.courseComplete = completion.notAttended
        payment.dateOfDroppingOut = null
        payment.reasonFordroppingOut = null
      }
    })

    const success = await searchAndUpdateStudentPayment()

    if (success) {
      alert(
        `데모 환경에서는 강의/출석부와 실제 연동되지는 않습니다.\n${studentData?.name}학생을 "${state}" 처리했습니다.`,
      )
    }
  }

  const clickCompletion = async (state, dropOut, date?, reason?) => {
    if (!editable) {
      alert('권한이 없습니다.')
      return
    }

    const changeCompletion = confirm(
      `${studentData?.name}학생을 "${state}"처리 하시겠습니까?\n다시 수정 불가능합니다. \n 과정명 : ${studentSubjectData?.subjectName}`,
    )

    if (!changeCompletion) return

    updateStudentDb(db => {
      const payment = db.payments.find(
        item => Number(item.id) === Number(studentPaymentData.id),
      )

      if (!payment) return

      payment.courseComplete = state
      payment.lastModifiedTime = String(Date.now())
      payment.updatedAt = String(Date.now())
      payment.lastModifiedByName = '직원'
      payment.lastModifiedByUserId = 'general'

      if (dropOut) {
        payment.dateOfDroppingOut = date
          ? String(new Date(date).getTime())
          : null
        payment.reasonFordroppingOut = reason ?? null
      } else {
        payment.dateOfDroppingOut = null
        payment.reasonFordroppingOut = null
      }
    })

    const success = await searchAndUpdateStudentPayment()

    if (success) {
      alert(
        `데모 환경에서는 실제 강의/학적부/출석부 데이터에 반영되지 않습니다.\n${studentData?.name}학생을 "${state}" 처리했습니다.`,
      )
    }
  }

  const dropOutClick = type => {
    setDropOutType(type)
    onOpen()
  }

  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)

    if (Number.isNaN(timestamp)) return '-'

    if (isTime) {
      return (
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
      )
    }

    return (
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')}`
    )
  }

  return (
    <>
      <div>
        <FilterLabel>배정 여부</FilterLabel>
        <FlexBtnBox>
          <Button
            isDisabled={
              studentPaymentData?.lectureAssignment === assignment.unassigned
            }
            size="md"
            radius="md"
            variant={
              studentPaymentData?.lectureAssignment === assignment.unassigned
                ? 'solid'
                : 'bordered'
            }
            className={
              studentPaymentData?.lectureAssignment === assignment.unassigned
                ? 'w-full text-white bg-secondary opacity-100'
                : 'w-full text-secondary border-secondary opacity-100'
            }
            onClick={() => clickAssignment(assignment.unassigned)}
          >
            {assignment.unassigned}
          </Button>

          <Button
            isDisabled={
              studentPaymentData?.lectureAssignment === assignment.assignment
            }
            size="md"
            radius="md"
            variant={
              studentPaymentData?.lectureAssignment === assignment.assignment
                ? 'solid'
                : 'bordered'
            }
            className={
              studentPaymentData?.lectureAssignment === assignment.assignment
                ? 'w-full text-white bg-secondary opacity-100'
                : 'w-full text-secondary border-secondary opacity-100'
            }
            onClick={() => clickAssignment(assignment.assignment)}
          >
            {assignment.assignment}
          </Button>

          <Button
            isDisabled={
              studentPaymentData?.lectureAssignment === assignment.withdrawal
            }
            size="md"
            radius="md"
            variant={
              studentPaymentData?.lectureAssignment === assignment.withdrawal
                ? 'solid'
                : 'bordered'
            }
            className={
              studentPaymentData?.lectureAssignment === assignment.withdrawal
                ? 'w-full text-white bg-secondary opacity-100'
                : 'w-full text-secondary border-secondary opacity-100'
            }
            onClick={() => clickAssignment(assignment.withdrawal)}
          >
            {assignment.withdrawal}
          </Button>
        </FlexBtnBox>
      </div>

      {studentPaymentData?.lectureAssignment === assignment.assignment && (
        <div>
          <FilterLabel>수료 여부</FilterLabel>
          <FlexBtnBox>
            <Button
              isDisabled={
                studentPaymentData?.courseComplete === completion.inTraining
              }
              size="md"
              radius="md"
              variant={
                studentPaymentData?.courseComplete === completion.inTraining
                  ? 'solid'
                  : 'bordered'
              }
              color="primary"
              className="w-full opacity-100"
              onClick={() => clickCompletion(completion.inTraining, false)}
            >
              {completion.inTraining}
            </Button>

            <Button
              isDisabled={
                studentPaymentData?.courseComplete === completion.dropout
              }
              size="md"
              radius="md"
              variant={
                studentPaymentData?.courseComplete === completion.dropout
                  ? 'solid'
                  : 'bordered'
              }
              color="primary"
              className="w-full opacity-100"
              onClick={() => dropOutClick(completion.dropout)}
            >
              {completion.dropout}
            </Button>

            <Button
              isDisabled={
                studentPaymentData?.courseComplete === completion.completed
              }
              size="md"
              radius="md"
              variant={
                studentPaymentData?.courseComplete === completion.completed
                  ? 'solid'
                  : 'bordered'
              }
              color="primary"
              className="w-full opacity-100"
              onClick={() => clickCompletion(completion.completed, false)}
            >
              {completion.completed}
            </Button>

            <Button
              isDisabled={
                studentPaymentData?.courseComplete === completion.notCompleted
              }
              size="md"
              radius="md"
              variant={
                studentPaymentData?.courseComplete === completion.notCompleted
                  ? 'solid'
                  : 'bordered'
              }
              color="primary"
              className="w-full opacity-100"
              onClick={() => dropOutClick(completion.notCompleted)}
            >
              {completion.notCompleted}
            </Button>
          </FlexBtnBox>
        </div>
      )}

      {studentPaymentData?.courseComplete === completion.dropout ||
      studentPaymentData?.courseComplete === completion.notCompleted ? (
        <FlexBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            <div>
              <FilterLabel>중도탈락 날짜</FilterLabel>
              <LineBox>
                {studentPaymentData?.dateOfDroppingOut
                  ? formatDate(studentPaymentData?.dateOfDroppingOut, false)
                  : '-'}
              </LineBox>
            </div>
          </AreaSmallBox>

          <AreaBox>
            <div>
              <Textarea
                label="중도탈락 사유"
                isDisabled={true}
                isReadOnly={true}
                labelPlacement="outside"
                value={studentPaymentData?.reasonFordroppingOut || ''}
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
      ) : null}

      <DropOutInput
        isOpen={isOpen}
        onClose={onClose}
        clickCompletion={clickCompletion}
        dropOutType={dropOutType}
      />
    </>
  )
}
