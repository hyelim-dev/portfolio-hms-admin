import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { consultPageState, progressStatusState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import ChipCheckbox from '@/components/common/ChipCheckbox'
import { Button, CheckboxGroup, Input } from '@nextui-org/react'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { getYear } from 'date-fns'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import PermissionManagerSelect from '@/components/common/select/PermissionManagerSelect'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
registerLocale('ko', ko)
const _ = require('lodash')

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

export default function ConsultationFilter({
  isActive,
  onFilterSearch,
  studentManagerFilter,
  setStudentManagerFilter,
  studentFilter,
  setStudentFilter,
  supervisor,
}) {
  const router = useRouter()
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const consultPage = useResetRecoilState(consultPageState)
  const progressStatus = useRecoilValue(progressStatusState)
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

  useEffect(() => {
    if (supervisor) {
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.receiptDiv === null
      ) {
        setReceipt('-')
      } else {
        setReceipt(studentFilter?.receiptDiv)
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.subDiv === null
      ) {
        setSub('-')
      } else {
        setSub(studentFilter?.subDiv)
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.pic === null
      ) {
        setManager('-')
      } else {
        setManager(studentFilter?.pic)
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.adviceType === null
      ) {
        setAdviceType('-')
      } else {
        setAdviceType(studentFilter?.adviceType)
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.createdAt === null
      ) {
        setCreatDateRange([null, null])
      } else {
        setCreatDateRange([
          studentFilter?.createdAt[0],
          studentFilter?.createdAt[1],
        ])
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.stVisit === null
      ) {
        setVisitDateRange([null, null])
      } else {
        setVisitDateRange([
          studentFilter?.stVisit[0],
          studentFilter?.stVisit[1],
        ])
      }
      if (
        Object.keys(studentFilter).length === 0 ||
        studentFilter?.phoneNum1 === null
      ) {
        setPhone('')
      } else {
        setPhone(studentFilter?.phoneNum1)
      }
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
        studentFilter?.progress === undefined ||
        studentFilter?.progress === null
      ) {
        setProgressSelected([])
      } else {
        const numericKeys = studentFilter?.progress.map(key => String(key))
        setProgressSelected(numericKeys)
      }
    } else {
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.receiptDiv === null
      ) {
        setReceipt('-')
      } else {
        setReceipt(studentManagerFilter?.receiptDiv)
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.subDiv === null
      ) {
        setSub('-')
      } else {
        setSub(studentManagerFilter?.subDiv)
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.adviceType === null
      ) {
        setAdviceType('-')
      } else {
        setAdviceType(studentManagerFilter?.adviceType)
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.createdAt === null
      ) {
        setCreatDateRange([null, null])
      } else {
        setCreatDateRange([
          studentManagerFilter?.createdAt[0],
          studentManagerFilter?.createdAt[1],
        ])
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.stVisit === null
      ) {
        setVisitDateRange([null, null])
      } else {
        setVisitDateRange([
          studentManagerFilter?.stVisit[0],
          studentManagerFilter?.stVisit[1],
        ])
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.phoneNum1 === null
      ) {
        setPhone('')
      } else {
        setPhone(studentManagerFilter?.phoneNum1)
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.stName === null
      ) {
        setName('')
      } else {
        setName(studentManagerFilter?.stName)
      }
      if (
        Object.keys(studentManagerFilter).length === 0 ||
        studentManagerFilter?.progress === undefined ||
        studentManagerFilter?.progress === null
      ) {
        setProgressSelected([])
      } else {
        const numericKeys = studentManagerFilter?.progress.map(key =>
          String(key),
        )
        setProgressSelected(numericKeys)
      }
    }
  }, [router, supervisor, studentFilter, studentManagerFilter])

  useEffect(() => {
    if (supervisor) {
    }
  }, [studentFilter, studentManagerFilter])

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
        if (supervisor) {
          const filter = {
            receiptDiv: data.receiptDiv === '-' ? null : data.receiptDiv,
            subDiv: data.subDiv === '-' ? null : data.subDiv,
            pic: data.pic === '-' ? null : data.pic,
            createdAt: data.createdAt === undefined ? null : data.createdAt,
            stVisit: data.stVisit === undefined ? null : data.stVisit,
            stName: data.stName === '' ? null : data.stName,
            progress:
              data.progress === undefined || data.progress.length === 0
                ? null
                : data.progress,
            phoneNum1: data.phoneNum1 === '' ? null : data.phoneNum1,
            adviceType: data.adviceType === '-' ? null : data.adviceType,
          }
          setStudentFilter(filter)
        } else {
          const filter = {
            receiptDiv: data.receiptDiv === '-' ? null : data.receiptDiv,
            subDiv: data.subDiv === '-' ? null : data.subDiv,
            createdAt: data.createdAt === undefined ? null : data.createdAt,
            stVisit: data.stVisit === undefined ? null : data.stVisit,
            stName: data.stName === '' ? null : data.stName,
            progress:
              data.progress === undefined || data.progress.length === 0
                ? null
                : data.progress,
            phoneNum1: data.phoneNum1 === '' ? null : data.phoneNum1,
            adviceType: data.adviceType === '-' ? null : data.adviceType,
          }
          setStudentManagerFilter(filter)
        }
        onFilterSearch(true)
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
                name="receiptDiv"
                defaultValue={'-'}
                render={({ field }) => (
                  <AdviceSelect
                    selectedKey={receipt}
                    field={field}
                    label={'접수구분'}
                    handleChange={handleReceiptChange}
                    optionDefault={{
                      type: '-',
                    }}
                    category={'접수구분'}
                  />
                )}
              />
            </ItemBox>
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
            {supervisor ? (
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
                      <PermissionManagerSelect
                        selectedKey={manager}
                        field={field}
                        label={'담당자'}
                        handleChange={handleManagerChange}
                        optionDefault={{
                          mUsername: '-',
                          mUserId: '-',
                        }}
                        parmissionName={'상담관리접근'}
                        isId={false}
                      />
                    </Suspense>
                  )}
                />
              </ItemBox>
            ) : null}
            <ItemBox>
              <Controller
                control={control}
                name="adviceType"
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
                      selectedKey={adviceType}
                      field={field}
                      label={'상담분야'}
                      handleChange={handleAdviceChange}
                      optionDefault={{
                        type: '-',
                      }}
                      category={'상담분야'}
                    />
                  </Suspense>
                )}
              />
            </ItemBox>
          </BoxTop>
          <BoxMiddle>
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
                          label="등록일시"
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
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="stVisit"
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
                      selectsRange={true}
                      startDate={startVisitDate}
                      endDate={endVisitDate}
                      onChange={e => {
                        setVisitDateRange(e)
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
                      dateFormat="yyyy/MM/dd"
                      onChangeRaw={e => e.preventDefault()}
                      disabledKeyboardNavigation
                      onFocus={e => e.target.blur()}
                      placeholderText="기간을 선택해주세요."
                      customInput={
                        <Input
                          label="상담예정일"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('stVisit')}
                        />
                      }
                    />
                  )}
                />
              </DatePickerBox>
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder="'-'없이 작성해주세요"
                type="text"
                variant="bordered"
                label="연락처"
                value={phone}
                onValueChange={setPhone}
                maxLength={11}
                onChange={e => {
                  register('phoneNum1').onChange(e)
                }}
                {...register('phoneNum1', {
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
              {errors.phoneNum1 && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.phoneNum1.message)}
                </p>
              )}
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="이름"
                value={name}
                onValueChange={setName}
                onChange={e => {
                  register('stName').onChange(e)
                }}
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
          </BoxMiddle>
          <BoxBottom>
            <ItemBox>
              <Controller
                control={control}
                name="progress"
                render={({ field, fieldState }) => (
                  <CheckboxGroup
                    label={<FilterLabel>진행상태</FilterLabel>}
                    orientation="horizontal"
                    className="gap-1 radioBox"
                    value={progressSelected}
                    onValueChange={handleProgressChange}
                  >
                    {Object.entries(progressStatus)
                      .filter(([key]) => key !== '110')
                      .map(([key, value]) => (
                        <ChipCheckbox key={key} value={key}>
                          {value.name}
                        </ChipCheckbox>
                      ))}
                  </CheckboxGroup>
                )}
              />
            </ItemBox>
          </BoxBottom>
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
