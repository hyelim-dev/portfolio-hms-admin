import {
  DELETE_STUDENT_CONSULTATION_MUTATION,
  EDIT_STUDENT_CONSULTATION_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Radio, RadioGroup, Textarea } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
import ListInfo from '@/components/common/ListInfo'
registerLocale('ko', ko)
const _ = require('lodash')

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

export default function EmploymentMemoEditForm({
  item,
  refetch,
  setPage,
  mId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [editStudentConsultation] = useMutation(
    EDIT_STUDENT_CONSULTATION_MUTATION,
  )
  const [deleteStudentConsultation] = useMutation(
    DELETE_STUDENT_CONSULTATION_MUTATION,
  )
  const [memoType, setMemoType] = useState('기초상담')
  const [memoDate, setMemoDate] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      typeOfConsultation: '',
      dateOfConsultation: null,
      detailsOfConsultation: '',
    },
  })

  useEffect(() => {
    reset({
      typeOfConsultation: item.typeOfConsultation || '기초상담',
      dateOfConsultation: item.dateOfConsultation || null,
      detailsOfConsultation: item.detailsOfConsultation || '',
    })

    if (item.typeOfConsultation) {
      setMemoType(item.typeOfConsultation)
    }

    if (
      item.dateOfConsultation === null ||
      item.dateOfConsultation === undefined
    ) {
      setMemoDate(null)
    } else {
      const timestamp = parseInt(item.dateOfConsultation)
      setMemoDate(timestamp)
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editStudentConsultation({
            variables: {
              editStudentConsultationId: item.id,
              typeOfConsultation:
                data.typeOfConsultation === ''
                  ? '기초상담'
                  : data.typeOfConsultation,
              dateOfConsultation:
                data.dateOfConsultation === null
                  ? null
                  : typeof data.dateOfConsultation === 'string'
                    ? new Date(parseInt(data.dateOfConsultation))
                    : new Date(data.dateOfConsultation),
              detailsOfConsultation:
                data.detailsOfConsultation === ''
                  ? null
                  : data.detailsOfConsultation,
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} ${data.eduType} 상담 id:${item.id} 수정`,
          //   `ok: ${
          //     result.data.editStudentConsultation.ok
          //   } / ${dirtyFieldsArray.join(', ')}`,
          // )

          if (!result.data.editStudentConsultation.ok) {
            throw new Error('상담 수정 실패')
          }
          setPage(1)
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('상담 수정 중 에러 발생:', error)
          alert('상담 수정 처리 중 오류가 발생했습니다.')
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
        const result = await deleteStudentConsultation({
          variables: {
            deleteStudentConsultationId: id,
          },
        })
        // userLogs(
        //   `${item.stName} 상담 id:${id} 삭제`,
        //   `ok: ${result.data.deleteStudentConsultation.ok}`,
        // )

        if (!result.data.deleteStudentConsultation.ok) {
          throw new Error('상담 삭제 실패')
        }
        setPage(1)
        refetch()
        alert('삭제되었습니다.')
      } catch (error) {
        console.error('상담 삭제 중 에러 발생:', error)
        alert('상담 삭제 처리 중 오류가 발생했습니다.')
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
        <FlexBox className="textBox">
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  상담 내용 <span>*</span>
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
