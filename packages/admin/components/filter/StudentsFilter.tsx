import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { studentPageState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear, subMonths } from 'date-fns'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { useRouter } from 'next/router'
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

export default function StudentsFilter({
  isActive,
  onFilterSearch,
  setStudentFilter,
  studentFilter,
}) {
  const router = useRouter()
  const studentPage = useResetRecoilState(studentPageState)
  const [birthdayRange, setBirthdayRange] = useState([null, null])
  const [startBirthday, endBirthday] = birthdayRange
  const [creatDateRange, setCreatDateRange] = useState([null, null])
  const [startCreatDate, endCreatDate] = creatDateRange
  const [phone, setPhone] = useState('')
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
      phoneNum: '',
      birthday: undefined,
      createdAt: undefined,
    },
  })

  useEffect(() => {
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.studentName === null
    ) {
      setName('')
    } else {
      setName(studentFilter?.studentName)
    }
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.phoneNum === null
    ) {
      setPhone('')
    } else {
      setPhone(studentFilter?.phoneNum)
    }
    if (
      Object.keys(studentFilter).length === 0 ||
      studentFilter?.birthday === null
    ) {
      setBirthdayRange([null, null])
    } else {
      setBirthdayRange([studentFilter?.birthday[0], studentFilter?.birthday[1]])
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
  }, [router, studentFilter])

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
      const birthdayDate = validateDateRange(
        data.birthday,
        '생년월일의 마지막날을 선택해주세요.',
      )
      const createDate = validateDateRange(
        data.createdAt,
        '방문예정일의 마지막날을 선택해주세요.',
      )
      if (birthdayDate && createDate) {
        const filter = {
          studentName: data.studentName === '' ? null : data.studentName,
          phoneNum: data.phoneNum === '' ? null : data.phoneNum,
          birthday: data.birthday === undefined ? null : data.birthday,
          createdAt: data.createdAt === undefined ? null : data.createdAt,
        }
        setStudentFilter(filter)
        onFilterSearch(true)
        studentPage()
      }
    }
  }

  const handleReset = () => {
    setCreatDateRange([null, null])
    setBirthdayRange([null, null])
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
                placeholder="'-'없이 작성해주세요"
                type="text"
                variant="bordered"
                label="연락처"
                value={phone}
                onValueChange={setPhone}
                maxLength={11}
                id="phoneNum"
                {...register('phoneNum', {
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
              {errors.phoneNum && (
                <p className="px-2 pt-2 text-xs text-red">
                  {String(errors.phoneNum.message)}
                </p>
              )}
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
          </BoxTop>
          <BoxMiddle>
            <ItemBox>
              <DatePickerBox>
                <Controller
                  control={control}
                  name="birthday"
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
                      startDate={startBirthday}
                      endDate={endBirthday}
                      onChange={e => {
                        setBirthdayRange(e)
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
                      onFocus={e => e.target.blur()}
                      customInput={
                        <Input
                          label="생년월일"
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          id="date"
                          classNames={{
                            input: 'caret-transparent',
                          }}
                          isReadOnly={true}
                          startContent={<i className="xi-calendar" />}
                          {...register('birthday')}
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
