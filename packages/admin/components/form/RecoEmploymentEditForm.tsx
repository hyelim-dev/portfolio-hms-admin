import {
  DELETE_EMPLOYMENT_RECOMMENDATION_MUTATION,
  EDIT_EMPLOYMENT_RECOMMENDATION_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Radio, RadioGroup, Textarea } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import DatePickerHeader from '@/components/common/DatePickerHeader'
import ListInfo from '@/components/common/ListInfo'

const DetailForm = styled.form`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  border: 2px solid hsl(240 6% 90%);
  padding: 1rem;
  border-radius: 0.5rem;
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

  &.textBox {
    align-items: center;
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
  gap: 0.5rem;
  flex-direction: column;

  button {
    width: 5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;

    button {
      width: 50%;
    }
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
export default function RecoEmploymentEditForm({
  item,
  refetch,
  setPage,
  mId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [editRecoEmployment] = useMutation(
    EDIT_EMPLOYMENT_RECOMMENDATION_MUTATION,
  )
  const [deleteRecoEmployment] = useMutation(
    DELETE_EMPLOYMENT_RECOMMENDATION_MUTATION,
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
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      dateOfRecommendation: null,
      recruitmentField: '',
      companyName: '',
      location: '',
      phoneNum: '',
      dateOfInterview: null,
      employmentStatus: '',
      reasonForNonEmployment: '',
      certificateOfEmploymentStatus: '',
    },
  })

  useEffect(() => {
    reset({
      dateOfRecommendation: item.dateOfRecommendation || null,
      recruitmentField: item.recruitmentField || '',
      companyName: item.companyName || '',
      location: item.location || '',
      phoneNum: item.phoneNum || '',
      dateOfInterview: item.dateOfInterview || null,
      employmentStatus: item.employmentStatus || '미취업',
      reasonForNonEmployment: item.reasonForNonEmployment || '',
      certificateOfEmploymentStatus: item.certificateOfEmploymentStatus || 'N',
    })

    if (
      item.dateOfRecommendation === null ||
      item.dateOfRecommendation === undefined
    ) {
      setRecommendationDate(null)
    } else {
      const timestamp = parseInt(item.dateOfRecommendation)
      setRecommendationDate(timestamp)
    }

    if (item.dateOfInterview === null || item.dateOfInterview === undefined) {
      setInterviewDate(null)
    } else {
      const timestamp = parseInt(item.dateOfInterview)
      setInterviewDate(timestamp)
    }

    if (item.employmentStatus) {
      setIsEmployment(item.employmentStatus)
    }

    if (item.certificateOfEmploymentStatus) {
      setIsCertificate(item.certificateOfEmploymentStatus)
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editRecoEmployment({
            variables: {
              editEmploymentRecommendationId: item.id,
              dateOfRecommendation:
                data.dateOfRecommendation === null
                  ? null
                  : typeof data.dateOfRecommendation === 'string'
                    ? new Date(parseInt(data.dateOfRecommendation))
                    : new Date(data.dateOfRecommendation),
              recruitmentField:
                data.recruitmentField === '' ? null : data.recruitmentField,
              companyName: data.companyName === '' ? null : data.companyName,
              location: data.location === '' ? null : data.location,
              phoneNum: data.phoneNum === '' ? null : data.phoneNum,
              dateOfInterview:
                data.dateOfInterview === null
                  ? null
                  : typeof data.dateOfInterview === 'string'
                    ? new Date(parseInt(data.dateOfInterview))
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
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} 취업 추천 id:${item.id} 수정`,
          //   `ok: ${
          //     result.data.editEmploymentRecommendation.ok
          //   } / ${dirtyFieldsArray.join(', ')}`,
          // )
          if (!result.data.editEmploymentRecommendation.ok) {
            throw new Error('취업 추천 수정 실패')
          }
          setPage(1)
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('취업 추천 수정 중 에러 발생:', error)
          alert('취업 추천 수정 처리 중 오류가 발생했습니다.')
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const deleteItem = async id => {
    const isDelete = confirm('삭제하시겠습니까?\n삭제 후 되돌리수 없습니다.')
    if (isDelete) {
      try {
        const result = await deleteRecoEmployment({
          variables: {
            deleteEmploymentRecommendationId: id,
          },
        })
        // userLogs(
        //   `${item.stName} 취업 추천 현황 id:${id} 삭제`,
        //   `ok: ${result.data.deleteEmploymentRecommendation.ok}`,
        // )

        if (!result.data.deleteEmploymentRecommendation.ok) {
          throw new Error('취업 추천 현황 삭제 실패')
        }
        setPage(1)
        refetch()
        alert('삭제되었습니다.')
      } catch (error) {
        console.error('취업 추천 현황 삭제 중 에러 발생:', error)
        alert('취업 추천 현황 삭제 처리 중 오류가 발생했습니다.')
      }
    }
  }

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}:` +
      `${date.getSeconds().toString().padStart(2, '0')}`
    return formatted
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
                    dateFormat="yyyy/MM/dd"
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
        <FlexBox className="textBox">
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
              수정
            </Button>
            <Button
              variant="bordered"
              color="primary"
              className="w-full text-primary"
              onClick={() => deleteItem(item.id)}
            >
              삭제
            </Button>
          </BtnBox>
        </FlexBox>
        <ListInfo item={item} />
      </DetailForm>
    </>
  )
}
