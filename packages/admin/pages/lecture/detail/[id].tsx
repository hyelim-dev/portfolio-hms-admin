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
import {
  EDIT_LECTURES_MUTATION,
  SEARCH_LECTURES_MUTATION,
} from '@/graphql/mutations'
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

export default function LectureDetail() {
  const router = useRouter()
  const lectureId = typeof router.query.id === 'string' ? router.query.id : null
  // const { userLogs } = useUserLogsMutation()
  const [searchLectures] = useMutation(SEARCH_LECTURES_MUTATION)
  const [editLectures] = useMutation(EDIT_LECTURES_MUTATION, {
    context: {
      headers: {
        'x-apollo-operation-name': 'timetableAttached',
        // 'apollo-require-preflight': 'true',
      },
    },
  })
  const [campusName, setCampusName] = useState('신촌')
  const [sub, setSub] = useState('-')
  const [teacher, setTeacher] = useState([])
  const [subjectSelectedData, setSubjectSelectedData] = useState(null)
  const [subjectSelected, setSubjectSelected] = useState(null)
  const [datesSelected, setDatesSelected] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const [lectureStartTime, setLectureStartTime] = useState(null)
  const [lectureEndTime, setLectureEndTime] = useState(null)
  const [lectureStartDate, setLectureStartDate] = useState(null)
  const [lectureEndDate, setLectureEndDate] = useState(null)
  const [isReport, setIsReport] = useState('Y')
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('파일을 입력해주세요.')
  const [lectureData, setLectureData] = useState(null)
  const [isDate, setIsDate] = useState(false)
  const [changeDate, setChangeDate] = useState(false)
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
  } = useForm({
    defaultValues: {
      campus: lectureData?.campus,
      temporaryName: lectureData?.temporaryName,
      subDiv: lectureData?.subDiv,
      teachersId: lectureData?.teachersId,
      roomNum: lectureData?.roomNum,
      subjectId: lectureData?.subjectId,
      lecturePeriodStart: lectureData?.lecturePeriodStart,
      lecturePeriodEnd: lectureData?.lecturePeriodEnd,
      lectureDetails: lectureData?.lectureDetails,
      lectureTime: lectureData?.lectureTime,
      eduStatusReport: lectureData?.eduStatusReport,
      approvedNum: lectureData?.approvedNum,
      confirmedNum: lectureData?.confirmedNum,
      sessionNum: lectureData?.sessionNum,
      timetableAttached: lectureData?.timetableAttached,
    },
  })
  const { errors, dirtyFields, isDirty } = formState

  useEffect(() => {
    searchLectures({
      variables: {
        searchLecturesId: parseInt(lectureId),
      },
      onCompleted: result => {
        if (result.searchLectures.ok) {
          setLectureData(result.searchLectures.data[0])
        }
      },
    })
  }, [lectureId])

  const extractFileName = url => {
    if (url !== null) {
      const lastSlashIndex = url.lastIndexOf('/')
      const afterLastSlash = url.substring(lastSlashIndex + 1)
      const firstHyphenIndex = afterLastSlash.indexOf('-')
      const secondHyphenIndex = afterLastSlash.indexOf(
        '-',
        firstHyphenIndex + 1,
      )
      const fileNames = afterLastSlash.substring(secondHyphenIndex + 1)
      return fileNames
    }
  }

  useEffect(() => {
    if (changeDate) {
      reset({
        lectureDetails: null,
      })
    }
  }, [changeDate])

  useEffect(() => {
    if (lectureData) {
      if (lectureData.campus) {
        setCampusName(lectureData.campus)
      }
      if (lectureData.subDiv) {
        setSub(lectureData.subDiv)
      }
      if (lectureData.eduStatusReport) {
        setIsReport(lectureData.eduStatusReport)
      }

      if (lectureData?.lectureTime) {
        const startTime = new Date(lectureData?.lectureTime[0])
        const endTime = new Date(lectureData?.lectureTime[1])
        setLectureStartTime(startTime)
        setLectureEndTime(endTime)
      }

      if (lectureData?.lecturePeriodStart) {
        const date = parseInt(lectureData?.lecturePeriodStart)
        setLectureStartDate(date)
      }

      if (lectureData?.lecturePeriodEnd) {
        const date = parseInt(lectureData?.lecturePeriodEnd)
        setLectureEndDate(date)
      }

      if (lectureData?.teachers) {
        const date = lectureData?.teachers.map(teacher => String(teacher.id))
        setTeacher(date)
      }
      if (lectureData?.teachers) {
        const date = lectureData?.teachers.map(teacher => String(teacher.id))
        setTeacher(date)
      }

      if (lectureData?.lectureDetails.length > 0) {
        setDatesSelected(lectureData?.lectureDetails)
        setIsDate(true)
      }

      if (
        lectureData?.timetableAttached === undefined ||
        lectureData?.timetableAttached === null
      ) {
        setFileName('파일을 입력해주세요.')
      } else {
        const date = extractFileName(lectureData?.timetableAttached)
        setFileName(date)
      }
    }
  }, [lectureData])

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
        setValue('timetableAttached', file, { shouldDirty: true })
      }
    }
  }
  const handleButtonClick = e => {
    fileInputRef.current.click()
  }

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          if (
            data.lectureDetails.length > 1 &&
            data.lectureDetails[0].length > 9
          ) {
            let teachersIdArray
            if (dirtyFields.teachersId) {
              teachersIdArray = data.teachersId
                .split(',')
                .filter(Boolean)
                .map(Number)
            }
            const result = await editLectures({
              variables: {
                editLecturesId: parseInt(lectureId),
                campus: data.campus,
                temporaryName: data.temporaryName,
                subDiv: data.subDiv,
                teachersId: dirtyFields.teachersId && teachersIdArray,
                roomNum: data.roomNum,
                subjectId:
                  subjectSelectedData !== null
                    ? parseInt(subjectSelectedData.id)
                    : lectureData.subjectId,
                lecturePeriodStart: dirtyFields.lecturePeriodStart
                  ? new Date(data.lecturePeriodStart)
                  : new Date(parseInt(lectureData.lecturePeriodStart)),
                lecturePeriodEnd: dirtyFields.lecturePeriodEnd
                  ? new Date(data.lecturePeriodEnd)
                  : new Date(parseInt(lectureData.lecturePeriodEnd)),
                lectureDetails: dirtyFields.lectureDetails
                  ? data.lectureDetails
                  : lectureData.lectureDetails,
                lectureTime: dirtyFields.lectureTime
                  ? [lectureStartTime, lectureEndTime]
                  : lectureData.lectureTime,
                eduStatusReport: dirtyFields.eduStatusReport
                  ? data.eduStatusReport
                  : lectureData.eduStatusReport,
                approvedNum: dirtyFields.approvedNum
                  ? parseInt(data.approvedNum)
                  : lectureData.approvedNum,
                confirmedNum: dirtyFields.confirmedNum
                  ? parseInt(data.confirmedNum)
                  : lectureData.confirmedNum,
                sessionNum: dirtyFields.sessionNum
                  ? parseInt(data.sessionNum)
                  : lectureData.sessionNum,
                timetableAttached:
                  dirtyFields.timetableAttached && data.timetableAttached,
                lastModifiedTime: new Date(),
              },
            })

            const dirtyFieldsArray = [...Object.keys(dirtyFields)]
            // userLogs(
            //   `${lectureId} ${data.temporaryName} 강의 정보 수정`,
            //   `ok: ${result.data.editLectures.ok} / ${dirtyFieldsArray.join(
            //     ', ',
            //   )}`,
            // )

            if (!result.data.editLectures.ok) {
              throw new Error('과정 수정 실패')
            }
            alert('수정되었습니다.')
            router.push('/lecture')
          } else {
            reset({
              lecturePeriodStart: lectureData?.lecturePeriodStart,
              lecturePeriodEnd: lectureData?.lecturePeriodEnd,
              lectureDetails: lectureData?.lectureDetails,
            })
            setLectureStartDate(parseInt(lectureData?.lecturePeriodStart))
            setLectureEndDate(parseInt(lectureData?.lecturePeriodEnd))
            alert('개강일, 종강일, 요일을 다시 선택해주세요.')
          }
        } catch (error) {
          console.error('강의 수정 중 에러 발생:', error)
          alert('강의 수정 처리 중 오류가 발생했습니다.')
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  return (
    lectureData && (
      <>
        <MainWrap>
          <ConArea>
            <Breadcrumb rightArea={false} isFilter={false} />
            <DetailBox>
              <FormTopInfo item={lectureData} noti={true} time={true} />
              <DetailForm onSubmit={handleSubmit(onSubmit)}>
                <FlexBox>
                  <AreaBox style={{ minWidth: '20%' }}>
                    <Controller
                      control={control}
                      name="campus"
                      defaultValue={lectureData.campus}
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
                      defaultValue={lectureData.subDiv}
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
                      defaultValue={lectureData.temporaryName}
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
                      value={
                        subjectSelectedData?.subjectName !== undefined
                          ? String(subjectSelectedData?.subjectName)
                          : lectureData?.subject?.subjectName !== null
                            ? lectureData?.subject?.subjectName
                            : ''
                      }
                      label={
                        <FilterLabel>
                          과정 선택<span>*</span>
                        </FilterLabel>
                      }
                      defaultValue={lectureData.subjectId}
                      labelPlacement="outside"
                      className="max-w-full"
                      variant="bordered"
                      minRows={1}
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
                      defaultValue={lectureData.teachers}
                      rules={{
                        required: {
                          value: true,
                          message: '강사를 선택해주세요.',
                        },
                      }}
                      render={({ field }) => (
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
                      defaultValue={lectureData.roomNum}
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
                          defaultValue={lectureData.lectureTime[0]}
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
                          defaultValue={lectureData.lectureTime[1]}
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
                        defaultValue={lectureData.lecturePeriodStart}
                        rules={{
                          required: {
                            value: true,
                            message: '개강일을 선택해주세요.',
                          },
                        }}
                        render={({ field: startField }) => (
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
                            onChange={startDate => {
                              const adjustedDate = startDate
                                ? new Date(
                                    startDate.getFullYear(),
                                    startDate.getMonth(),
                                    startDate.getDate(),
                                    10,
                                    10,
                                    10,
                                  )
                                : null
                              startField.onChange(adjustedDate)
                              setLectureStartDate(adjustedDate)
                              setIsDate(true)
                              if (isDate) {
                                setChangeDate(true)
                              }
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
                        defaultValue={lectureData.lecturePeriodEnd}
                        rules={{
                          required: {
                            value: true,
                            message: '종강일을 선택해주세요.',
                          },
                        }}
                        render={({ field: endField }) => (
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
                            onChange={endDate => {
                              const adjustedEndDate = endDate
                                ? new Date(
                                    endDate.getFullYear(),
                                    endDate.getMonth(),
                                    endDate.getDate(),
                                    23,
                                    59,
                                    59,
                                  )
                                : null
                              endField.onChange(adjustedEndDate)
                              setLectureEndDate(adjustedEndDate)
                              setIsDate(true)
                              if (isDate) {
                                setChangeDate(true)
                              }
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
                        defaultValue={lectureData?.lectureDetails}
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
                        defaultValue={lectureData.eduStatusReport}
                        name="eduStatusReport"
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
                      defaultValue={lectureData.ApprovedNum}
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
                      defaultValue={lectureData.confirmedNum}
                      label={
                        <FilterLabel>
                          확정인원<span>*</span>
                        </FilterLabel>
                      }
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
                      defaultValue={String(lectureData.sessionNum)}
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
                        defaultValue={
                          lectureData.timetableAttached &&
                          extractFileName(lectureData.timetableAttached)
                        }
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

        <LectureDates
          isOpen={isOpen}
          onClose={onClose}
          setValue={setValue}
          datesSelected={datesSelected}
          startDate={lectureStartDate}
          endDate={lectureEndDate}
          isDate={isDate}
          changeDate={changeDate}
          setChangeDate={setChangeDate}
        />
      </>
    )
  )
}
LectureDetail.getLayout = page => <Layout>{page}</Layout>
