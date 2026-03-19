import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { subDays, getYear, addMonths } from 'date-fns'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { useEffect, useState } from 'react'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { useSuspenseQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import FormTopInfo from '@/components/common/FormTopInfo'
registerLocale('ko', ko)
const _ = require('lodash')

const FilterBox = styled(motion.div)`
  z-index: 2;
  position: relative;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
`
const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1.5rem;

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
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

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
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;

  span {
    color: red;
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
type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}
export default function PerformanceFilter({
  isActive,
  onFilterSearch,
  setPerformanceFilter,
  performanceFilter,
  clickReset,
  setClickReset,
}) {
  const router = useRouter()
  const {
    data: managerData,
    error,
    refetch,
  } = useSuspenseQuery<SearchPermissionsGrantedQeury>(
    SEARCH_PERMISSIONS_GRANTED_QUERY,
    {
      variables: {
        permissionName: '영업실적대상자',
      },
    },
  )
  const managerList = managerData?.searchPermissionsGranted.data[0].ManageUser
  const [searchDateRange, setSearchDateRange] = useState([null, null])
  const [startDate, endDate] = searchDateRange
  const [manager, setManager] = useState(new Set([]))
  const years = _.range(1970, getYear(new Date()) + 1, 1)
  const [maxDate, setMaxDate] = useState(new Date())

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      period: [null, null],
      processingManagerId: '',
    },
  })

  useEffect(() => {
    if (performanceFilter === null || clickReset) {
      setManager(new Set([]))
      setSearchDateRange([null, null])
      setValue('period', [null, null], { shouldDirty: true })
      reset()
    }
  }, [router, clickReset])

  useEffect(() => {
    if (startDate) {
      const calculatedMaxDate = subDays(addMonths(startDate, 6), 1)
      setMaxDate(
        calculatedMaxDate > new Date() ? new Date() : calculatedMaxDate,
      )
    } else {
      setMaxDate(new Date())
    }
  }, [startDate])

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
        data.period,
        '검색 기간의 마지막날을 선택해주세요.',
      )
      if (paymentDate) {
        const filter = {
          period: data.period,
          processingManagerId: data.processingManagerId
            .split(',')
            .map(item => parseInt(item, 10)),
        }
        setPerformanceFilter(filter)
        onFilterSearch(true)
        setClickReset(false)
      }
    }
  }

  const handleReset = () => {
    setSearchDateRange([null, null])
    setManager(new Set([]))
    reset()
  }

  const handleManagerChange = e => {
    setManager(new Set(e.target.value.split(',')))
  }

  if (error) {
    console.log(error)
  }

  return (
    <>
      <FilterBox
        variants={FilterVariants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <FormTopInfo item={null} noti={true} time={false} />
        <FilterForm onSubmit={handleSubmit(onSubmit)}>
          <BoxTop>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="period"
                  rules={{
                    required: {
                      value: true,
                      message: '검색 기간을 선택해주세요',
                    },
                  }}
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
                      // maxDate={subDays(addMonths(startDate, 6), 1)}
                      // maxDate={new Date()}
                      maxDate={maxDate}
                      locale="ko"
                      startDate={startDate}
                      endDate={endDate}
                      onChange={e => {
                        setSearchDateRange(e)
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
                      disabledKeyboardNavigation
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          label={
                            <FilterLabel>
                              검색 기간<span>*</span>
                            </FilterLabel>
                          }
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('period', {
                            required: {
                              value: true,
                              message: '검색 기간을 선택해주세요',
                            },
                          })}
                        />
                      }
                    />
                  )}
                />
                {errors.period && (
                  <p className="px-2 pt-2 text-xs text-red">
                    {String(errors.period.message)}
                  </p>
                )}
              </DatePickerBox>
            </ItemBox>
            <ItemBox>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: '영업실적대상자를 1명이상 선택해주세요',
                  },
                }}
                name="processingManagerId"
                defaultValue={'-'}
                render={({ field }) => (
                  <Select
                    labelPlacement="outside"
                    label={
                      <FilterLabel>
                        영업실적대상자<span>*</span>
                      </FilterLabel>
                    }
                    placeholder=" "
                    className="w-full"
                    isMultiline={true}
                    selectionMode="multiple"
                    defaultValue={''}
                    variant="bordered"
                    selectedKeys={manager}
                    onChange={value => {
                      if (value.target.value !== '') {
                        field.onChange(value)
                        handleManagerChange(value)
                      }
                    }}
                  >
                    {managerList.map(item => (
                      <SelectItem key={item.id} value={item.mUsername}>
                        {item.mUsername}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              {errors.processingManagerId && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.processingManagerId.message)}
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
