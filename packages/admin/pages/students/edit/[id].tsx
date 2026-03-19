import MainWrap from '@/components/wrappers/MainWrap'
import { useEffect, useState } from 'react'
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
  SEARCH_STUDENT_BASIC_MUTATION,
  UPDATE_STUDENT_BASIC_MUTATION,
} from '@/graphql/mutations'
import DatePickerHeader from '@/components/common/DatePickerHeader'
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
  align-items: center;

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
const AreaSmallBox = styled.div`
  @media (max-width: 768px) {
    width: 100% !important;
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

export default function StudentsEditInfo() {
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const studentId = typeof router.query.id === 'string' ? router.query.id : null
  const [searchStudentBasic] = useMutation(SEARCH_STUDENT_BASIC_MUTATION)
  const [updateStudentBasic] = useMutation(UPDATE_STUDENT_BASIC_MUTATION)
  const [checkDouble] = useMutation(CHECK_DOUBLE_MUTATION)
  const { register, control, getValues, handleSubmit, formState, reset } =
    useForm()
  const { errors, isDirty, dirtyFields } = formState
  const [studentData, setStudentData] = useState(null)
  const [birthdayDate, setBirthdayDate] = useState(null)
  const [noDouble, setNoDouble] = useState(true)
  const [noDoubleError, setNoDoubleError] = useState(false)
  const years = _.range(1950, getYear(new Date()) + 1, 1)

  useEffect(() => {
    searchStudentBasic({
      variables: {
        searchStudentId: parseInt(studentId),
      },
      onCompleted: data => {
        if (data.searchStudent.ok) {
          setStudentData(data.searchStudent.student[0])
        }
      },
    })
  }, [router])

  useEffect(() => {
    if (studentData?.birthday === null || studentData?.birthday === undefined) {
      setBirthdayDate(null)
    } else {
      const date = parseInt(studentData?.birthday)
      setBirthdayDate(date)
    }
  }, [studentData])

  const onSubmit = data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        updateStudentBasic({
          variables: {
            editStudentId: studentData.id,
            name: data.name.trim(),
            phoneNum1: data.phoneNum1.trim(),
            phoneNum2: data.phoneNum2.trim(),
            smsAgreement: data.smsAgreement,
            birthday:
              data.birthday === null
                ? null
                : typeof data.birthday === 'string'
                  ? new Date(parseInt(data.birthday))
                  : new Date(data.birthday),
            lastModifiedTime: new Date(),
          },
          onCompleted: result => {
            const dirtyFieldsArray = [...Object.keys(dirtyFields)]
            // userLogs(
            //   `${studentData.name} 수강생 기본정보 수정`,
            //   `ok: ${result.editStudent.ok} / ${dirtyFieldsArray.join(', ')}`,
            // )
            if (result.editStudent.ok) {
              alert('수정되었습니다.')
              router.back()
            }
          },
        })
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const clickDoubleCheck = (name, phone) => {
    checkDouble({
      variables: {
        name: name.trim(),
        phoneNum1: phone.trim(),
      },
      onCompleted: result => {
        if (result.doubleCheck.ok) {
          setNoDouble(true)
          setNoDoubleError(false)
        } else {
          setNoDouble(false)
          setNoDoubleError(true)
          reset()
        }
      },
    })
  }

  return (
    <>
      {studentData !== null && (
        <MainWrap>
          <ConArea>
            <Breadcrumb rightArea={false} isFilter={false} />
            <DetailBox>
              <FormTopInfo item={studentData} noti={true} time={true} />
              <form onSubmit={handleSubmit(onSubmit)}>
                <DetailDiv>
                  <FlexBox>
                    <AreaBox>
                      <Input
                        readOnly={noDouble ? true : false}
                        defaultValue={studentData?.name}
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
                        defaultValue={studentData?.phoneNum1}
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
                              if (
                                studentData.name == checkName &&
                                studentData.phoneNum1 == checkPhone
                              ) {
                                setNoDouble(true)
                              } else {
                                clickDoubleCheck(checkName, checkPhone)
                              }
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
                          같은 정보가 존재합니다. 이름과 연락처를 다시한번
                          확인해주세요.
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
                          defaultValue={studentData?.birthday}
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
                        defaultValue={studentData?.phoneNum2}
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
                          defaultValue={studentData?.smsAgreement}
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
                              defaultValue={studentData?.smsAgreement}
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
                      color="primary"
                      className="w-full text-white"
                    >
                      수정
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
      )}
    </>
  )
}
StudentsEditInfo.getLayout = page => <Layout>{page}</Layout>
