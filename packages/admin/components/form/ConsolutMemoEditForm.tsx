import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import {
  DELETE_CONSULTATION_MEMO_MUTATION,
  SEARCH_STUDENTSTATE_MUTATION,
  UPDATE_CONSULTATION_MEMO_MUTATION,
} from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import useMmeQuery from '@/utils/mMe'
import { demoAlert, IS_DEMO, withDemoGuard } from '@/utils/demo'

const DetailForm = styled.form`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`
const MemoListBtn = styled.p`
  display: flex;
  gap: 0.5rem;

  flex-direction: column;

  button {
    width: 5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;

    button {
      width: 50%;
    }
  }
`
const MemoInfo = styled.label`
  display: flex;
  gap: 0.3rem;
`
const MemoGrade = styled.span`
  width: 0.8rem;
  height: 0.8rem;
  overflow: hidden;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.tertiary};
  text-align: center;
  font-weight: 700;
  color: #fff;
  line-height: 0.8rem;
  font-size: 0.5rem;
`
const MemoName = styled.span`
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
`
const MemoTime = styled.span``
const MemoEditTime = styled.span`
  font-size: 0.75rem;
  padding-left: 0.75rem;
  color: ${({ theme }) => theme.colors.gray};
`

export default function ConsolutMemoEditForm(props) {
  const { useMme } = useMmeQuery()
  const mId = useMme('id')
  // const { userLogs } = useUserLogsMutation()
  const [deleteMemo] = useMutation(DELETE_CONSULTATION_MEMO_MUTATION)
  const [updateMemo] = useMutation(UPDATE_CONSULTATION_MEMO_MUTATION)
  const [searchStudentStateMutation] = useMutation(SEARCH_STUDENTSTATE_MUTATION)
  const { register, handleSubmit, control, formState } = useForm({})
  const { isDirty } = formState

  async function fetchAndUpdateStudentState(studentId) {
    try {
      const {
        data: { searchStudentState },
      } = await searchStudentStateMutation({
        variables: {
          searchStudentStateId: studentId,
        },
      })

      if (!searchStudentState.ok) {
        throw new Error('학생 상태 조회 실패')
      }

      const [firstStudentState] = searchStudentState.studentState
      props.setMemoList(firstStudentState.consultationMemo)
    } catch (error) {
      console.error('에러 발생:', error)
      throw error
    }
  }

  const onDelete = async item => {
    const isDelete = confirm('메모를 삭제하시겠습니까?')
    if (isDelete) {
      try {
        const {
          data: {
            deleteConsultationMemo: { ok },
          },
        } = await deleteMemo({
          variables: {
            deleteConsultationMemoId: item.id,
          },
        })
        // userLogs(`상담학생 id:${item.id} 메모 삭제`, `ok: ${ok}`)
        if (!ok) {
          throw new Error('메모 삭제 실패')
        }

        props.setMemoList([])
        alert('메모가 삭제되었습니다.')
        await fetchAndUpdateStudentState(item.studentStateId)
      } catch (error) {
        console.error('에러 발생:', error)
      }
    }
  }

  const onSubmit = async data => {
    if (IS_DEMO) {
      demoAlert()
      return
    }

    if (isDirty) {
      try {
        const {
          data: {
            updateConsultationMemo: { ok },
          },
        } = await updateMemo({
          variables: {
            updateConsultationMemoId: parseInt(data.id),
            content: data.content.trim(),
            lastModifiedTime: new Date(),
          },
        })
        // userLogs(`상담학생 id:${data.id} 메모 수정`, `ok: ${ok}`)
        if (!ok) {
          throw new Error('메모 수정 실패')
        }

        props.setMemoList([])
        alert('메모가 수정되었습니다.')
        await fetchAndUpdateStudentState(props.studentId)
      } catch (error) {
        console.error('에러 발생:', error)
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}:` +
      `${date.getSeconds().toString().padStart(2, '0')}`

    return formatted
  }

  const gradeStr = data => {
    if (data == null) {
      return 'A'
    } else {
      const idF = data?.charAt(0).toUpperCase()
      return idF
    }
  }

  return (
    <DetailForm onSubmit={handleSubmit(onSubmit)}>
      <TextBox>
        <Input
          labelPlacement="outside"
          placeholder=" "
          variant="bordered"
          radius="md"
          type="text"
          label="아이디"
          defaultValue={props.item?.id}
          value={props.item?.id}
          className="hidden w-full"
          {...register('id')}
        />
        <Controller
          name="content"
          control={control}
          defaultValue={props.item.content}
          render={({ field }) => (
            <>
              <Textarea
                label={
                  <MemoInfo>
                    <MemoGrade>
                      {gradeStr(props.item.manageUser?.mUserId)}
                    </MemoGrade>
                    <MemoName>{props.item.manageUser?.mUsername}</MemoName>
                    <MemoTime>{formatDate(props.item.createdAt)}</MemoTime>
                  </MemoInfo>
                }
                ref={field.ref}
                isReadOnly={mId == props.item.manageUser?.id ? false : true}
                variant="faded"
                className="max-w-full"
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                {...register('content')}
              />
            </>
          )}
        />
        {props.item.lastModifiedTime && (
          <MemoEditTime>
            {formatDate(props.item.lastModifiedTime)} 편집됨
          </MemoEditTime>
        )}
      </TextBox>
      {mId == props.item.manageUser?.id && (
        <MemoListBtn>
          <Button type="submit" color="primary" className="w-full text-white">
            수정
          </Button>
          <Button
            color="primary"
            variant="bordered"
            className="w-[50%] text-primary"
            onClick={withDemoGuard(() => onDelete(props.item))}
          >
            삭제
          </Button>
        </MemoListBtn>
      )}
    </DetailForm>
  )
}
