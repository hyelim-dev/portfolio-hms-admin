import MainWrap from '@/components/wrappers/MainWrap'
import { useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import { Button, Input, Radio, RadioGroup } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import Layout from '@/pages/students/layout'
import {
  CHECK_DOUBLE_MUTATION,
  CREATE_STUDENT_MUTATION,
} from '@/graphql/mutations'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { useRecoilState } from 'recoil'
import { newStudentState } from '@/lib/recoilAtoms'
import FormTopInfo from '@/components/common/FormTopInfo'

const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
`
const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
`
const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    align-items: flex-end;
    flex-direction: column-reverse;
  }
`
const Noti = styled.p`
  span {
    color: red;
  }
`
const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaSmallBox = styled.div``
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
const RadioBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: red;
  }
`
const InputText = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  width: 2rem;
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`

export default function StudentsWrite() {
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const [studenTotal, setStudenTotal] = useRecoilState(newStudentState)
  const [createStudent] = useMutation(CREATE_STUDENT_MUTATION)
  const [checkDouble] = useMutation(CHECK_DOUBLE_MUTATION)
  const { register, getValues, control, handleSubmit, formState, reset } =
    useForm()
  const { errors, isDirty } = formState
  const [birthdayDate, setBirthdayDate] = useState(null)
  const [noDouble, setNoDouble] = useState(null)
  const [noDoubleError, setNoDoubleError] = useState(false)
  const years = _.range(1950, getYear(new Date()) + 1, 1)

  const onSubmit = data => {
    createStudent({
      variables: {
        name: data.name.trim(),
        phoneNum1: data.phoneNum1.trim(),
        phoneNum2: data.phoneNum2 === '' ? null : data.phoneNum2.trim(),
        smsAgreement: data.smsAgreement.trim(),
        birthday: data.birthday,
      },
      onCompleted: result => {
        // userLogs(`${data.name} 수강생 등록`, `ok: ${result.createStudent.ok}`)
        if (result.createStudent.ok) {
          alert('등록되었습니다.')
          window.location.href = '/students'
        }
      },
    })
  }
  const clickDoubleCheck = (name, phone) => {
    checkDouble({
      variables: {
        name: name.trim(),
        phoneNum1: phone.trim(),
      },
      onCompleted: result => {
        // userLogs(`${name} 수강생 중복확인`, `ok: ${result.doubleCheck.ok}`)
        if (result.doubleCheck.ok) {
          setNoDouble(true)
          setNoDoubleError(false)
        } else {
          setNoDouble(false)
          setNoDoubleError(true)
          reset()
          setBirthdayDate(null)
        }
      },
    })
  }
  // const handleDateChange = (rawInput) => {
  //   if (parseInt(rawInput.charAt(0)) > 2) {
  //     alert('년도는 4자리수로 입력해주세요')
  //     return
  //   }
  //   const regex = /^(\d{4})(\d{2})(\d{2})$/

  //   if (regex.test(rawInput)) {
  //     const [, year, month, day] = rawInput.match(regex)
  //     const formattedDate = new Date(year, month - 1, day)
  //     setBirthdayDate(formattedDate)
  //   } else {
  //     const dateObject = new Date(rawInput)
  //     if (dateObject && !isNaN(dateObject.getTime())) {
  //       setBirthdayDate(dateObject)
  //     }
  //   }
  // }
  return (
    <>
      <MainWrap>
        <ConArea>
          <Breadcrumb rightArea={false} isFilter={false} />
          <DetailBox>
            <FormTopInfo item={null} noti={true} time={false} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <DetailDiv>
                <FlexBox>
                  <AreaBox>
                    <Input
                      readOnly={noDouble ? true : false}
                      labelPlacement="outside"
                      placeholder="이름"
                      variant={noDouble ? 'faded' : 'bordered'}
                      radius="md"
                      type="text"
                      label={
                        <FilterLabel>
                          이름<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('name').onChange(e)
                      }}
                      {...register('name', {
                        required: {
                          value: true,
                          message: '이름을 입력해주세요.',
                        },
                        pattern: {
                          value: /^[가-힣a-zA-Z0-9\s]*$/,
                          message: '한글, 영어, 숫자만 사용 가능합니다.',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      readOnly={noDouble ? true : false}
                      labelPlacement="outside"
                      placeholder="연락처"
                      variant={noDouble ? 'faded' : 'bordered'}
                      radius="md"
                      type="text"
                      label={
                        <FilterLabel>
                          연락처<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('phoneNum1').onChange(e)
                      }}
                      maxLength={11}
                      {...register('phoneNum1', {
                        required: {
                          value: true,
                          message: '휴대폰번호를 입력해주세요.',
                        },
                        maxLength: {
                          value: 11,
                          message: '최대 11자리까지 입력 가능합니다.',
                        },
                        minLength: {
                          value: 10,
                          message: '최소 10자리 이상이어야 합니다.',
                        },
                        pattern: {
                          value: /^010[0-9]{7,8}$/,
                          message: '010으로 시작해주세요.',
                        },
                      })}
                    />
                    {errors.phoneNum1 && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.phoneNum1.message)}
                      </p>
                    )}
                  </AreaBox>
                </FlexBox>
                <BtnBox>
                  <AreaBox>
                    <Button
                      size="md"
                      radius="md"
                      variant={noDouble ? 'bordered' : 'solid'}
                      color="primary"
                      className={`w-full ${
                        noDouble ? 'text-primary' : 'bg-accent text-white'
                      }  `}
                      onClick={() => {
                        if (!noDouble) {
                          const checkName = getValues('name')
                          const checkPhone = getValues('phoneNum1')
                          if (checkName !== '' && checkPhone !== '') {
                            clickDoubleCheck(checkName, checkPhone)
                          } else {
                            alert('이름과 연락처를 작성해주세요.')
                          }
                        } else {
                          setNoDouble(false)
                          reset()
                        }
                      }}
                    >
                      {noDouble
                        ? `확인 완료 - 재입력시 클릭해주세요.`
                        : '중복확인'}
                    </Button>
                    {noDoubleError && (
                      <p className="px-2 pt-2 text-xs text-red">
                        이미 존재하는 수강생 입니다. 수강생관리를 이용해주세요.
                      </p>
                    )}
                  </AreaBox>
                </BtnBox>
                <FlexBox>
                  <AreaBox>
                    <DatePickerBox>
                      <Controller
                        control={control}
                        name="birthday"
                        rules={{
                          required: {
                            value: true,
                            message: '생년월일을 선택해주세요.',
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
                            locale="ko"
                            showYearDropdown
                            selected={
                              birthdayDate === null
                                ? null
                                : new Date(birthdayDate)
                            }
                            openToDate={new Date('2000/04/11')}
                            placeholderText="날짜를 선택해주세요."
                            isClearable
                            onChange={date => {
                              field.onChange(date)
                              setBirthdayDate(date)
                            }}
                            dateFormat="yyyy/MM/dd"
                            onChangeRaw={e => e.preventDefault()}
                            onFocus={e => e.target.blur()}
                            customInput={
                              <Input
                                ref={field.ref}
                                label={
                                  <FilterLabel>
                                    생년월일<span>*</span>
                                  </FilterLabel>
                                }
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
                    {errors.birthday && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.birthday.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="기타 연락처"
                      variant="bordered"
                      radius="md"
                      type="text"
                      label="기타 연락처"
                      className="w-full"
                      maxLength={12}
                      {...register('phoneNum2', {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: '숫자만 입력 가능합니다.',
                        },
                        maxLength: {
                          value: 12,
                          message: '최대 12자리까지 입력 가능합니다.',
                        },
                      })}
                    />
                    {errors.phoneNum2 && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.phoneNum2.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaSmallBox>
                    <RadioBox>
                      <Controller
                        control={control}
                        name="smsAgreement"
                        defaultValue={'동의'}
                        rules={{
                          required: {
                            value: true,
                            message: 'SMS 수신여부를 선택해주세요.',
                          },
                        }}
                        render={({ field }) => (
                          <RadioGroup
                            label={
                              <FilterLabel>
                                SMS 수신 여부<span>*</span>
                              </FilterLabel>
                            }
                            orientation="horizontal"
                            className="gap-[0.65rem]"
                            classNames={{ wrapper: 'z-0' }}
                            defaultValue={'동의'}
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                          >
                            <Radio key={'동의'} value={'동의'}>
                              동의
                            </Radio>
                            <Radio key={'비동의'} value={'비동의'}>
                              비동의
                            </Radio>
                          </RadioGroup>
                        )}
                      />
                    </RadioBox>
                    {errors.smsAgreement && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.smsAgreement.message)}
                      </p>
                    )}
                  </AreaSmallBox>
                </FlexBox>
                <BtnBox>
                  <Button
                    isDisabled={noDouble ? false : true}
                    type="submit"
                    size="md"
                    radius="md"
                    variant="solid"
                    color="primary"
                    className="w-full text-white"
                  >
                    등록
                  </Button>
                  <Button
                    variant="bordered"
                    color="primary"
                    className="w-full text-primary"
                    onClick={() => router.back()}
                  >
                    이전으로
                  </Button>
                </BtnBox>
              </DetailDiv>
            </form>
          </DetailBox>
        </ConArea>
      </MainWrap>
    </>
  )
}
StudentsWrite.getLayout = page => <Layout>{page}</Layout>
