import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { Suspense, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import AdviceSelect from '@/components/common/select/AdviceSelect'
registerLocale('ko', ko)
const _ = require('lodash')

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
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function NonassignedFilter({
  isActive,
  onFilterSearch,
  setStudentFilter,
}) {
  const [creatDateRange, setCreatDateRange] = useState([null, null])
  const [startCreatDate, endCreatDate] = creatDateRange
  const [sub, setSub] = useState('-')
  const [name, setName] = useState('')
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
      studentName: '',
      subDiv: '',
      createdPeriod: undefined,
    },
  })

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
      const createDate = validateDateRange(
        data.createdPeriod,
        '수강신청일의 마지막날을 선택해주세요.',
      )
      if (createDate) {
        const filter = {
          studentName: data.studentName === '' ? null : data.studentName,
          subDiv: data.subDiv === '' ? null : data.subDiv,
          createdPeriod:
            data.createdPeriod === undefined ? null : data.createdPeriod,
        }
        setStudentFilter(filter)
        onFilterSearch(true)
      }
    }
  }

  const handleSubChange = e => {
    setSub(e.target.value)
  }
  const handleReset = () => {
    setCreatDateRange([null, null])
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
              <Controller
                control={control}
                name="subDiv"
                defaultValue={'-'}
                render={({ field }) => (
                  <Suspense
                    fallback={
                      <LodingDiv>
                        <i className="xi-spinner-2" />
                      </LodingDiv>
                    }
                  >
                    <AdviceSelect
                      selectedKey={sub}
                      field={field}
                      label={'수강구분'}
                      handleChange={handleSubChange}
                      optionDefault={{
                        type: '-',
                      }}
                      category={'수강구분'}
                    />
                  </Suspense>
                )}
              />
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="수강생이름"
                value={name}
                onValueChange={setName}
                id="studentName"
                {...register('studentName', {
                  pattern: {
                    value: /^[가-힣a-zA-Z0-9\s]*$/,
                    message: '한글, 영어, 숫자만 사용 가능합니다.',
                  },
                })}
              />
              {errors.studentName && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.studentName.message)}
                </p>
              )}
            </ItemBox>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="createdPeriod"
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
                      startDate={startCreatDate}
                      endDate={endCreatDate}
                      onChange={e => {
                        setCreatDateRange(e)
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
                      onChangeRaw={e => e.preventDefault()}
                      onFocus={e => e.target.blur()}
                      placeholderText="기간을 선택해주세요."
                      dateFormat="yyyy/MM/dd"
                      customInput={
                        <Input
                          label="수강신청일"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('createdPeriod')}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
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
