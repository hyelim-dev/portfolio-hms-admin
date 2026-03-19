import { useState } from 'react'
import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { CREATE_PRE_INSPECTION_MUTATION } from '@/graphql/mutations'
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

export default function DropOutMemoForm({ setIsCreate, subjectId, students }) {
  // const { userLogs } = useUserLogsMutation()
  const [createPreInspection] = useMutation(CREATE_PRE_INSPECTION_MUTATION)
  const { register, handleSubmit, reset, control, formState } = useForm()
  const { errors } = formState
  const [studentName, setStudentName] = useState('수강생명')
  const [memoType, setMemoType] = useState('훈련교사')
  const [memoDate, setMemoDate] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const studentsList = [
    {
      id: '수강생명',
      student: { name: '수강생명' },
    },
    ...students.filter(student => student.courseComplete),
  ]

  const onSubmit = data => {
    createPreInspection({
      variables: {
        subjectId: subjectId,
        studentPaymentId: parseInt(data.studentPaymentId),
        actionTaken: data.actionTaken === '' ? null : data.actionTaken,
        preInspectionDetails:
          data.preInspectionDetails === '' ? null : data.preInspectionDetails,
        preScreenerType: data.preScreenerType,
        dateOfPreInspection:
          data.dateOfPreInspection === undefined
            ? null
            : new Date(data.dateOfPreInspection),
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId:  ${data.studentPaymentId} 중도탈락 사전 점검 등록`,
        //   `ok: ${result.createPreInspection.ok}`,
        // )
        if (result.createPreInspection.ok) {
          setIsCreate(true)
          alert(`중도탈락 사전점검이 등록되었습니다.`)
          reset()
          setStudentName('수강생명')
          setMemoType('훈련교사')
          setMemoDate(null)
        }
      },
    })
  }

  const handleStudentChange = e => {
    setStudentName(e.target.value)
  }
  const handleTypeChange = value => {
    setMemoType(value)
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Controller
              control={control}
              name="studentPaymentId"
              rules={{
                required: {
                  value: true,
                  message: '학력을 선택해주세요',
                },
              }}
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder=" "
                  defaultValue={[studentName]}
                  className="w-full"
                  label={
                    <FilterLabel>
                      수강생명 <span>*</span>
                    </FilterLabel>
                  }
                  variant="bordered"
                  selectedKeys={[studentName]}
                  onChange={value => {
                    if (value.target.value !== '') {
                      field.onChange(value)
                      handleStudentChange(value)
                    }
                  }}
                >
                  {studentsList.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.student.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            {errors.studentPaymentId && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.studentPaymentId.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <RadioBox>
              <Controller
                control={control}
                name="preScreenerType"
                rules={{
                  required: {
                    value: true,
                    message: '사전 점검 구분을 선택해주세요.',
                  },
                }}
                defaultValue={memoType}
                render={({ field }) => (
                  <RadioGroup
                    label={
                      <FilterLabel>
                        사전 점검 구분<span>*</span>
                      </FilterLabel>
                    }
                    orientation="horizontal"
                    className="gap-[0.65rem] z-[5]"
                    classNames={{ wrapper: 'z-0' }}
                    value={memoType}
                    onValueChange={value => {
                      field.onChange(value)
                      handleTypeChange(value)
                    }}
                  >
                    <Radio key={'훈련교사'} value={'훈련교사'}>
                      훈련교사
                    </Radio>
                    <Radio key={'교무팀장'} value={'교무팀장'}>
                      교무팀장
                    </Radio>
                    <Radio key={'출결부진'} value={'출결부진'}>
                      출결부진
                    </Radio>
                  </RadioGroup>
                )}
              />
            </RadioBox>
            {errors.preScreenerType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.preScreenerType.message)}
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
                    message: '점검 일자를 선택해주세요.',
                  },
                }}
                name="dateOfPreInspection"
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
                            점검 일자<span>*</span>
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
            {errors.dateOfPreInspection && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.dateOfPreInspection.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  점검 내용<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('preInspectionDetails').onChange(e)
              }}
              {...register('preInspectionDetails', {
                required: {
                  value: true,
                  message: '점검 내용을 입력해주세요.',
                },
              })}
            />
            {errors.preInspectionDetails && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.preInspectionDetails.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  조치 사항<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('actionTaken').onChange(e)
              }}
              {...register('actionTaken', {
                required: {
                  value: true,
                  message: '조치 사항을 입력해주세요.',
                },
              })}
            />
            {errors.actionTaken && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.actionTaken.message)}
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
