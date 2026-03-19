import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { getYear, subMonths } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')

const FilterBox = styled(motion.div)`
  z-index: 5;
  position: relative;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
  }
`
const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1rem;
  padding: 0 1rem 1.5rem 1rem;
  margin-top: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 0 0 1.5rem 0;
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

export default function AttendanceFilter({
  isActive,
  lectureData,
  filterAttandanceSearch,
  setFilterAttandanceData,
  setFilterAttandanceSearch,
}) {
  const today = new Date()
  const lastSixMonths = subMonths(new Date(), 6)
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const [creatDateRange, setCreatDateRange] = useState([null, null])
  const [startCreatDate, endCreatDate] = creatDateRange
  const [selectedDates, setSelectedDates] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      attendanceDate: undefined,
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
  const checkDate = (startDate, endDate) => {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    if (
      !lectureData.lectureDetails.includes(start) ||
      !lectureData.lectureDetails.includes(end)
    ) {
      alert('단위기간을 다시 선택해주세요.')
      return false
    } else {
      const startIndex = lectureData.lectureDetails.indexOf(start) // A 요소의 인덱스
      const endIndex = lectureData.lectureDetails.indexOf(end) + 1
      const selectedDates = lectureData.lectureDetails.slice(
        startIndex,
        endIndex,
      )
      return selectedDates
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // 초기 로드 시 실행

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const onSubmit = data => {
    if (isDirty) {
      const attDate = validateDateRange(
        data.attendanceDate,
        '단위기간의 마지막날을 선택해주세요.',
      )
      if (attDate) {
        const checkAttDate = checkDate(
          data.attendanceDate[0],
          data.attendanceDate[1],
        )
        if (checkAttDate) {
          const filter = checkAttDate
          setFilterAttandanceData(filter)
          setFilterAttandanceSearch(true)
        }
      }
    }
  }

  const handleReset = () => {
    setCreatDateRange([null, null])
    reset()
    setFilterAttandanceSearch(false)
    setFilterAttandanceData(null)
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
                  name="attendanceDate"
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
                      showYearDropdown
                      startDate={startCreatDate}
                      endDate={endCreatDate}
                      onChange={e => {
                        setCreatDateRange(e)
                        let date
                        if (e[1] !== null) {
                          date = [
                            new Date(e[0]?.setHours(10, 0, 0, 0)),
                            new Date(e[1]?.setHours(23, 59, 59, 999)),
                          ]
                        } else {
                          date = [new Date(e[0]?.setHours(10, 0, 0, 0)), null]
                        }

                        field.onChange(date)
                      }}
                      onChangeRaw={e => e.preventDefault()}
                      disabledKeyboardNavigation
                      onFocus={e => e.target.blur()}
                      placeholderText="기간을 선택해주세요."
                      dateFormat="yyyy/MM/dd"
                      customInput={
                        <Input
                          label="단위 기간"
                          labelPlacement={isMobile ? 'outside' : 'outside-left'}
                          type="text"
                          size={'sm'}
                          variant="bordered"
                          className="w-full"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('attendanceDate')}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
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
              {filterAttandanceSearch && (
                <Button
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  color="primary"
                  onClick={handleReset}
                  className="w-full"
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
