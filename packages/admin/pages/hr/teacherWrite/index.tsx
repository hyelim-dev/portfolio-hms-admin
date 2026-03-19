import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import Layout from '@/pages/hr/layout'
import { CREATE_MANAGE_USER_MUTATION } from '@/graphql/mutations'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import AdviceMultiSelect from '@/components/common/select/AdviceMultiSelect'
import Address from '@/components/common/Address'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import FormTopInfo from '@/components/common/FormTopInfo'

const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
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
  position: relative;
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

    &.multi {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.gray};
    }
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

export default function TeacherWrite() {
  const grade = useRecoilValue(gradeState)
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const [createManager] = useMutation(CREATE_MANAGE_USER_MUTATION)
  const {
    register,
    setValue,
    clearErrors,
    setError,
    control,
    handleSubmit,
    formState,
    watch,
  } = useForm()
  const { errors } = formState
  const [joiningDate, setJoiningDate] = useState(null)
  const years = _.range(1950, getYear(new Date()) + 1, 1)
  const [adviceType, setAdviceType] = useState(new Set([]))

  const password = watch('mPassword')
  const confirmPassword = watch('mPassword1')
  const checkPassword = (password1, password2) => {
    if (password1) {
      if (password1.length < 7) {
        setError('mPassword', {
          type: 'manual',
          message: '최소 8자리 이상이어야 합니다.',
        })
      } else {
        clearErrors('mPassword')
      }
    }
    if (password1 && password2) {
      if (password1 !== password2 || password1.length !== password2.length) {
        setError('mPassword1', {
          type: 'manual',
          message: '비밀번호가 일치하지 않습니다.',
        })
      } else {
        clearErrors('mPassword1')
      }
    }
  }

  useEffect(() => {
    checkPassword(password, confirmPassword)
  }, [password, confirmPassword, setError, clearErrors])

  const onSubmit = data => {
    checkPassword(data.mPassword, data.mPassword1)
    if (data.mPart !== undefined) {
      const parts = String(data.mPart)
        .split(',')
        .map(part => part.trim())
      setValue('mPart', parts)
    }

    createManager({
      variables: {
        mUserId: data.mUserId.trim(),
        mUsername: data.mUsername.trim(),
        mPassword: data.mPassword.trim(),
        mGrade: grade.teacher,
        mRank: '강사',
        mPart: data.mPart === '' ? null : data.mPart,
        mPhoneNum: data.mPhoneNum.trim(),
        mPhoneNumFriend:
          data.mPhoneNumFriend === '' ? null : data.mPhoneNumFriend.trim(),
        mJoiningDate:
          data.mJoiningDate === undefined ? null : new Date(data.mJoiningDate),
        mZipCode:
          data.mZipCode === '' || data.mZipCode === undefined
            ? null
            : data.mZipCode.trim(),
        mAddresses:
          data.mAddresses === '' || data.mAddresses === undefined
            ? null
            : data.mAddresses.trim(),
        mAddressDetail:
          data.mAddressDetail === '' || data.mAddressDetail === undefined
            ? null
            : data.mAddressDetail.trim(),
        email: data.email === '' ? null : data.email.trim(),
      },
      onCompleted: result => {
        // userLogs(
        //   `${data.mUsername}강사 등록`,
        //   `ok: ${result.createManagerAccount.ok}`,
        // )
        if (result.createManagerAccount.ok) {
          alert('등록되었습니다.')
          router.back()
        } else {
          alert(result.createManagerAccount.error)
        }
      },
    })
  }

  const handleAdviceChange = e => {
    setAdviceType(e.target.value)
  }

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
                      labelPlacement="outside"
                      placeholder="이름영문 예) gildong[홍길동]"
                      variant={'bordered'}
                      radius="md"
                      type="text"
                      label={
                        <FilterLabel>
                          아이디<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      maxLength={12}
                      onChange={e => {
                        register('mUserId').onChange(e)
                      }}
                      {...register('mUserId', {
                        required: {
                          value: true,
                          message: '아이디을 입력해주세요.',
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9\s]*$/,
                          message: '영어, 숫자만 사용 가능합니다.',
                        },
                        maxLength: {
                          value: 12,
                          message: '최대 12자리까지 입력 가능합니다.',
                        },
                      })}
                    />
                    {errors.mUserId && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mUserId.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="hc+입사년월일 예) hc240101"
                      variant={'bordered'}
                      radius="md"
                      type="password"
                      label={
                        <FilterLabel>
                          비밀번호<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('mPassword').onChange(e)
                      }}
                      {...register('mPassword', {
                        required: {
                          value: true,
                          message: '비밀번호를 입력해주세요.',
                        },
                        minLength: {
                          value: 8,
                          message: '최소 8자리 이상이어야 합니다.',
                        },
                      })}
                    />
                    {errors.mPassword && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mPassword.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="비밀번호 확인"
                      variant={'bordered'}
                      radius="md"
                      type="password"
                      label={
                        <FilterLabel>
                          비밀번호확인<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('mPassword1').onChange(e)
                      }}
                      {...register('mPassword1', {
                        required: {
                          value: true,
                          message: '비밀번호를 다시 한번 입력해주세요.',
                        },
                      })}
                    />
                    {errors.mPassword1 && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mPassword1.message)}
                      </p>
                    )}
                  </AreaBox>
                </FlexBox>
                <FlexBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="이름"
                      variant={'bordered'}
                      radius="md"
                      type="text"
                      label={
                        <FilterLabel>
                          이름<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('mUsername').onChange(e)
                      }}
                      {...register('mUsername', {
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
                    {errors.mUsername && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mUsername.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="연락처"
                      variant={'bordered'}
                      radius="md"
                      type="text"
                      label={
                        <FilterLabel>
                          연락처<span>*</span>
                        </FilterLabel>
                      }
                      className="w-full"
                      onChange={e => {
                        register('mPhoneNum').onChange(e)
                      }}
                      maxLength={11}
                      {...register('mPhoneNum', {
                        required: {
                          value: true,
                          message: '연락처를 입력해주세요.',
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
                    {errors.mPhoneNum && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mPhoneNum.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder="비상 연락망"
                      variant="bordered"
                      radius="md"
                      type="text"
                      label="기타 연락처"
                      className="w-full"
                      maxLength={12}
                      onChange={e => {
                        register('mPhoneNumFriend').onChange(e)
                      }}
                      {...register('mPhoneNumFriend', {
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
                    {errors.mPhoneNumFriend && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.mPhoneNumFriend.message)}
                      </p>
                    )}
                  </AreaBox>
                </FlexBox>
                <Address
                  codeValueName={'mZipCode'}
                  valueName={'mAddresses'}
                  detailValueName={'mAddressDetail'}
                  setValue={setValue}
                />
                <FlexBox>
                  <AreaBox>
                    <Input
                      labelPlacement="outside"
                      placeholder=" "
                      variant="bordered"
                      radius="md"
                      type="text"
                      label="이메일"
                      className="w-full"
                      {...register('email', {
                        pattern: {
                          value:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          message: '유효하지 않은 이메일 형식입니다.',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </AreaBox>
                  <AreaBox>
                    <Controller
                      control={control}
                      name="mPart"
                      render={({ field }) => (
                        <Suspense
                          fallback={
                            <LodingDiv>
                              <i className="xi-spinner-2" />
                            </LodingDiv>
                          }
                        >
                          <AdviceMultiSelect
                            selectedKey={adviceType}
                            field={field}
                            label={
                              <FilterLabel>
                                강의분야{' '}
                                <span className="multi">(중복가능)</span>
                              </FilterLabel>
                            }
                            handleChange={setAdviceType}
                            category={'강의분야'}
                          />
                        </Suspense>
                      )}
                    />
                  </AreaBox>
                  <AreaBox>
                    <DatePickerBox>
                      <Controller
                        control={control}
                        name="mJoiningDate"
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
                              joiningDate === null
                                ? null
                                : new Date(joiningDate)
                            }
                            placeholderText="날짜를 선택해주세요."
                            isClearable
                            onChange={date => {
                              field.onChange(date)
                              setJoiningDate(date)
                            }}
                            dateFormat="yyyy/MM/dd"
                            onChangeRaw={e => e.preventDefault()}
                            onFocus={e => e.target.blur()}
                            customInput={
                              <Input
                                ref={field.ref}
                                label="입사일"
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
                    {errors.joiningDate && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.joiningDate.message)}
                      </p>
                    )}
                  </AreaBox>
                </FlexBox>
                <FlexBox>
                  <AreaBox>
                    <div className="flex items-center gap-3">
                      <Button isDisabled={true} color={'primary'}>
                        도장 생성
                      </Button>
                      <Noti>
                        <span>*</span> 도장 생성은 아이디 생성 후 진행해주세요.
                      </Noti>
                    </div>
                    <div></div>
                  </AreaBox>
                </FlexBox>
                <BtnBox>
                  <Button
                    type="submit"
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
TeacherWrite.getLayout = page => <Layout>{page}</Layout>
