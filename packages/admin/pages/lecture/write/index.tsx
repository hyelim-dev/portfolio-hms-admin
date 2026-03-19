import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useRef, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { CREATE_LECTURES_MUTATION } from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import Layout from '@/pages/lecture/layout'
import SubjectModal from '@/components/modal/SubjectModal'
import LectureDates from '@/components/modal/LectureDates'
import TeacherMultiSelectID from '@/components/common/select/TeacherMultiSelectID'
// import useUserLogsMutation from '@/utils/userLogs'
import FormTopInfo from '@/components/common/FormTopInfo'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import TypeLink from '@/components/common/TypeLink'
import SuspenseBox from '@/components/wrappers/SuspenseWrap'

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
const DetailForm = styled.form`
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
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`
const AreaBox = styled.div`
  flex: 1;
  position: relative;
`
const TimeBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;

  p {
    height: 40px;
    line-height: 40px;
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
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;

  span {
    color: red;

    &.multi {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.gray};
    }
  }

  &.file {
    padding-bottom: 0.5rem;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function LectureWrite() {
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const [campusName, setCampusName] = useState('신촌')
  const [createLectures] = useMutation(CREATE_LECTURES_MUTATION, {
    context: {
      headers: {
        'x-apollo-operation-name': 'timetableAttached',
        // 'apollo-require-preflight': 'true',
      },
    },
  })
  const [subjectState, setSubjectState] = useState(null)
  const [sub, setSub] = useState('-')
  const [teacher, setTeacher] = useState([])
  const [subjectSelectedData, setSubjectSelectedData] = useState(null)
  const [subjectSelected, setSubjectSelected] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const [lectureStartTime, setLectureStartTime] = useState(null)
  const [lectureEndTime, setLectureEndTime] = useState(null)
  const [lectureStartDate, setLectureStartDate] = useState(null)
  const [lectureEndDate, setLectureEndDate] = useState(null)
  const [changeDate, setChangeDate] = useState(false)
  const [isDate, setIsDate] = useState(false)
  const [isReport, setIsReport] = useState('Y')
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('파일을 선택하세요.')

  const {
    isOpen: sbjIsOpen,
    onOpen: sbjOpen,
    onClose: sbjClose,
  } = useDisclosure()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    getValues,
    control,
    setError,
    setValue,
    handleSubmit,
    resetField,
    reset,
    clearErrors,
    formState,
  } = useForm()
  const { errors } = formState

  useEffect(() => {
    if (changeDate) {
      setValue('lectureDetails', [])
    }
  }, [changeDate])

  const handleCampusNameChange = e => {
    setCampusName(e.target.value)
  }

  const handleSubChange = e => {
    setSub(e.target.value)
  }

  const handleTypeChange = value => {
    setIsReport(value)
  }

  const handleFileChange = event => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    const file = event.target.files[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('timetableAttached', {
          type: 'manual',
          message: '파일이 너무 큽니다. 10Mb이하만 가능합니다.',
        })
        setFileName('')
        fileInputRef.current.value = ''
        resetField('timetableAttached')
      } else {
        clearErrors('timetableAttached')
        setFileName(file.name)
        setValue('timetableAttached', file)
      }
    }
  }
  const handleButtonClick = e => {
    fileInputRef.current.click()
  }

  const onSubmit = async data => {
    try {
      if (data.lectureDetails.length > 1 && data.lectureDetails[0].length > 9) {
        const teachersIdArray = data.teachersId
          .split(',')
          .filter(Boolean)
          .map(Number)
        const result = await createLectures({
          variables: {
            campus: data.campus,
            temporaryName: data.temporaryName,
            subDiv: data.subDiv,
            teachersId: teachersIdArray,
            roomNum: data.roomNum,
            subjectId: parseInt(subjectSelectedData.id),
            lecturePeriodStart: data.lecturePeriodStart,
            lecturePeriodEnd: data.lecturePeriodEnd,
            lectureDetails: data.lectureDetails,
            lectureTime: [lectureStartTime, lectureEndTime],
            eduStatusReport: data.eduStatusReport,
            approvedNum: parseInt(data.approvedNum),
            confirmedNum: parseInt(data.confirmedNum),
            sessionNum: parseInt(data.sessionNum),
            timetableAttached:
              data.timetableAttached === '파일을 선택하세요.'
                ? null
                : data.timetableAttached,
          },
        })

        // userLogs(
        //   `${data.temporaryName}강의 등록`,
        //   `ok: ${result.data.createLectures.ok}`,
        // )

        if (!result.data.createLectures.ok) {
          throw new Error('과정 등록 실패')
        }

        alert('등록되었습니다.')
        router.push('/lecture')
      } else {
        resetField('lecturePeriodStart')
        resetField('lecturePeriodEnd')
        setValue('lectureDetails', [])
        setLectureStartDate(null)
        setLectureEndDate(null)
        alert('개강일, 종강일, 요일을 다시 선택해주세요.')
      }
    } catch (error) {
      console.error('강의 등록 중 에러 발생:', error)
      alert('강의 등록 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
      <MainWrap>
        <ConArea>
          <Breadcrumb rightArea={false} isFilter={false} />
          <DetailBox>
            <FormTopInfo item={subjectState} noti={true} time={false} />
            <DetailForm onSubmit={handleSubmit(onSubmit)}>
              <FlexBox>
                <AreaBox style={{ minWidth: '20%' }}>
                  <Controller
                    control={control}
                    name="campus"
                    defaultValue={campusName}
                    rules={{
                      required: {
                        value: true,
                        message: '캠퍼스를 선택해주세요',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Select
                        labelPlacement="outside"
                        label={
                          <FilterLabel>
                            캠퍼스<span>*</span>
                          </FilterLabel>
                        }
                        placeholder=" "
                        className="w-full"
                        variant="bordered"
                        defaultSelectedKeys={[campusName]}
                        selectedKeys={[campusName]}
                        onChange={value => {
                          if (value.target.value !== '') {
                            field.onChange(value)
                            handleCampusNameChange(value)
                          }
                        }}
                      >
                        <SelectItem key={'신촌'} value={'신촌'}>
                          {'신촌'}
                        </SelectItem>
                      </Select>
                    )}
                  />
                  {errors.campus && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.campus.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Controller
                    control={control}
                    name="subDiv"
                    rules={{
                      required: {
                        value: true,
                        message: '수강 구분을 선택해주세요.',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Suspense
                        fallback={
                          <LodingDiv>
                            <i className="xi-spinner-2" />
                          </LodingDiv>
                        }
                      >
                        <AdviceSelect
                          selectedKey={sub}
                          field={field}
                          label={'수강구분'}
                          handleChange={handleSubChange}
                          optionDefault={{
                            type: '-',
                          }}
                          category={'수강구분'}
                        />
                      </Suspense>
                    )}
                  />
                  {errors.subDiv && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.subDiv.message)}
                    </p>
                  )}
                  <Suspense
                    fallback={
                      <LodingDiv>
                        <i className="xi-spinner-2" />
                      </LodingDiv>
                    }
                  >
                    <TypeLink
                      typeLink={'subDiv'}
                      typeName={'수강구분'}
                      permissionName={'수강구분'}
                    />
                  </Suspense>
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Textarea
                    labelPlacement="outside"
                    placeholder="표시과목명"
                    variant="bordered"
                    radius="md"
                    type="text"
                    label={
                      <FilterLabel>
                        표시과목명<span>*</span>
                      </FilterLabel>
                    }
                    minRows={1}
                    onChange={e => {
                      register('temporaryName').onChange(e)
                    }}
                    className="w-full"
                    {...register('temporaryName', {
                      required: {
                        value: true,
                        message: '표시과목명을 입력해주세요.',
                      },
                    })}
                  />
                  {errors.temporaryName && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.temporaryName.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Textarea
                    readOnly
                    value={subjectSelectedData?.subjectName || ''}
                    label={
                      <FilterLabel>
                        과정 선택<span>*</span>
                      </FilterLabel>
                    }
                    labelPlacement="outside"
                    className="max-w-full"
                    variant="bordered"
                    minRows={1}
                    onChange={e => {
                      register('subjectId').onChange(e)
                    }}
                    onClick={sbjOpen}
                    {...register('subjectId', {
                      required: {
                        value: true,
                        message: '과정을 선택해 주세요.',
                      },
                    })}
                  />
                  {errors.subjectId && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.subjectId.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Controller
                    control={control}
                    name="teachersId"
                    rules={{
                      required: {
                        value: true,
                        message: '강사를 선택해주세요.',
                      },
                    }}
                    render={({ field }) => (
                      <Controller
                        control={control}
                        name="teachersId"
                        render={({ field, fieldState }) => (
                          <SuspenseBox>
                            <TeacherMultiSelectID
                              selectedKey={teacher}
                              field={field}
                              label={
                                <FilterLabel>
                                  강사명<span>*</span>{' '}
                                  <span className="multi">(중복가능)</span>
                                </FilterLabel>
                              }
                              handleChange={setTeacher}
                              optionDefault={{
                                mUsername: '강사명 없음',
                                id: '강사명 없음',
                              }}
                            />
                          </SuspenseBox>
                        )}
                      />
                    )}
                  />
                  {errors.teachersId && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.teachersId.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Input
                    labelPlacement="outside"
                    placeholder="예) 204호 또는 별관 204호"
                    variant="bordered"
                    radius="md"
                    type="text"
                    label={
                      <FilterLabel>
                        강의실<span>*</span>
                      </FilterLabel>
                    }
                    onChange={e => {
                      register('roomNum').onChange(e)
                    }}
                    className="w-full"
                    {...register('roomNum', {
                      required: {
                        value: true,
                        message: '강의실을 입력해 주세요.',
                      },
                      pattern: {
                        value: /^[가-힣a-zA-Z0-9\s]*$/,
                        message: '한글, 영어, 숫자만 사용 가능합니다.',
                      },
                    })}
                  />
                  {errors.roomNum && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.roomNum.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <TimeBox>
                    <DatePickerBox>
                      <Controller
                        control={control}
                        name="lectureTime"
                        rules={{
                          required: {
                            value: true,
                            message: '강의 시작시간을 선택해주세요.',
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
                            selectsStart
                            selected={
                              lectureStartTime === null
                                ? null
                                : new Date(lectureStartTime)
                            }
                            placeholderText="시작시간"
                            isClearable
                            onChange={date => {
                              field.onChange(date)
                              setLectureStartTime(date)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            onChangeRaw={e => e.preventDefault()}
                            onFocus={e => e.target.blur()}
                            customInput={
                              <Input
                                label={
                                  <FilterLabel>
                                    강의시간<span>*</span>
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
                                startContent={<i className="xi-time-o" />}
                              />
                            }
                          />
                        )}
                      />
                    </DatePickerBox>
                    <p>-</p>
                    <DatePickerBox>
                      <Controller
                        control={control}
                        name="lectureTime"
                        rules={{
                          required: {
                            value: true,
                            message: '강의 종료시간을 선택해주세요.',
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
                            selected={
                              lectureEndTime === null
                                ? null
                                : new Date(lectureEndTime)
                            }
                            placeholderText="종료시간"
                            isClearable
                            selectsEnd
                            onChange={date => {
                              field.onChange(date)
                              setLectureEndTime(date)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            onChangeRaw={e => e.preventDefault()}
                            onFocus={e => e.target.blur()}
                            customInput={
                              <Input
                                label=" "
                                labelPlacement="outside"
                                type="text"
                                variant="bordered"
                                id="date"
                                classNames={{
                                  input: 'caret-transparent',
                                }}
                                isReadOnly={true}
                                startContent={<i className="xi-time-o" />}
                              />
                            }
                          />
                        )}
                      />
                    </DatePickerBox>
                  </TimeBox>
                  {errors.lectureTime && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.lectureTime.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <DatePickerBox>
                    <Controller
                      control={control}
                      name="lecturePeriodStart"
                      rules={{
                        required: {
                          value: true,
                          message: '개강일을 선택해주세요.',
                        },
                      }}
                      defaultValue={subjectState?.startDate}
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
                            lectureStartDate === null
                              ? null
                              : new Date(lectureStartDate)
                          }
                          placeholderText="날짜를 선택해주세요."
                          isClearable
                          onChange={date => {
                            const adjustedDate = date
                              ? new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  10,
                                  10,
                                  10,
                                )
                              : null
                            field.onChange(adjustedDate)
                            setLectureStartDate(adjustedDate)
                            setChangeDate(true)
                          }}
                          dateFormat="yyyy/MM/dd"
                          onChangeRaw={e => e.preventDefault()}
                          onFocus={e => e.target.blur()}
                          customInput={
                            <Input
                              label={
                                <FilterLabel>
                                  개강일<span>*</span>
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
                  {errors.lecturePeriodStart && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.lecturePeriodStart.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <DatePickerBox>
                    <Controller
                      control={control}
                      name="lecturePeriodEnd"
                      rules={{
                        required: {
                          value: true,
                          message: '종강일을 선택해주세요.',
                        },
                      }}
                      defaultValue={subjectState?.endDate}
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
                            lectureEndDate === null
                              ? null
                              : new Date(lectureEndDate)
                          }
                          minDate={new Date(lectureStartDate)}
                          placeholderText="날짜를 선택해주세요."
                          isClearable
                          onChange={date => {
                            const adjustedDate = date
                              ? new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  23,
                                  59,
                                  59,
                                )
                              : null
                            field.onChange(adjustedDate)
                            setLectureEndDate(adjustedDate)
                            setChangeDate(true)
                          }}
                          dateFormat="yyyy/MM/dd"
                          onChangeRaw={e => e.preventDefault()}
                          onFocus={e => e.target.blur()}
                          customInput={
                            <Input
                              label={
                                <FilterLabel>
                                  종강일<span>*</span>
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
                  {errors.lecturePeriodEnd && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.lecturePeriodEnd.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <FilterLabel>
                    요일선택<span>*</span>
                  </FilterLabel>
                  <div className="flex items-end gap-3 mt-1.5">
                    <Button
                      isDisabled={
                        lectureStartDate === null || lectureEndDate === null
                          ? true
                          : false
                      }
                      color={'primary'}
                      onClick={onOpen}
                    >
                      요일선택
                    </Button>
                    <Input
                      readOnly
                      labelPlacement="outside"
                      className="max-w-full"
                      variant="bordered"
                      onChange={e => {
                        register('lectureDetails').onChange(e)
                      }}
                      {...register('lectureDetails', {
                        required: {
                          value: true,
                          message: '요일을 선택해 주세요.',
                        },
                      })}
                    />
                  </div>
                  {errors.lectureDetails && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.lectureDetails.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <RadioBox>
                    <Controller
                      control={control}
                      name="eduStatusReport"
                      defaultValue={'Y'}
                      rules={{
                        required: {
                          value: true,
                          message: '교육상황보고 연동여부를 선택해주세요.',
                        },
                      }}
                      render={({ field }) => (
                        <RadioGroup
                          label={
                            <FilterLabel>
                              교육상황보고 연동여부<span>*</span>
                            </FilterLabel>
                          }
                          orientation="horizontal"
                          className="gap-[0.65rem]"
                          classNames={{ wrapper: 'z-0' }}
                          value={isReport}
                          onValueChange={value => {
                            field.onChange(value)
                            handleTypeChange(value)
                          }}
                        >
                          <Radio key={'Y'} value={'Y'}>
                            예
                          </Radio>
                          <Radio key={'N'} value={'N'}>
                            아니오
                          </Radio>
                        </RadioGroup>
                      )}
                    />
                  </RadioBox>
                  {errors.eduStatusReport && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.eduStatusReport.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Input
                    labelPlacement="outside"
                    placeholder="숫자만 입력해주세요"
                    variant="bordered"
                    radius="md"
                    type="text"
                    label={
                      <FilterLabel>
                        승인인원<span>*</span>
                      </FilterLabel>
                    }
                    onChange={e => {
                      register('approvedNum').onChange(e)
                    }}
                    className="w-full"
                    {...register('approvedNum', {
                      required: {
                        value: true,
                        message: '승인 인원을 입력해주세요.',
                      },
                      pattern: {
                        value: /^[가-힣a-zA-Z0-9\s]*$/,
                        message: '한글, 영어, 숫자만 사용 가능합니다.',
                      },
                    })}
                  />
                  {errors.approvedNum && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.approvedNum.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Input
                    labelPlacement="outside"
                    placeholder="숫자만 입력해주세요"
                    variant="bordered"
                    radius="md"
                    type="text"
                    label={
                      <FilterLabel>
                        확정인원<span>*</span>
                      </FilterLabel>
                    }
                    defaultValue={subjectState?.roomNum}
                    onChange={e => {
                      register('confirmedNum').onChange(e)
                    }}
                    className="w-full"
                    {...register('confirmedNum', {
                      required: {
                        value: true,
                        message: '승인 인원을 입력해주세요.',
                      },
                      pattern: {
                        value: /^[가-힣a-zA-Z0-9\s]*$/,
                        message: '한글, 영어, 숫자만 사용 가능합니다.',
                      },
                    })}
                  />
                  {errors.confirmedNum && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.confirmedNum.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Input
                    labelPlacement="outside"
                    placeholder="숫자만 입력해주세요"
                    variant="bordered"
                    radius="md"
                    type="text"
                    label={
                      <FilterLabel>
                        교육회차<span>*</span>
                      </FilterLabel>
                    }
                    defaultValue={subjectState?.roomNum}
                    onChange={e => {
                      register('sessionNum').onChange(e)
                    }}
                    className="w-full"
                    {...register('sessionNum', {
                      required: {
                        value: true,
                        message: '승인 인원을 입력해주세요.',
                      },
                      pattern: {
                        value: /^[가-힣a-zA-Z0-9\s]*$/,
                        message: '한글, 영어, 숫자만 사용 가능합니다.',
                      },
                    })}
                  />
                  {errors.sessionNum && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.sessionNum.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <FilterLabel className="file">훈련시간표 첨부</FilterLabel>
                  <TimeBox>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <Button color={'primary'} onClick={handleButtonClick}>
                      파일 선택
                    </Button>
                    <Input
                      readOnly
                      placeholder=" "
                      variant="faded"
                      radius="md"
                      type="text"
                      value={fileName}
                      {...register('timetableAttached')}
                    />
                  </TimeBox>
                  {errors.timetableAttached && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.timetableAttached.message)}
                    </p>
                  )}
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
            </DetailForm>
          </DetailBox>
        </ConArea>
      </MainWrap>
      <SubjectModal
        subjectSelected={subjectSelected}
        setSubjectSelected={setSubjectSelected}
        setSubjectSelectedData={setSubjectSelectedData}
        sbjIsOpen={sbjIsOpen}
        sbjClose={sbjClose}
        setValue={setValue}
        radio={true}
        isLecture={true}
      />
      {lectureStartDate && (
        <LectureDates
          isOpen={isOpen}
          onClose={onClose}
          setValue={setValue}
          startDate={lectureStartDate}
          endDate={lectureEndDate}
          isDate={isDate}
          changeDate={changeDate}
          setChangeDate={setChangeDate}
        />
      )}
    </>
  )
}
LectureWrite.getLayout = page => <Layout>{page}</Layout>
