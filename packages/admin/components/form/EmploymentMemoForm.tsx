import { useState } from 'react'
import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Input, Radio, RadioGroup, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { CREATE_STUDENT_CONSULTATION_MUTATION } from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
registerLocale('ko', ko)
const _ = require('lodash')

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

export default function EmploymentMemoForm({
  setIsCreate,
  paymentId,
  subjectId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [createConsultation] = useMutation(CREATE_STUDENT_CONSULTATION_MUTATION)
  const { register, handleSubmit, reset, control, formState } = useForm()
  const { errors } = formState
  const [memoType, setMemoType] = useState('기초상담')
  const [memoDate, setMemoDate] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  const onSubmit = data => {
    createConsultation({
      variables: {
        subjectId: subjectId,
        studentPaymentId: paymentId,
        typeOfConsultation:
          data.typeOfConsultation === '' ? null : data.typeOfConsultation,
        dateOfConsultation:
          data.dateOfConsultation === undefined
            ? null
            : new Date(data.dateOfConsultation),
        detailsOfConsultation:
          data.detailsOfConsultation === '' ? null : data.detailsOfConsultation,
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId: ${paymentId} ${data.typeOfConsultation} 등록`,
        //   `ok: ${result.createStudentConsultation.ok}`,
        // )
        if (result.createStudentConsultation.ok) {
          setIsCreate(true)
          alert(`${data.typeOfConsultation} 등록되었습니다.`)
          reset()
          setMemoType('기초상담')
          setMemoDate(null)
        }
      },
    })
  }

  const handleTypeChange = value => {
    setMemoType(value)
  }
  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <RadioBox>
              <Controller
                control={control}
                name="typeOfConsultation"
                rules={{
                  required: {
                    value: true,
                    message: '상담 구분을 선택해주세요.',
                  },
                }}
                defaultValue={memoType}
                render={({ field }) => (
                  <RadioGroup
                    label={
                      <FilterLabel>
                        상담 구분<span>*</span>
                      </FilterLabel>
                    }
                    orientation="horizontal"
                    className="gap-[0.65rem]"
                    classNames={{ wrapper: 'z-0' }}
                    value={memoType}
                    onValueChange={value => {
                      field.onChange(value)
                      handleTypeChange(value)
                    }}
                  >
                    <Radio key={'기초상담'} value={'기초상담'}>
                      기초상담
                    </Radio>
                    <Radio key={'취업상담'} value={'취업상담'}>
                      취업상담
                    </Radio>
                    <Radio key={'사후관리'} value={'사후관리'}>
                      사후관리
                    </Radio>
                  </RadioGroup>
                )}
              />
            </RadioBox>
            {errors.typeOfConsultation && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.typeOfConsultation.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <DatePickerBox>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: '상담 일자를 선택해주세요.',
                  },
                }}
                name="dateOfConsultation"
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
                    selected={memoDate === null ? null : new Date(memoDate)}
                    placeholderText="날짜를 선택해주세요."
                    isClearable
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    onChange={date => {
                      field.onChange(date)
                      setMemoDate(date)
                    }}
                    dateFormat="yyyy/MM/dd HH:mm"
                    onChangeRaw={e => e.preventDefault()}
                    onFocus={e => e.target.blur()}
                    customInput={
                      <Input
                        ref={field.ref}
                        label={
                          <FilterLabel>
                            상담 일자<span>*</span>
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
            {errors.dateOfConsultation && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.dateOfConsultation.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  상담 내용<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('detailsOfConsultation').onChange(e)
              }}
              {...register('detailsOfConsultation', {
                required: {
                  value: true,
                  message: '상담 내용을 입력해주세요.',
                },
              })}
            />
            {errors.dateOfConsultation && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.dateOfConsultation.message)}
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
