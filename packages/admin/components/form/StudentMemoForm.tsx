import { useEffect } from 'react'
import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import {
  CREATE_STUDENT_MEMO_MUTATION,
  SEARCH_STUDENT_MEMO_MUTATION,
} from '@/graphql/mutations'
import { useForm } from 'react-hook-form'
import { demoAlert, IS_DEMO } from '@/utils/demo'
// import useUserLogsMutation from '@/utils/userLogs'

const DetailForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const MemoBox = styled.div`
  width: 100%;
  display: flex;
  flex: 1 3;
  gap: 1rem;
  align-items: center;

  textarea {
    width: 100%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`
const MemoBtn = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.75rem;
  width: 5rem;

  @media (max-width: 768px) {
    padding-top: 0;
    width: 100%;
  }
`

export default function StudentMemoForm(props) {
  const studentId = props.studentId
  // const { userLogs } = useUserLogsMutation()
  const [createMemo] = useMutation(CREATE_STUDENT_MEMO_MUTATION)
  const [searchStudentMutation] = useMutation(SEARCH_STUDENT_MEMO_MUTATION)
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { content: '', studentStateId: studentId },
  })
  const { isDirty, isSubmitSuccessful } = formState

  const onSubmit = async data => {
    if (IS_DEMO) {
      demoAlert()
      return
    }

    if (isDirty) {
      try {
        const { content } = data

        const {
          data: {
            createStudentMemo: { ok },
          },
        } = await createMemo({
          variables: {
            content: content.trim(),
            studentId: studentId,
          },
        })

        // userLogs(`수강생 ID:${studentId} 메모 등록`, `ok: ${ok}`)

        if (!ok) {
          throw new Error('메모 등록 실패')
        }

        props.setMemoList([])

        const {
          data: { searchStudent },
        } = await searchStudentMutation({
          variables: {
            searchStudentId: parseInt(studentId),
          },
        })

        if (!searchStudent.ok) {
          throw new Error('학생 조회 실패')
        }

        const { studentMemo } = searchStudent.student[0]
        props.setMemoList(studentMemo)
        alert('메모가 등록되었습니다.')
      } catch (error) {
        console.error('에러 발생:', error)
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ content: '' })
    }
  }, [formState])
  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <MemoBox>
          <Textarea
            label="메모작성"
            labelPlacement="outside"
            className="max-w-full"
            variant="bordered"
            minRows={5}
            onChange={e => {
              register('content').onChange(e)
            }}
            {...register('content')}
          />
          <MemoBtn>
            <Button type="submit" color="primary" className="w-full text-white">
              등록
            </Button>
          </MemoBtn>
        </MemoBox>
      </DetailForm>
    </>
  )
}
