import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { consultPageState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { Suspense, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { getYear } from 'date-fns'
import ManagerSelect from '@/components/common/select/ManagerSelect'

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
  // onFilterSearch,
  // studentFilter,
  // setStudentFilter,
}) {
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const consultPage = useResetRecoilState(consultPageState)
  const [receipt, setReceipt] = useState('-')
  const [sub, setSub] = useState('-')
  const [manager, setManager] = useState('-')
  const [adviceType, setAdviceType] = useState('-')
  const [creatDateRange, setCreatDateRange] = useState([null, null])
  const [startCreatDate, endCreatDate] = creatDateRange
  const [visitDateRange, setVisitDateRange] = useState([null, null])
  const [startVisitDate, endVisitDate] = visitDateRange
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [progressSelected, setProgressSelected] = useState([])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      receiptDiv: '-',
      subDiv: '-',
      pic: '-',
      createdAt: undefined,
      stVisit: undefined,
      stName: '',
      progress: undefined,
      phoneNum1: '',
      adviceType: '-',
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

  const handleReceiptChange = e => {
    setReceipt(e.target.value)
  }

  const handleSubChange = e => {
    setSub(e.target.value)
  }
  const handleManagerChange = e => {
    setManager(e.target.value)
  }
  const handleAdviceChange = e => {
    setAdviceType(e.target.value)
  }
  const handleProgressChange = (value: string[]) => {
    const numericKeys = value.map(key => parseInt(key, 10))
    setValue('progress', numericKeys)
    setProgressSelected(value)
  }

  const onSubmit = data => {
    if (isDirty || data.progress !== undefined) {
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
      const creatDate = validateDateRange(
        data.createdAt,
        '등록일시의 마지막날을 선택해주세요.',
      )
      const visitDate = validateDateRange(
        data.stVisit,
        '방문예정일의 마지막날을 선택해주세요.',
      )
      if (creatDate && visitDate) {
        const filter = {
          receiptDiv: data.receiptDiv === '-' ? null : data.receiptDiv,
          subDiv: data.subDiv === '-' ? null : data.subDiv,
          pic: data.pic === '-' ? null : data.pic,
          createdAt: data.createdAt === undefined ? null : data.createdAt,
          stVisit: data.stVisit === undefined ? null : data.stVisit,
          stName: data.stName === '' ? null : data.stName,
          progress: data.progress,
          phoneNum1: data.phoneNum1 === '' ? null : data.phoneNum1,
          adviceType: data.adviceType === '-' ? null : data.adviceType,
        }
        // setStudentFilter(filter)
        // onFilterSearch(true)
        consultPage()
      }
    }
  }

  const handleReset = () => {
    setReceipt('-')
    setSub('-')
    setManager('-')
    setAdviceType('-')
    setCreatDateRange([null, null])
    setVisitDateRange([null, null])
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
                name="pic"
                defaultValue={'-'}
                render={({ field }) => (
                  <Suspense
                    fallback={
                      <LodingDiv>
                        <i className="xi-spinner-2" />
                      </LodingDiv>
                    }
                  >
                    <ManagerSelect
                      selectedKey={manager}
                      field={field}
                      label={'보낸사람'}
                      handleChange={handleManagerChange}
                      optionDefault={{
                        mUsername: '-',
                        mUserId: '-',
                      }}
                      filter={{}}
                      isId={false}
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
                label="요청내용"
                value={name}
                onValueChange={setName}
                onChange={e => {
                  register('stName').onChange(e)
                }}
                {...register('stName', {
                  // pattern: {
                  //   value: /^[가-힣a-zA-Z0-9\s]*$/,
                  //   message: '한글, 영어, 숫자만 사용 가능합니다.',
                  // },
                })}
              />
              {errors.stName && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.stName.message)}
                </p>
              )}
            </ItemBox>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="createdAt"
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
                            new Date(e[0]?.setHours(0, 0, 0, 0)),
                            new Date(e[1]?.setHours(23, 59, 59, 999)),
                          ]
                        } else {
                          date = [new Date(e[0]?.setHours(0, 0, 0, 0)), null]
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
                          label="요청일자"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('createdAt')}
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
