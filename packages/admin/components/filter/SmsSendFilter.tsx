import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { smsPageState } from '@/lib/recoilAtoms'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'

const FilterBox = styled(motion.div)`
  z-index: 5;
  position: relative;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 790px) {
    width: 100%;
  }
`
const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1rem;
  padding: 0;
  flex-direction: column;

  @media (max-width: 790px) {
    padding: 0.5rem 0.75rem 2rem;
  }
`
const BoxTop = styled.div`
  display: flex;
  flex: 1;
  gap: 0.5rem;
  align-items: flex-end;
`
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`

const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
`

export default function SmsSendFilter({
  filterSearch,
  onFilterSearch,
  setSmsFilter,
  smsFilter,
}) {
  const smsPage = useResetRecoilState(smsPageState)
  const [receiver, setReceiver] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      receiver: '',
    },
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 790)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 초기 로드 시 실행

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(smsFilter).length === 0 || smsFilter?.phoneNum === null) {
      setReceiver('')
    } else {
      setReceiver(smsFilter?.receiver)
    }
  }, [])

  const onSubmit = data => {
    if (isDirty) {
      const filter = {
        receiver: data.receiver,
      }
      setSmsFilter(filter)
      onFilterSearch(true)
      smsPage()
    }
  }

  const handleReset = () => {
    const url = '/message/sms?smsTab=send'
    window.location.href = url
  }

  return (
    <>
      <FilterBox>
        <FilterForm onSubmit={handleSubmit(onSubmit)}>
          <BoxTop>
            <ItemBox>
              <Input
                labelPlacement={isMobile ? 'outside' : 'outside-left'}
                placeholder="'-'없이 작성해주세요"
                type="text"
                variant="bordered"
                label="받는사람 연락처"
                value={receiver}
                size={'sm'}
                onValueChange={setReceiver}
                maxLength={11}
                classNames={{
                  inputWrapper: 'bg-white',
                }}
                id="receiver"
                {...register('receiver', {
                  maxLength: {
                    value: 11,
                    message: '최대 11자리까지 입력 가능합니다.',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: '숫자만 사용가능합니다.',
                  },
                })}
              />
              {errors.receiver && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.receiver.message)}
                </p>
              )}
            </ItemBox>
            <BtnBox>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                className={'w-full'}
                type="submit"
              >
                검색
              </Button>
              {filterSearch && (
                <Button
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  color="primary"
                  onClick={handleReset}
                  className="w-full bg-white"
                >
                  전체보기
                </Button>
              )}
            </BtnBox>
          </BoxTop>
        </FilterForm>
      </FilterBox>
    </>
  )
}
