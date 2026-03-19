import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { paymentPageState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
import DatePickerHeader from '@/components/common/DatePickerHeader'
registerLocale('ko', ko)
const _ = require('lodash')
import { subDays, addMonths, differenceInDays } from 'date-fns'

const FilterBox = styled(motion.div)`
  z-index: 2;
  position: relative;
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
  align-items: flex-end;

  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__close-icon {
    height: 40px;
    bottom: 0;
    top: auto;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  align-items: flex-end;
`
const NotiBox = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
`
const Noti = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > li {
    color: ${({ theme }) => theme.colors.gray};
    font-size: 0.8rem;
    padding-left: 0.5rem;
    position: relative;
    line-height: 1;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 2px;
      height: 2px;
      margin-top: -1px;
      background: ${({ theme }) => theme.colors.primary};
    }
  }
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

export default function SalesFilter({
  isActive,
  onFilterSearch,
  setSalesFilter,
  setDays,
}) {
  const paymentPage = useResetRecoilState(paymentPageState)
  const [paymentDateRange, setPaymentDateRange] = useState([null, null])
  const [startPaymentDate, endPaymentDate] = paymentDateRange
  const years = _.range(1970, getYear(new Date()) + 1, 1)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      selectDate: null,
      daily: null,
    },
  })

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

  const onSubmit = data => {
    if (isDirty) {
      const paymentDate = validateDateRange(
        data.selectDate,
        '검색 기간의 마지막날을 선택해주세요.',
      )
      if (paymentDate) {
        const filter = data.selectDate

        const days = differenceInDays(
          new Date(endPaymentDate),
          new Date(startPaymentDate),
        )
        setSalesFilter(filter)
        setDays(days)
        onFilterSearch(true)
        paymentPage()
      }
    }
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
                  name="selectDate"
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
                      isClearable
                      maxDate={subDays(addMonths(startPaymentDate, 1), 1)}
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

                        field.onChange(e)
                      }}
                      placeholderText="기간을 선택해주세요."
                      dateFormat="yyyy/MM/dd"
                      onChangeRaw={e => e.preventDefault()}
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          label="검색 기간"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('selectDate')}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
            </ItemBox>
            <BtnBox>
              <Button
                type="submit"
                color="primary"
                className="w-full text-white"
              >
                적용
              </Button>
            </BtnBox>
            <NotiBox>
              <Noti>
                <li>검색 기간은 최대 1달 입니다.</li>
                <li>기간검색은 일별로 검색됩니다.</li>
                <li>일별 검색은 24시간으로 검색됩니다.</li>
              </Noti>
            </NotiBox>
          </BoxTop>
        </FilterForm>
      </FilterBox>
    </>
  )
}
