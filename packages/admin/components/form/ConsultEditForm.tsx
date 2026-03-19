import { Suspense, useEffect, useState } from 'react'
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
  Chip,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { progressStatusState, gradeState } from '@/lib/recoilAtoms'
import { useRecoilValue } from 'recoil'
import { useMutation } from '@apollo/client'
import {
  DELETE_STUDENT_STATE_MUTATION,
  UPDATE_STUDENT_STATE_MUTATION,
} from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
import { SEE_STUDENT_STATE_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import AdviceTypeModal from '@/components/modal/AdviceTypeModal'
import SubjectModal from '@/components/modal/SubjectModal'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import PermissionManagerSelect from '@/components/common/select/PermissionManagerSelect'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import TypeLink from '@/components/common/TypeLink'
import { demoAlert, IS_DEMO, withDemoGuard } from '@/utils/demo'

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
const DetailForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const ColFlexBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
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
  z-index: 1;
  width: 100%;
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
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

export default function ConsultEditForm({ mGrade, supervisor, studentState }) {
  const router = useRouter()
  const grade = useRecoilValue(gradeState)
  const [updateStudent] = useMutation(UPDATE_STUDENT_STATE_MUTATION)
  const [deleteStudent] = useMutation(DELETE_STUDENT_STATE_MUTATION)
  // const { userLogs } = useUserLogsMutation()
  const progressStatus = useRecoilValue(progressStatusState)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: sbjIsOpen,
    onOpen: sbjOpen,
    onClose: sbjClose,
  } = useDisclosure()
  const [subjectSelected, setSubjectSelected] = useState([])
  const [adviceTypeSelected, setAdviceTypeSelected] = useState([])
  const [adviceTypeSelectedName, setAdviceTypeSelectedName] = useState([])
  const [stVisitDate, setStVisitDate] = useState(null)
  const [expEnrollDate, setExpEnrollDate] = useState(null)
  const [receipt, setReceipt] = useState('-')
  const [sub, setSub] = useState('-')
  const [manager, setManager] = useState('담당자 지정필요')
  const studentAdvice = studentState?.adviceTypes?.map(obj => obj.type) || []
  const addArr = [...studentAdvice]
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  const { register, control, setValue, handleSubmit, formState } = useForm({
    defaultValues: {
      updateStudentStateId: studentState?.id,
      campus: studentState?.campus,
      category: studentState?.category,
      stName: studentState?.stName,
      phoneNum1: studentState?.phoneNum1,
      phoneNum2: studentState?.phoneNum2,
      phoneNum3: studentState?.phoneNum3,
      subject: studentState?.subject,
      detail: studentState?.detail,
      progress: studentState?.progress,
      stEmail: studentState?.stEmail,
      stAddr: studentState?.stAddr,
      subDiv: studentState?.subDiv,
      stVisit: studentState?.stVisit,
      adviceTypes: studentState?.adviceTypes,
      expEnrollDate: studentState?.expEnrollDate,
      perchase: studentState?.perchase,
      pic: studentState?.pic,
      receiptDiv: studentState?.receiptDiv,
    },
  })
  const { isDirty, dirtyFields, errors } = formState

  useEffect(() => {
    if (studentState?.subject?.length === 0) {
      setSubjectSelected([])
    } else {
      setSubjectSelected(studentState?.subject)
    }
    if (
      studentState?.receiptDiv === '' ||
      studentState?.receiptDiv === undefined
    ) {
      setReceipt('-')
    } else {
      setReceipt(studentState?.receiptDiv)
    }
    if (studentState?.subDiv === null || studentState?.subDiv === undefined) {
      setSub('-')
    } else {
      setSub(studentState?.subDiv)
    }
    if (studentState?.pic === undefined || studentState?.pic === null) {
      setManager('담당자 지정필요')
    } else {
      setManager(studentState?.pic)
    }
    if (studentState?.stVisit === null || studentState?.stVisit === undefined) {
      setStVisitDate(null)
    } else {
      const date = parseInt(studentState?.stVisit)
      setStVisitDate(date)
    }
    if (
      studentState?.expEnrollDate === null ||
      studentState?.expEnrollDate === undefined
    ) {
      setExpEnrollDate(null)
    } else {
      const date = parseInt(studentState?.expEnrollDate)
      setExpEnrollDate(date)
    }
    if (studentState?.adviceTypes) {
      const name = studentState?.adviceTypes.map(item => item.type)
      const id = studentState?.adviceTypes.map(item => item.id)
      setAdviceTypeSelected(id)
      setAdviceTypeSelectedName(name)
    }
  }, [studentState])

  const onSubmit = data => {
    if (IS_DEMO) {
      demoAlert()
      return
    }

    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        updateStudent({
          variables: {
            updateStudentStateId: studentState.id,
            campus: studentState.campus,
            stName: data.stName.trim(),
            category: studentState.category,
            phoneNum1: data.phoneNum1.trim(),
            phoneNum2: data.phoneNum2 === null ? null : data.phoneNum2.trim(),
            phoneNum3: data.phoneNum3 === null ? null : data.phoneNum3.trim(),
            adviceTypes: data.adviceTypes === '' ? [] : adviceTypeSelected,
            subject:
              data.subject === '' ? studentState.subject : subjectSelected,
            detail: data.detail === null ? null : data.detail.trim(),
            progress: data.progress,
            stEmail: data.stEmail === null ? null : data.stEmail.trim(),
            stAddr: studentState.stAddr,
            subDiv: data.subDiv,
            stVisit:
              data.stVisit === null
                ? null
                : typeof data.stVisit === 'string'
                  ? new Date(parseInt(data.stVisit))
                  : new Date(data.stVisit),
            expEnrollDate:
              data.expEnrollDate === null
                ? null
                : typeof data.expEnrollDate === 'string'
                  ? new Date(parseInt(data.expEnrollDate))
                  : new Date(data.expEnrollDate),
            pic: data.pic,
            receiptDiv: data.receiptDiv,
            lastModifiedTime: new Date(),
          },
          onCompleted: result => {
            const dirtyFieldsArray = [...Object.keys(dirtyFields)]
            // userLogs(
            //   `${studentState.stName}의 상담 수정`,
            //   ` ok: ${result.updateStudentState.ok} / ${dirtyFieldsArray.join(
            //     ', ',
            //   )}`,
            // )
            if (result.updateStudentState.ok) {
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

  const onDelete = data => {
    const isDelete = confirm('상담카드를 삭제시겠습니까?')
    if (isDelete) {
      deleteStudent({
        variables: {
          deleteStudentStateId: data,
        },
        refetchQueries: [
          {
            query: SEE_STUDENT_STATE_QUERY,
            variables: { page: 1, limit: 10 },
          },
        ],
        onCompleted: result => {
          // userLogs(
          //   `ID : ${studentState.name} 상담카드 삭제`,
          //   `ok: ${result.deleteStudentState.ok}`,
          // )
          if (result.deleteStudentState.ok) {
            alert('상담카드가 삭제되었습니다.')
            router.back()
          }
        },
      })
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
  const handleReceiptChange = e => {
    setReceipt(e.target.value)
  }
  const handleSubChange = e => {
    setSub(e.target.value)
  }
  const handleManagerChange = e => {
    setManager(e.target.value)
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="이름"
              variant="bordered"
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  이름<span>*</span>
                </FilterLabel>
              }
              defaultValue={studentState?.stName}
              onChange={e => {
                register('stName').onChange(e)
              }}
              className="w-full"
              {...register('stName', {
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
            {errors.stName && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.stName.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="이메일"
              variant="bordered"
              radius="md"
              type="text"
              label="이메일"
              defaultValue={studentState?.stEmail || null}
              onChange={e => {
                register('stEmail').onChange(e)
              }}
              className="w-full"
              {...register('stEmail', {
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: '유효하지 않은 이메일 형식입니다.',
                },
              })}
            />
            {errors.stEmail && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.stEmail.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="'-'없이 작성해주세요"
              variant="bordered"
              radius="md"
              type="text"
              label={
                <FilterLabel>
                  휴대폰번호<span>*</span>
                </FilterLabel>
              }
              maxLength={11}
              defaultValue={studentState?.phoneNum1 || null}
              onChange={e => {
                register('phoneNum1').onChange(e)
              }}
              className="w-full"
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
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="'-'없이 작성해주세요"
              variant="bordered"
              radius="md"
              type="text"
              label="기타번호1"
              defaultValue={studentState?.phoneNum2 || null}
              onChange={e => {
                register('phoneNum2').onChange(e)
              }}
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
          <AreaBox>
            <Input
              labelPlacement="outside"
              placeholder="'-'없이 작성해주세요"
              variant="bordered"
              radius="md"
              type="text"
              label="기타번호2"
              defaultValue={studentState?.phoneNum3 || null}
              onChange={e => {
                register('phoneNum3').onChange(e)
              }}
              className="w-full"
              maxLength={12}
              {...register('phoneNum3', {
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
            {errors.phoneNum3 && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.phoneNum3.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <AreaBox>
          <Controller
            control={control}
            name="adviceTypes"
            rules={{
              required: {
                value: true,
                message: '상담 분야를 최소 1개 이상 선택해주세요.',
              },
            }}
            defaultValue={addArr}
            render={({ field }) => (
              <>
                <Textarea
                  readOnly
                  value={String(adviceTypeSelectedName)}
                  label={
                    <FilterLabel>
                      상담 분야<span>*</span>{' '}
                      <span className="multi">(중복가능)</span>
                    </FilterLabel>
                  }
                  labelPlacement="outside"
                  className="max-w-full"
                  variant="bordered"
                  minRows={1}
                  onClick={onOpen}
                  {...register('adviceTypes')}
                />
                <Suspense
                  fallback={
                    <LodingDiv>
                      <i className="xi-spinner-2" />
                    </LodingDiv>
                  }
                >
                  <AdviceTypeModal
                    adviceTypeSelected={adviceTypeSelected}
                    setAdviceTypeSelected={setAdviceTypeSelected}
                    setAdviceTypeSelectedName={setAdviceTypeSelectedName}
                    isOpen={isOpen}
                    onClose={onClose}
                    setValue={setValue}
                  />
                </Suspense>
              </>
            )}
          />
          {errors.adviceTypes && (
            <p className="px-2 pt-2 text-xs text-red">
              {String(errors.adviceTypes.message)}
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
              typeLink={'adviceType'}
              typeName={'상담분야'}
              permissionName={'상담분야'}
            />
          </Suspense>
        </AreaBox>
        <AreaBox>
          <Textarea
            readOnly
            label={
              <FilterLabel>
                상담 과정 선택 <span className="multi">(중복가능)</span>
              </FilterLabel>
            }
            labelPlacement="outside"
            className="max-w-full"
            variant="bordered"
            minRows={1}
            defaultValue={studentState?.subject}
            onClick={sbjOpen}
            {...register('subject')}
          />
        </AreaBox>
        <FlexBox>
          <AreaBox>
            <Controller
              control={control}
              name="receiptDiv"
              defaultValue={studentState?.receiptDiv}
              render={({ field }) => (
                <AdviceSelect
                  defaultValue={studentState?.receiptDiv}
                  selectedKey={receipt}
                  field={field}
                  label={'접수구분'}
                  handleChange={handleReceiptChange}
                  optionDefault={{
                    type: '-',
                  }}
                  category={'접수구분'}
                />
              )}
            />
            <Suspense
              fallback={
                <LodingDiv>
                  <i className="xi-spinner-2" />
                </LodingDiv>
              }
            >
              <TypeLink
                typeLink={'receipt'}
                typeName={'접수구분'}
                permissionName={'접수구분'}
              />
            </Suspense>
          </AreaBox>
          <AreaBox>
            <Controller
              control={control}
              name="subDiv"
              defaultValue={studentState?.subDiv}
              render={({ field }) => (
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
          <Controller
            control={control}
            name="pic"
            defaultValue={studentState?.pic}
            render={({ field }) => (
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <PermissionManagerSelect
                  disabled={!supervisor}
                  selectedKey={manager}
                  field={field}
                  label={'담당자'}
                  defaultValue={studentState ? studentState.pic : null}
                  handleChange={handleManagerChange}
                  optionDefault={{
                    mUsername: '담당자 지정필요',
                    mUserId: '담당자 지정필요',
                  }}
                  parmissionName={'상담관리접근'}
                  isId={false}
                />
              </Suspense>
            )}
          />
          <Input
            isReadOnly
            labelPlacement="outside"
            placeholder="등록일시"
            variant="faded"
            radius="md"
            type="text"
            label="등록일시"
            value={formatDate(studentState?.createdAt) || ''}
            startContent={<i className="xi-calendar" />}
            className="w-full"
          />
        </FlexBox>
        <RadioBox>
          <Controller
            control={control}
            name="progress"
            defaultValue={studentState?.progress}
            render={({ field, fieldState }) => (
              <RadioGroup
                label={<FilterLabel>진행상태</FilterLabel>}
                orientation="horizontal"
                className="gap-1"
                classNames={{ wrapper: 'z-0' }}
                defaultValue={String(studentState?.progress)}
                onValueChange={value => {
                  field.onChange(parseInt(value))
                }}
              >
                {Object.entries(progressStatus).map(([key, value]) => (
                  <Radio
                    key={key}
                    value={key}
                    isDisabled={key === '999' ? true : false}
                  >
                    {value.name}
                  </Radio>
                ))}
              </RadioGroup>
            )}
          />
        </RadioBox>
        <FlexBox>
          <DatePickerBox>
            <Controller
              control={control}
              name="stVisit"
              defaultValue={studentState?.stVisit}
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
                  selected={stVisitDate === null ? null : new Date(stVisitDate)}
                  placeholderText="날짜를 선택해주세요."
                  isClearable
                  onChange={date => {
                    field.onChange(date)
                    setStVisitDate(date)
                  }}
                  onChangeRaw={e => e.preventDefault()}
                  onFocus={e => e.target.blur()}
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                  customInput={
                    <Input
                      label="상담예정일"
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
          <DatePickerBox>
            <Controller
              control={control}
              name="expEnrollDate"
              defaultValue={studentState?.expEnrollDate}
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
                    expEnrollDate === null ? null : new Date(expEnrollDate)
                  }
                  placeholderText="날짜를 선택해주세요."
                  isClearable
                  onChange={date => {
                    field.onChange(date)
                    setExpEnrollDate(date)
                  }}
                  dateFormat="yyyy/MM/dd"
                  onChangeRaw={e => e.preventDefault()}
                  onFocus={e => e.target.blur()}
                  customInput={
                    <Input
                      label="수강예정일"
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
        </FlexBox>
        {(studentState?.classMethod.includes('전화상담') ||
          studentState?.classMethod.includes('방문상담')) && (
          <FlexBox>
            {studentState?.classMethod.includes('전화상담') && (
              <Chip variant="bordered" color="primary">
                &#128222; 전화상담 원해요.
              </Chip>
            )}
            {studentState?.classMethod.includes('방문상담') && (
              <Chip variant="bordered" color="primary">
                &#127939; 방문상담 원해요.
              </Chip>
            )}
          </FlexBox>
        )}
        <FlexBox>
          <Textarea
            label="상담 내용"
            labelPlacement="outside"
            className="max-w-full"
            variant="bordered"
            minRows={5}
            defaultValue={studentState?.detail || ''}
            onChange={e => {
              register('detail').onChange(e)
            }}
            {...register('detail')}
          />
        </FlexBox>
        <BtnBox>
          <Button type="submit" color="primary" className="w-full text-white">
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
          {mGrade <= grade.subMaster && (
            <Button
              className="w-full text-white bg-accent"
              onClick={withDemoGuard(() => onDelete(studentState.id))}
            >
              삭제
            </Button>
          )}
        </BtnBox>
      </DetailForm>
      <SubjectModal
        subjectSelected={subjectSelected}
        setSubjectSelected={setSubjectSelected}
        sbjIsOpen={sbjIsOpen}
        sbjClose={sbjClose}
        setValue={setValue}
      />
    </>
  )
}
