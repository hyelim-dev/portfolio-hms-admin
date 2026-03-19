import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { paymentDetailPageState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import DatePickerHeader from '@/components/common/DatePickerHeader'
registerLocale('ko', ko)
const _ = require('lodash')
import { getYear, subMonths, subDays } from 'date-fns'
import { useRouter } from 'next/router'

const FilterBox = styled(motion.div)`
  z-index: 2;
  position: relative;
`
const Noti = styled.p`
  font-size: 0.8rem;
  span {
    color: red;
  }
`
const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const BoxTop = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`
const BoxMiddle = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`
const ItemBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  .react-datepicker-wrapper {
    width: 100%;
  }
`
const DateBtn = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`
const BtnBox = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
`
const DatePickerBox = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    display: inline;
    width: 100%;
  }
  .react-datepicker__input-container {
    display: inline;
  }
  .react-datepicker__close-icon {
    height: 2.5rem;
    top: auto;
    bottom: 0;
  }
  .react-datepicker__triangle {
    left: 1.5rem !important;
    transform: translate(0, 0) !important;
  }
`
const FilterVariants = {
  hidden: {
    scaleY: 0,
    transformOrigin: 'top',
    height: 0,
  },
  visible: {
    scaleY: 1,
    transformOrigin: 'top',
    height: 'auto',
    transition: {
      duration: 0.3,
    },
  },
}

export default function AccountingFilter({
  isActive,
  onFilterSearch,
  setStudentFilter,
  studentFilter,
}) {
  const router = useRouter()
  const paymentPage = useResetRecoilState(paymentDetailPageState)
  const [paymentDateRange, setPaymentDateRange] = useState([null, null])
  const [startPaymentDate, endPaymentDate] = paymentDateRange
  const years = _.range(1970, getYear(new Date()) + 1, 1)
  const [name, setName] = useState('')
  const [approval, setApproval] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      stName: '',
      paymentDate: undefined,
      approvalNum: '',
    },
  })

  useEffect(() => {
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.stName === null
    ) {
      setName('')
    } else {
      setName(studentFilter?.stName)
    }
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.paymentDate === null
    ) {
      setPaymentDateRange([null, null])
    } else {
      setPaymentDateRange([
        studentFilter?.paymentDate[0],
        studentFilter?.paymentDate[1],
      ])
    }
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.approvalNum === null
    ) {
      setApproval('')
    } else {
      setApproval(studentFilter?.approvalNum)
    }
  }, [studentFilter])

  const onSubmit = data => {
    if (isDirty) {
      const validateDateRange = (dateRange, message) => {
        if (dateRange !== undefined) {
          if (dateRange[1] !== null) {
            return true
          } else {
            alert(message)
            return false
          }
        } else {
          return true
        }
      }
      const paymentDate = validateDateRange(
        data.paymentDate,
        '결제일시의 마지막날을 선택해주세요.',
      )
      if (paymentDate) {
        const filter = {
          stName: data.stName === '' ? null : data.stName,
          paymentDate: data.paymentDate === undefined ? null : data.paymentDate,
          approvalNum: data.approvalNum === '' ? null : data.approvalNum,
        }
        setStudentFilter(filter)
        onFilterSearch(true)
        paymentPage()
      }
    }
  }
  const setDates = (start, end) => {
    setPaymentDateRange([start, end])
    const setStart = new Date(start.setHours(0, 0, 0, 0))
    const setEnd = new Date(end.setHours(23, 59, 59, 999))
    setValue('paymentDate', [setStart, setEnd], { shouldDirty: true })
  }

  const handleYesterdayClick = () => {
    const yesterday = subDays(new Date(), 1)
    setDates(yesterday, yesterday)
  }

  const handleTodayClick = () => {
    const today = new Date()
    setDates(today, today)
  }

  const handleLastMonthClick = () => {
    const today = new Date()
    const lastMonth = subMonths(new Date(), 1)
    setDates(lastMonth, today)
  }

  const handleLastThreeMonthsClick = () => {
    const today = new Date()
    const lastThreeMonths = subMonths(new Date(), 3)
    setDates(lastThreeMonths, today)
  }

  const handleLastSixMonthsClick = () => {
    const today = new Date()
    const lastSixMonths = subMonths(new Date(), 6)
    setDates(lastSixMonths, today)
  }

  const handleReset = () => {
    setPaymentDateRange([null, null])
    reset()
  }

  return (
    <>
      <FilterBox
        variants={FilterVariants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <FilterForm onSubmit={handleSubmit(onSubmit)}>
          <BoxTop>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="paymentDate"
                  render={({ field }) => (
                    <DatePicker
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                      }) => (
                        <DatePickerHeader
                          rangeYears={years}
                          clickDate={date}
                          changeYear={changeYear}
                          changeMonth={changeMonth}
                          decreaseMonth={decreaseMonth}
                          increaseMonth={increaseMonth}
                        />
                      )}
                      selectsRange={true}
                      locale="ko"
                      startDate={startPaymentDate}
                      endDate={endPaymentDate}
                      onChange={e => {
                        setPaymentDateRange(e)
                        let date
                        if (e[1] !== null) {
                          date = [
                            new Date(e[0]?.setHours(0, 0, 0, 0)),
                            new Date(e[1]?.setHours(23, 59, 59, 999)),
                          ]
                        } else {
                          date = [new Date(e[0]?.setHours(0, 0, 0, 0)), null]
                        }

                        field.onChange(date)
                      }}
                      placeholderText="기간을 선택해주세요."
                      dateFormat="yyyy/MM/dd"
                      onChangeRaw={e => e.preventDefault()}
                      disabledKeyboardNavigation
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          label="결제 일시"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('paymentDate')}
                        />
                      }
                    />
                  )}
                />
                <DateBtn>
                  <Button size="sm" onClick={handleYesterdayClick}>
                    어제
                  </Button>
                  <Button size="sm" onClick={handleTodayClick}>
                    오늘
                  </Button>
                  <Button size="sm" onClick={handleLastMonthClick}>
                    1개월
                  </Button>
                  <Button size="sm" onClick={handleLastThreeMonthsClick}>
                    3개월
                  </Button>
                  <Button size="sm" onClick={handleLastSixMonthsClick}>
                    6개월
                  </Button>
                </DateBtn>
              </DatePickerBox>
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="수강생이름"
                id="stName"
                value={name}
                onValueChange={setName}
                {...register('stName', {
                  pattern: {
                    value: /^[가-힣a-zA-Z0-9\s]*$/,
                    message: '한글, 영어, 숫자만 사용 가능합니다.',
                  },
                })}
              />
              {errors.stName && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.stName.message)}
                </p>
              )}
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="카드 승인번호"
                id="approvalNum"
                value={approval}
                onValueChange={setApproval}
                maxLength={8}
                {...register('approvalNum', {
                  maxLength: {
                    value: 8,
                    message: '최대 8자리까지 입력 가능합니다.',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: '숫자만 입력 가능합니다.',
                  },
                })}
              />
              {errors.approvalNum && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.approvalNum.message)}
                </p>
              )}
            </ItemBox>
          </BoxTop>
          <BtnBox>
            <Button
              type="submit"
              color="primary"
              className="w-[50%] text-white"
            >
              검색
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="w-[50%] text-primary"
              onClick={handleReset}
            >
              초기화
            </Button>
          </BtnBox>
        </FilterForm>
      </FilterBox>
    </>
  )
}
