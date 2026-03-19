import {
  CREATE_CERTIFICATE_MUTATION,
  CREATE_EMPLOYMENT_RECOMMENDATION_MUTATION,
} from '@/graphql/mutations'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Radio, RadioGroup, Textarea } from '@nextui-org/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import DatePickerHeader from '@/components/common/DatePickerHeader'

const DetailForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FlexBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1 3;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`

const SmallAreaBox = styled.div`
  width: fit-content;
  /* min-width: 20%; */

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;

  span {
    color: red;
  }
`

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.75rem;
  width: 5rem;

  @media (max-width: 768px) {
    padding-top: 0;
    width: 100%;
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

  @media (max-width: 768px) {
    .react-datepicker {
      display: flex;
    }
  }
`

const RadioBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

export default function RecoEmploymentForm({
  setIsCreate,
  paymentId,
  subjectId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [createEmploymentRecommentation] = useMutation(
    CREATE_EMPLOYMENT_RECOMMENDATION_MUTATION,
  )
  const [recommendationDate, setRecommendationDate] = useState(null)
  const [interviewDate, setInterviewDate] = useState(null)
  const [isEmployment, setIsEmployment] = useState('미취업')
  const [isCertificate, setIsCertificate] = useState('N')
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    createEmploymentRecommentation({
      variables: {
        subjectId: subjectId,
        studentPaymentId: paymentId,
        dateOfRecommendation:
          data.dateOfRecommendation === undefined
            ? null
            : new Date(data.dateOfRecommendation),
        recruitmentField:
          data.recruitmentField === '' ? null : data.recruitmentField,
        companyName: data.companyName === '' ? null : data.companyName,
        location: data.location === '' ? null : data.location,
        phoneNum: data.phoneNum === '' ? null : data.phoneNum,
        dateOfInterview:
          data.dateOfInterview === undefined
            ? null
            : new Date(data.dateOfInterview),
        employmentStatus:
          data.employmentStatus === '' ? null : data.employmentStatus,
        reasonForNonEmployment:
          data.reasonForNonEmployment === ''
            ? null
            : data.reasonForNonEmployment,
        certificateOfEmploymentStatus:
          data.certificateOfEmploymentStatus === ''
            ? null
            : data.certificateOfEmploymentStatus,
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId: ${paymentId} 취업 추천 등록`,
        //   `ok: ${result.createEmploymentRecommendation.ok}`,
        // )
        if (result.createEmploymentRecommendation.ok) {
          setIsCreate(true)
          alert('취업 추천이 추가되었습니다.')
          reset()
          setRecommendationDate(null)
          setInterviewDate(null)
          setIsEmployment('미취업')
          setIsCertificate('N')
        }
      },
    })
  }

  const handleEmploymentChange = value => {
    setIsEmployment(value)
  }
  const handleCertificateChange = value => {
    setIsCertificate(value)
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <DatePickerBox>
              <Controller
                control={control}
                name="dateOfRecommendation"
                rules={{
                  required: {
                    value: true,
                    message: '추천일자를 선택해주세요.',
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
                      recommendationDate === null
                        ? null
                        : new Date(recommendationDate)
                    }
                    placeholderText="날짜를 선택해주세요."
                    isClearable
                    onChange={date => {
                      field.onChange(date)
                      setRecommendationDate(date)
                    }}
                    dateFormat="yyyy/MM/dd"
                    onChangeRaw={e => e.preventDefault()}
                    onFocus={e => e.target.blur()}
                    customInput={
                      <Input
                        ref={field.ref}
                        label={
                          <FilterLabel>
                            추천 일자 <span>*</span>
                          </FilterLabel>
                        }
                        labelPlacement="outside"
                        type="text"
                        variant="bordered"
                        id="date"
                        isReadOnly={true}
                        classNames={{
                          input: 'caret-transparent',
                        }}
                        startContent={<i className="xi-calendar" />}
                      />
                    }
                  />
                )}
              />
            </DatePickerBox>
            {errors.dateOfRecommendation && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.dateOfRecommendation.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  회사명 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('companyName', {
                required: {
                  value: true,
                  message: '회사명을 작성해주세요',
                },
              })}
            />
            {errors.companyName && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.companyName.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  채용분야 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('recruitmentField', {
                required: {
                  value: true,
                  message: '채용분야을 작성해주세요',
                },
              })}
            />
            {errors.recruitmentField && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.recruitmentField.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  소재지 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('location', {
                required: {
                  value: true,
                  message: '소재지를 작성해주세요',
                },
              })}
            />
            {errors.location && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.location.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  전화번호 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              maxLength={12}
              {...register('phoneNum', {
                required: {
                  value: true,
                  message: '전화번호를 작성해주세요',
                },
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
            {errors.phoneNum && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.phoneNum.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <DatePickerBox>
              <Controller
                control={control}
                name="dateOfInterview"
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
                      interviewDate === null ? null : new Date(interviewDate)
                    }
                    placeholderText="날짜를 선택해주세요."
                    isClearable
                    onChange={date => {
                      field.onChange(date)
                      setInterviewDate(date)
                    }}
                    showTimeSelect
                    timeIntervals={10}
                    dateFormat="yyyy/MM/dd HH:mm"
                    onChangeRaw={e => e.preventDefault()}
                    onFocus={e => e.target.blur()}
                    customInput={
                      <Input
                        ref={field.ref}
                        label={<FilterLabel>면접 일자</FilterLabel>}
                        labelPlacement="outside"
                        type="text"
                        variant="bordered"
                        id="date"
                        isReadOnly={true}
                        classNames={{
                          input: 'caret-transparent',
                        }}
                        startContent={<i className="xi-calendar" />}
                      />
                    }
                  />
                )}
              />
            </DatePickerBox>
            {errors.dateOfInterview && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.dateOfInterview.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <RadioBox>
              <Controller
                control={control}
                name="employmentStatus"
                rules={{
                  required: {
                    value: true,
                    message: '상담 구분을 선택해주세요.',
                  },
                }}
                defaultValue={isEmployment}
                render={({ field }) => (
                  <RadioGroup
                    label={
                      <FilterLabel>
                        취업 여부<span>*</span>
                      </FilterLabel>
                    }
                    orientation="horizontal"
                    className="gap-[0.65rem]"
                    classNames={{ wrapper: 'z-0' }}
                    value={isEmployment}
                    onValueChange={value => {
                      field.onChange(value)
                      handleEmploymentChange(value)
                    }}
                  >
                    <Radio key={'취업'} value={'취업'}>
                      취업
                    </Radio>
                    <Radio key={'미취업'} value={'미취업'}>
                      미취업
                    </Radio>
                  </RadioGroup>
                )}
              />
            </RadioBox>
            {errors.employmentStatus && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.employmentStatus.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <RadioBox>
              <Controller
                control={control}
                name="certificateOfEmploymentStatus"
                rules={{
                  required: {
                    value: true,
                    message: '재직 증명 확보을 선택해주세요.',
                  },
                }}
                defaultValue={isCertificate}
                render={({ field }) => (
                  <RadioGroup
                    label={
                      <FilterLabel>
                        재직 증명 확보 예정<span>*</span>
                      </FilterLabel>
                    }
                    orientation="horizontal"
                    className="gap-[0.65rem]"
                    classNames={{ wrapper: 'z-0' }}
                    value={isCertificate}
                    onValueChange={value => {
                      field.onChange(value)
                      handleCertificateChange(value)
                    }}
                  >
                    <Radio key={'Y'} value={'Y'}>
                      Y
                    </Radio>
                    <Radio key={'N'} value={'N'}>
                      N
                    </Radio>
                  </RadioGroup>
                )}
              />
            </RadioBox>
            {errors.certificateOfEmploymentStatus && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.certificateOfEmploymentStatus.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  미취업 사유 <span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('reasonForNonEmployment').onChange(e)
              }}
              {...register('reasonForNonEmployment', {
                required: {
                  value: true,
                  message: '미취업 사유을 입력해주세요.',
                },
              })}
            />
            {errors.reasonForNonEmployment && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.reasonForNonEmployment.message)}
              </p>
            )}
          </AreaBox>
          <BtnBox>
            <Button
              type="submit"
              size="md"
              radius="md"
              color="primary"
              className="md:w-[50%] w-full"
            >
              추가
            </Button>
          </BtnBox>
        </FlexBox>
      </DetailForm>
    </>
  )
}
