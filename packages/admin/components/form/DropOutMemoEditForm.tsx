import {
  DELETE_PRE_INSPECTION_MUTATION,
  EDIT_PRE_INSPECTION_MUTATION,
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

export default function DropOutMemoEditForm({ item, refetch, setPage, mId }) {
  // const { userLogs } = useUserLogsMutation()
  const [editPreInspection] = useMutation(EDIT_PRE_INSPECTION_MUTATION)
  const [deletePreInspection] = useMutation(DELETE_PRE_INSPECTION_MUTATION)
  const [studentName, setStudentName] = useState('수강생명')
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
      preScreenerType: '',
      dateOfPreInspection: null,
      preInspectionDetails: '',
      actionTaken: '',
    },
  })

  useEffect(() => {
    reset({
      preScreenerType: item.preScreenerType || '기초상담',
      dateOfPreInspection: item.dateOfPreInspection || null,
      preInspectionDetails: item.preInspectionDetails || '',
      actionTaken: item.actionTaken || '',
    })

    if (item.stName) {
      setStudentName(item.stName)
    }

    if (item.preScreenerType) {
      setMemoType(item.preScreenerType)
    }

    if (
      item.dateOfPreInspection === null ||
      item.dateOfPreInspection === undefined
    ) {
      setMemoDate(null)
    } else {
      const timestamp = parseInt(item.dateOfPreInspection)
      setMemoDate(timestamp)
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editPreInspection({
            variables: {
              editPreInspectionId: item.id,
              preScreenerType:
                data.preScreenerType === '' ? '기초상담' : data.preScreenerType,
              dateOfPreInspection:
                data.dateOfPreInspection === null
                  ? null
                  : typeof data.dateOfPreInspection === 'string'
                    ? new Date(parseInt(data.dateOfPreInspection))
                    : new Date(data.dateOfPreInspection),
              preInspectionDetails:
                data.preInspectionDetails === ''
                  ? null
                  : data.preInspectionDetails,
              actionTaken: data.actionTaken === '' ? null : data.actionTaken,
              lastModifiedTime: new Date(),
            },
          })

          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} ${data.preScreenerType} 상담 id:${item.id} 수정`,
          //   `ok: ${result.data.editPreInspection.ok} / ${dirtyFieldsArray.join(
          //     ', ',
          //   )}`,
          // )

          if (!result.data.editPreInspection.ok) {
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
        const result = await deletePreInspection({
          variables: {
            deletePreInspectionId: id,
          },
        })
        // userLogs(
        //   `${item.stName} 상담 id:${id} 삭제`,
        //   `ok: ${result.data.deletePreInspection.ok}`,
        // )

        if (!result.data.deletePreInspection.ok) {
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

  const handleTypeChange = value => {
    setMemoType(value)
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>수강생명</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={studentName}
            />
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
                    isReadOnly
                    label={
                      <FilterLabel>
                        사전 점검 구분<span>*</span>
                      </FilterLabel>
                    }
                    orientation="horizontal"
                    className="gap-[0.65rem] w-full"
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
                    readOnly={true}
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
                    //  isClearable
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
                        isReadOnly={true}
                        variant={'bordered'}
                        ref={field.ref}
                        label={
                          <FilterLabel>
                            점검 일자<span>*</span>
                          </FilterLabel>
                        }
                        labelPlacement="outside"
                        type="text"
                        id="date"
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
          </AreaBox>
        </FlexBox>
        <FlexBox className="textBox">
          <AreaBox>
            <Textarea
              isReadOnly
              variant={'bordered'}
              label={
                <FilterLabel>
                  점검 내용<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
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
              isReadOnly
              variant={'bordered'}
              label={
                <FilterLabel>
                  조치 사항<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
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

          {/* <BtnBox>
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
          </BtnBox> */}
        </FlexBox>
        <ListInfo item={item} />
      </DetailForm>
    </>
  )
}
