import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
// import useUserLogsMutation from '@/utils/userLogs'
import { EDIT_HOPE_FOR_EMPLOYMENT_MUTATION } from '@/graphql/mutations'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
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
  position: relative;
`
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: red;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`

export default function WishEditForm({ item, refetch }) {
  // const { userLogs } = useUserLogsMutation()
  const [editHope] = useMutation(EDIT_HOPE_FOR_EMPLOYMENT_MUTATION)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      workingArea: '',
      fieldOfHope: '',
      hopefulReward: '',
      workType: '',
      workingHours: '',
      opinion: '',
    },
  })

  useEffect(() => {
    if (item) {
      reset({
        workingArea: item.workingArea || '',
        fieldOfHope: item.fieldOfHope || '',
        hopefulReward: item.hopefulReward || '',
        workType: item.workType || '',
        workingHours: item.workingHours || '',
        opinion: item.opinion || '',
      })
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editHope({
            variables: {
              editHopeForEmploymentId: item.id,
              workingArea: data.workingArea === '' ? null : data.workingArea,
              fieldOfHope: data.fieldOfHope === '' ? null : data.fieldOfHope,
              hopefulReward:
                data.hopefulReward === '' ? null : parseInt(data.hopefulReward),
              workType: data.workType === '' ? null : data.workType,
              workingHours:
                data.workingHours === '' ? null : parseInt(data.workingHours),
              opinion: data.opinion === '' ? null : data.opinion,
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} 취업 희망 현황 수정`,
          //   `ok: ${
          //     result.data.editHopeForEmployment.ok
          //   } / ${dirtyFieldsArray.join(', ')}`,
          // )

          if (!result.data.editHopeForEmployment.ok) {
            throw new Error('취업 희망 현황 수정 실패')
          }
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('취업 희망 현황 수정 중 에러 발생:', error)
          alert('취업 희망 현황 수정 처리 중 오류가 발생했습니다.')
        }
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DetailDiv>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="근무지역"
              variant={'bordered'}
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  근무지역 <span>*</span>
                </FilterLabel>
              }
              className="w-full"
              onChange={e => {
                register('workingArea').onChange(e)
              }}
              {...register('workingArea', {
                required: {
                  value: true,
                  message: '근무지역을 입력해주세요.',
                },
              })}
            />
            {errors.workingArea && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.workingArea.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="희망분야"
              variant={'bordered'}
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  희망분야<span>*</span>
                </FilterLabel>
              }
              className="w-full"
              onChange={e => {
                register('fieldOfHope').onChange(e)
              }}
              {...register('fieldOfHope', {
                required: {
                  value: true,
                  message: '희망분야를 입력해주세요.',
                },
              })}
            />
            {errors.fieldOfHope && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.fieldOfHope.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="희망보수"
              variant="bordered"
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  희망보수 <span>*</span>
                </FilterLabel>
              }
              className="w-full"
              onChange={e => {
                register('hopefulReward').onChange(e)
              }}
              {...register('hopefulReward', {
                required: {
                  value: true,
                  message: '희망보수를 입력해주세요.',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: '숫자만 사용가능합니다.',
                },
              })}
            />
            {errors.hopefulReward && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.hopefulReward.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  근무형태 <span>*</span>
                </FilterLabel>
              }
              className="w-full"
              onChange={e => {
                register('workType').onChange(e)
              }}
              {...register('workType', {
                required: {
                  value: true,
                  message: '근무형태를 입력해주세요.',
                },
              })}
            />
            {errors.workType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.workType.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  근무시간 <span>*</span>
                </FilterLabel>
              }
              className="w-full"
              onChange={e => {
                register('workingHours').onChange(e)
              }}
              {...register('workingHours', {
                required: {
                  value: true,
                  message: '근무시간을 입력해주세요.',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: '숫자만 사용가능합니다.',
                },
              })}
            />
            {errors.workingHours && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.workingHours.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  교육수료 후 취업에 대한 의견 <span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('opinion').onChange(e)
              }}
              {...register('opinion', {
                required: {
                  value: true,
                  message: '교육수료 후 취업에 대한 의견을 입력해주세요.',
                },
              })}
            />
            {errors.opinion && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.opinion.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <BtnBox>
          <Button
            type="submit"
            size="md"
            radius="md"
            variant="solid"
            color="primary"
            className="w-full text-white md:w-[50%]"
          >
            수정
          </Button>
        </BtnBox>
      </DetailDiv>
    </form>
  )
}
