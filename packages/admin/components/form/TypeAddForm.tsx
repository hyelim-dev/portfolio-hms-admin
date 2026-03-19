import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { CREATE_ADVICE_TYPE_MUTATION } from '@/graphql/mutations'
import {
  SEE_ADVICE_TYPE_ORDER_QUERY,
  SEE_ADVICE_TYPE_QUERY,
} from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { useEffect, useState } from 'react'

const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1rem;
`
const FlexBox = styled.div`
  display: flex;
  width: 50%;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    gap: 1rem;
  }
`
const ItemBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`
const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 70%;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`
const FilterLabel = styled.div`
  width: max-content;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;
`

export default function TypeAddForm({ category, typeOnOPen, totalCount }) {
  // const { userLogs } = useUserLogsMutation()

  const [createAdvice] = useMutation(CREATE_ADVICE_TYPE_MUTATION)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: '',
    },
  })

  const openOrderChange = () => {
    typeOnOPen()
  }

  const onSubmit = async data => {
    if (category === '발신인증번호') {
      const confirmClick = confirm(
        '이용증명원이 등록된 번호입니까?\n자세한 내용은 상단 "자세히보기" 버튼을 클릭해주세요.',
      )

      if (!confirmClick) {
        return
      }
    }

    try {
      const result = await createAdvice({
        variables: {
          type: data.type,
          indexNum: totalCount + 1,
          category: category,
        },
        refetchQueries: [
          {
            query: SEE_ADVICE_TYPE_QUERY,
            variables: {
              page: 1,
              limit: 50,
              category: category,
            },
          },
          {
            query: SEE_ADVICE_TYPE_ORDER_QUERY,
            variables: {
              page: 1,
              limit: 30,
              category: category,
            },
          },
        ],
      })

      // userLogs(
      //   `${data.type} ${category} 등록`,
      //   `ok: ${result.data.createAdviceType.ok}`,
      // )

      if (!result.data.createAdviceType.ok) {
        if (result.data.createAdviceType.message === '중복되는 분야 입니다.') {
          alert(`'${data.type}'은 중복되는 ${category}입니다.`)
        }
        throw new Error(`${category} 등록 실패`)
      }

      alert(`${category}가 등록되었습니다.`)
      reset()
    } catch (error) {
      console.error(`${category} 등록 중 에러 발생:`, error)
    }
  }

  return (
    <FilterForm onSubmit={handleSubmit(onSubmit)}>
      <ItemBox>
        <InputBox>
          <Input
            labelPlacement="outside-left"
            placeholder="2글자 이상 작성해주세요."
            type="text"
            variant="bordered"
            classNames={{
              mainWrapper: 'w-full',
            }}
            label={<FilterLabel>{category}</FilterLabel>}
            onChange={e => {
              register('type').onChange(e)
            }}
            {...register('type', {
              required: {
                value: true,
                message: '내용을 작성해주세요',
              },
              minLength: {
                value: 2,
                message: '2글자 이상 작성해주세요',
              },
            })}
          />
          {errors.type && (
            <p className="w-full ml-[6rem] text-xs text-red">
              {String(errors.type.message)}
            </p>
          )}
        </InputBox>
        <FlexBox>
          <Button type="submit" color="primary" size="md" className="w-[50%]">
            등록
          </Button>
          <Button
            type="button"
            color="primary"
            size="md"
            variant="bordered"
            className="w-[50%]"
            onClick={openOrderChange}
          >
            순서변경
          </Button>
        </FlexBox>
      </ItemBox>
    </FilterForm>
  )
}
