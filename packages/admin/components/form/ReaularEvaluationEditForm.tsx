import {
  DELETE_REGULAR_EVALUATION_SET_MUTATION,
  EDIT_REGULAR_EVALUATION_SET_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import ListInfo from '@/components/common/ListInfo'

const DetailForm = styled.form`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  border: 2px solid hsl(240 6% 90%);
  padding: 1rem;
  border-radius: 0.5rem;
`

const FlexBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1 3;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  &.textBox {
    align-items: center;
  }
`

const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;

  span {
    color: red;
  }
`

const BtnBox = styled.div`
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

export default function ReaularEvaluationEditForm({
  item,
  refetch,
  setPage,
  mId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [editRegularEvaluationSet] = useMutation(
    EDIT_REGULAR_EVALUATION_SET_MUTATION,
  )
  const [deleteRegularEvaluationSet] = useMutation(
    DELETE_REGULAR_EVALUATION_SET_MUTATION,
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      statusType: '',
      points: '',
      evaluationDetails: '',
    },
  })

  useEffect(() => {
    reset({
      statusType: item.statusType || '',
      points: item.points || 0,
      evaluationDetails: item.evaluationDetails || '',
    })
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editRegularEvaluationSet({
            variables: {
              editRegularEvaluationSetId: item.id,
              statusType: data.statusType === '' ? null : data.statusType,
              evaluationDetails:
                data.evaluationDetails === '' ? null : data.evaluationDetails,
              points: data.points === '' ? 0 : parseInt(data.points),
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${data.statusType} 정기평가 내용 id:${item.id} 수정`,
          //   `ok: ${
          //     result.data.editRegularEvaluationSet.ok
          //   } / ${dirtyFieldsArray.join(', ')}`,
          // )

          if (!result.data.editRegularEvaluationSet.ok) {
            throw new Error('정기평가 내용 수정 실패')
          }
          setPage(1)
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('정기평가 내용 수정 중 에러 발생:', error)
          alert('정기평가 내용 수정 처리 중 오류가 발생했습니다.')
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const deleteItem = async id => {
    const isDelete = confirm('삭제하시겠습니까?\n삭제 후 되돌리수 없습니다.')
    if (isDelete) {
      try {
        const result = await deleteRegularEvaluationSet({
          variables: {
            deleteRegularEvaluationSetId: id,
          },
        })
        // userLogs(
        //   `정기평가 내용 삭제`,
        //   `ok: ${result.data.deleteRegularEvaluationSet.ok}`,
        // )

        if (!result.data.deleteRegularEvaluationSet.ok) {
          throw new Error('정기평가 내용 삭제 실패')
        }
        setPage(1)
        refetch()
        alert('삭제되었습니다.')
      } catch (error) {
        console.error('정기평가 내용 삭제 중 에러 발생:', error)
        alert('정기평가 내용 삭제 중 오류가 발생했습니다.')
      }
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

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Input
              isReadOnly
              variant={'bordered'}
              labelPlacement="outside"
              label={
                <FilterLabel>
                  구분 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('statusType', {
                required: {
                  value: true,
                  message: '구분을 작성해주세요',
                },
              })}
            />
            {errors.statusType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.statusType.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              isReadOnly
              variant={'bordered'}
              labelPlacement="outside"
              label={
                <FilterLabel>
                  배점 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('points', {
                required: {
                  value: true,
                  message: '배점을 작성해주세요',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: '숫자만 사용가능합니다.',
                },
              })}
            />
            {errors.points && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.points.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox className="textBox">
          <AreaBox>
            <Textarea
              isReadOnly
              variant={'bordered'}
              label={
                <FilterLabel>
                  평가내용 <span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              minRows={5}
              onChange={e => {
                register('evaluationDetails').onChange(e)
              }}
              {...register('evaluationDetails', {
                required: {
                  value: true,
                  message: '평가내용을 입력해주세요.',
                },
              })}
            />
            {errors.evaluationDetails && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.evaluationDetails.message)}
              </p>
            )}
          </AreaBox>

          {/* <BtnBox>
            <Button
              type="submit"
              size="md"
              radius="md"
              color="primary"
              className="md:w-[50%] w-full"
            >
              수정
            </Button>
            <Button
              variant="bordered"
              color="primary"
              className="w-full text-primary"
              onClick={() => deleteItem(item.id)}
            >
              삭제
            </Button>
          </BtnBox> */}
        </FlexBox>
        <ListInfo item={item} />
      </DetailForm>
    </>
  )
}
