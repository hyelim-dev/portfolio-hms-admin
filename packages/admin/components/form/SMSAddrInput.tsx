import styled from 'styled-components'
import { Button, Input } from '@nextui-org/react'
import { useForm } from 'react-hook-form'

const ItemBox = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-direction: column;
  }
`

export default function handleCheck({ groupSelected, setGroupSelected }) {
  const { register, handleSubmit, watch } = useForm()
  const phoneNumber = watch('phoneNumber')

  const onSubmit = data => {
    if (phoneNumber) {
      const isDuplicate = groupSelected.some(
        group => group.phoneNumber === data.phoneNumber,
      )

      if (!isDuplicate) {
        if (groupSelected.length > 0) {
          const addGroup = [...groupSelected, { phoneNumber: data.phoneNumber }]
          setGroupSelected(addGroup)
        } else {
          setGroupSelected([{ phoneNumber: data.phoneNumber }])
        }
      } else {
        alert('이미 존재하는 전화번호입니다.')
      }
    }
  }

  return (
    <ItemBox onSubmit={handleSubmit(onSubmit)}>
      <Input
        labelPlacement="outside"
        placeholder="'-'없이 작성해주세요"
        variant="bordered"
        radius="md"
        type="text"
        label="전화번호"
        maxLength={11}
        className="w-full"
        {...register('phoneNumber', {
          maxLength: {
            value: 11,
            message: '최대 11자리까지 입력 가능합니다.',
          },
          minLength: {
            value: 10,
            message: '최소 10자리 이상이어야 합니다.',
          },
          pattern: {
            value: /^010[0-9]{7,8}$/,
            message: '010으로 시작해주세요.',
          },
        })}
      />
      <Button
        type="submit"
        variant="bordered"
        color="primary"
        className="w-full md:w-auto"
      >
        추가 &#43;
      </Button>
    </ItemBox>
  )
}
