import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { getYear } from 'date-fns'
import TeacherSelect from '@/components/common/select/TeacherSelect'
registerLocale('ko', ko)
const _ = require('lodash')

const FilterBox = styled(motion.div)`
  z-index: 2;
  position: relative;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
const BoxBottom = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;
  justify-content: space-between;
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
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;
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

export default function ConsultFilter({
  isActive,
  onFilterSearch,
  lectureFilter,
  setLectureFilter,
}) {
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const [teacher, setTeacher] = useState('-')
  const [searchPeriodStart, setSearchPeriodStart] = useState(null)
  const [searchPeriodEnd, setSearchPeriodEnd] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      teacherId: '-',
      temporaryName: '',
      periodStart: undefined,
      periodEnd: undefined,
    },
  })

  // useEffect(() => {
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.receiptDiv === null
  //   ) {
  //     setReceipt('-')
  //   } else {
  //     setReceipt(studentFilter?.receiptDiv)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.subDiv === null
  //   ) {
  //     setSub('-')
  //   } else {
  //     setSub(studentFilter?.subDiv)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.pic === null
  //   ) {
  //     setManager('-')
  //   } else {
  //     setManager(studentFilter?.pic)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.adviceType === null
  //   ) {
  //     setAdviceType('-')
  //   } else {
  //     setAdviceType(studentFilter?.adviceType)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.createdAt === null
  //   ) {
  //     setCreatDateRange([null, null])
  //   } else {
  //     setCreatDateRange([
  //       studentFilter?.createdAt[0],
  //       studentFilter?.createdAt[1],
  //     ])
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.stVisit === null
  //   ) {
  //     setVisitDateRange([null, null])
  //   } else {
  //     setVisitDateRange([studentFilter?.stVisit[0], studentFilter?.stVisit[1]])
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.phoneNum1 === null
  //   ) {
  //     setPhone('')
  //   } else {
  //     setPhone(studentFilter?.phoneNum1)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.stName === null
  //   ) {
  //     setName('')
  //   } else {
  //     setName(studentFilter?.stName)
  //   }
  //   if (
  //     Object.keys(studentFilter).length === 0 ||
  //     studentFilter?.progress === undefined ||
  //     studentFilter?.progress === null
  //   ) {
  //     setProgressSelected([])
  //   } else {
  //     const numericKeys = studentFilter?.progress.map(key => String(key))
  //     setProgressSelected(numericKeys)
  //   }
  // }, [router, studentFilter])

  const handleTeacherChange = e => {
    setTeacher(e.target.value)
  }

  const onSubmit = data => {
    if (isDirty) {
      const filter = {
        teacherId: data.teacherId === '-' ? null : parseInt(data.teacherId),
        periodStart: data.periodStart === undefined ? null : data.periodStart,
        periodEnd: data.periodEnd === undefined ? null : data.periodEnd,
        temporaryName: data.temporaryName === '' ? null : data.temporaryName,
      }
      setLectureFilter(filter)
      onFilterSearch(true)
    }
  }

  const handleReset = () => {
    setTeacher('-')
    setSearchPeriodStart(null)
    setSearchPeriodEnd(null)
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
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="강의명"
                onChange={e => {
                  register('temporaryName').onChange(e)
                }}
                {...register('temporaryName')}
              />
              {errors.temporaryName && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.temporaryName.message)}
                </p>
              )}
            </ItemBox>
            <ItemBox>
              <Controller
                control={control}
                name="teacherId"
                render={({ field, fieldState }) => (
                  <TeacherSelect
                    selectedKey={teacher}
                    field={field}
                    label={'강사명'}
                    handleChange={handleTeacherChange}
                    optionDefault={{
                      mUsername: '-',
                      id: '-',
                    }}
                    isId={true}
                  />
                )}
              />
              {errors.teacherId && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.teacherId.message)}
                </p>
              )}
            </ItemBox>
          </BoxTop>
          <BoxMiddle>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="periodStart"
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
                      locale="ko"
                      showYearDropdown
                      selected={
                        searchPeriodStart === null
                          ? null
                          : new Date(searchPeriodStart)
                      }
                      placeholderText="검색기간 시작일을 선택해주세요."
                      isClearable
                      onChange={date => {
                        field.onChange(date)
                        setSearchPeriodStart(date)
                      }}
                      dateFormat="yyyy/MM/dd"
                      onChangeRaw={e => e.preventDefault()}
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          ref={field.ref}
                          label={<FilterLabel>검색기간 시작일</FilterLabel>}
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
            </ItemBox>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="periodEnd"
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
                      locale="ko"
                      showYearDropdown
                      selected={
                        searchPeriodEnd === null
                          ? null
                          : new Date(searchPeriodEnd)
                      }
                      placeholderText="검색기간 마지막일을 선택해주세요."
                      isClearable
                      onChange={date => {
                        field.onChange(date)
                        setSearchPeriodEnd(date)
                      }}
                      dateFormat="yyyy/MM/dd"
                      onChangeRaw={e => e.preventDefault()}
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          ref={field.ref}
                          label={<FilterLabel>검색기간 마지막일</FilterLabel>}
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
            </ItemBox>
          </BoxMiddle>
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
