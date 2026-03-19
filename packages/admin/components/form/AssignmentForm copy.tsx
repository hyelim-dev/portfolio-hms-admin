import { useState } from 'react'
import { styled } from 'styled-components'
import { Button, Textarea, useDisclosure } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
// import useUserLogsMutation from '@/utils/userLogs'
import { useRecoilValue } from 'recoil'
import {
  assignmentState,
  completionStatus,
  gradeState,
} from '@/lib/recoilAtoms'
import useMmeQuery from '@/utils/mMe'
import {
  CLASS_CANCEL_MUTATION,
  CLASS_CHECK_MUTATION,
  SEARCH_PAYMENT_MUTATION,
  UPDATE_STUDENT_COURSE_MUTATION,
} from '@/graphql/mutations'
import DropOutInput from '@/components/modal/DropOutInput'

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
  // const { userLogs } = useUserLogsMutation()
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  const [updateStudentCourseMutation] = useMutation(
    UPDATE_STUDENT_COURSE_MUTATION,
  )
  const [searchStudentPayment] = useMutation(SEARCH_PAYMENT_MUTATION)
  const [classCancelMutation] = useMutation(CLASS_CANCEL_MUTATION)
  const [classCheckMutation] = useMutation(CLASS_CHECK_MUTATION)
  const [dropOutType, setDropOutType] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const searchAndUpdateStudentPayment = async () => {
    const {
      data: {
        searchStudentPayment: {
          ok,
          data: [firstData],
        },
      },
    } = await searchStudentPayment({
      variables: {
        searchStudentPaymentId: parseInt(paymentId),
      },
    })
    if (ok) {
      setStudentPaymentData(firstData)
      return true
    }
    return false
  }

  const editAssignment = async state => {
    const changeAssignment = confirm(
      `${studentData?.name}학생을 "${state}"하시겠습니까? \n 과정명 : ${studentSubjectData?.subjectName}`,
    )
    if (changeAssignment) {
      const isCurrentlyAssigned =
        studentPaymentData.lectureAssignment === assignment.assignment

      const updateLogic = async () => {
        const success = await updateStudentCourseMutation({
          variables: {
            editStudentPaymentId: parseInt(studentPaymentData.id),
            lectureAssignment: state,
            subjectId: studentPaymentData.subjectId,
            processingManagerId: studentPaymentData.processingManagerId,
            lastModifiedTime: new Date(),
          },
        })

        // userLogs(
        //   `${studentData?.name}학생 "${state}"처리`,
        //   `ok: ${success.data.editStudentPayment.ok}`,
        // )

        if (success.data.editStudentPayment.ok) {
          if (state === assignment.assignment) {
            await classCancelMutation({
              variables: {
                classCancellationId: parseInt(studentPaymentData.id),
                courseComplete: completion.inTraining,
                lastModifiedTime: new Date(),
              },
              onCompleted: async () => {
                const success2 = await searchAndUpdateStudentPayment()
                if (success2) {
                  alert(`${studentData?.name}학생을 "${state}"처리 하였습니다.`)
                }
              },
            })
          } else {
            await classCancelMutation({
              variables: {
                classCancellationId: parseInt(studentPaymentData.id),
                courseComplete: completion.notAttended,
                lastModifiedTime: new Date(),
              },
              onCompleted: async () => {
                const success2 = await searchAndUpdateStudentPayment()
                if (success2) {
                  alert(`${studentData?.name}학생을 "${state}"처리 하였습니다.`)
                }
              },
            })
          }
        }
        return success
      }
      if (!isCurrentlyAssigned) {
        const {
          data: {
            duplicateCheck: { ok },
          },
        } = await classCheckMutation({
          variables: {
            studentId: studentData.id,
            subjectId: studentPaymentData.subjectId,
          },
        })
        if (ok) {
          await updateLogic()
        } else {
          alert('강의가 중복됩니다. 배정할 수 없습니다.')
        }
      } else {
        await updateLogic()
      }
    }
  }

  const clickAssignment = async state => {
    if (editable) {
      if (studentSubjectData?.lectures === null) {
        alert('강의가 생성된 과정만 변경 가능합니다.')
      } else {
        editAssignment(state)
      }
    } else {
      alert('권한이 없습니다.')
    }
  }

  const clickCompletion = async (state, dropOut, date?, reason?) => {
    if (editable) {
      const changeCompletion = confirm(
        `${studentData?.name}학생을 "${state}"처리 하시겠습니까?\n다시 수정 불가능합니다. \n 과정명 : ${studentSubjectData?.subjectName}`,
      )
      if (changeCompletion) {
        let success
        if (dropOut) {
          success = await classCancelMutation({
            variables: {
              classCancellationId: parseInt(studentPaymentData.id),
              courseComplete: state,
              dateOfDroppingOut: date,
              reasonFordroppingOut: reason,
              lastModifiedTime: new Date(),
            },
          })
        } else {
          success = await classCancelMutation({
            variables: {
              classCancellationId: parseInt(studentPaymentData.id),
              courseComplete: state,
              lastModifiedTime: new Date(),
            },
          })
        }
        // userLogs(
        //   `${studentData?.name}학생 "${state}"처리`,
        //   `ok: ${success.data.classCancellation.ok}`,
        // )
        if (success.data.classCancellation.ok) {
          const success2 = await searchAndUpdateStudentPayment()
          if (success2) {
            alert(`${studentData?.name}학생을 "${state}"처리 하였습니다.`)
          }
        }
      }
    } else {
      alert('권한이 없습니다.')
    }
  }

  const dropOutClick = type => {
    setDropOutType(type)
    onOpen()
  }

  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
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

  return (
    <>
      <div>
        <FilterLabel>배정 여부</FilterLabel>
        <FlexBtnBox>
          <Button
            isDisabled={
              studentPaymentData?.lectureAssignment === assignment.unassigned
                ? true
                : false
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
                ? true
                : false
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
                ? true
                : false
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
      {studentPaymentData?.lectureAssignment == assignment.assignment && (
        <div>
          <FilterLabel>수료 여부</FilterLabel>
          <FlexBtnBox>
            <Button
              isDisabled={
                studentPaymentData?.courseComplete === completion.inTraining
                  ? true
                  : false
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
                  ? true
                  : false
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
                  ? true
                  : false
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
                  ? true
                  : false
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
                {formatDate(studentPaymentData?.dateOfDroppingOut, false)}
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
