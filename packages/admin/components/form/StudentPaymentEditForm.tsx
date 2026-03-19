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
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import Layout from '@/pages/students/layout'
import SubjectModal from '@/components/modal/SubjectModal'
import { UPDATE_STUDENT_PAYMENT_MUTATION } from '@/graphql/mutations'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import { useRecoilValue } from 'recoil'
import { additionalAmountState, assignmentState } from '@/lib/recoilAtoms'
import PermissionManagerSelect from '@/components/common/select/PermissionManagerSelect'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import FormTopInfo from '@/components/common/FormTopInfo'
import TypeLink from '@/components/common/TypeLink'

const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
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
  align-items: flex-start;

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
const ToolTipBox = styled.i`
  color: ${({ theme }) => theme.colors.gray};
  vertical-align: -1px;
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`
const AreaSmallBox = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    width: 100% !important;
  }
`
const FlexCon = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  label {
    span {
      margin-right: 0;
      margin-top: 0.2rem;
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
  }
`
const InputText = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  width: 2.5rem;
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`

const extractNumber = inputString => {
  const regex = /(\d+(\.\d+)?)([^\d]+)/
  const match = inputString.match(regex)
  if (match) {
    const number = parseFloat(match[1])
    return String(number)
  }
}
const extractUnit = inputString => {
  const regex = /(\d+(\.\d+)?)([^\d]+)/
  const match = inputString.match(regex)
  if (match) {
    const unit = match[3].trim()
    return unit
  }
}

export default function StudentPaymentEditForm({
  studentData,
  studentSubjectData,
  studentPaymentData,
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenClick, setIsOpenClick] = useState(false)
  // const { userLogs } = useUserLogsMutation()
  const [updateStudentPayment] = useMutation(UPDATE_STUDENT_PAYMENT_MUTATION)
  const {
    register,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    handleSubmit,
    resetField,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      editStudentPaymentId: studentPaymentData?.id,
      seScore: studentPaymentData?.seScore,
      subject: studentSubjectData?.subjectName,
      tuitionFee: studentPaymentData?.tuitionFee,
      actualAmount: studentPaymentData?.actualAmount,
      unCollectedAmount: studentPaymentData?.unCollectedAmount,
      paymentDate: studentPaymentData?.paymentDate,
      processingManagerId: studentPaymentData?.processingManagerId,
      situationReport: studentPaymentData?.situationReport,
      subjectId: studentSubjectData?.id,
      amountReceived: studentPaymentData?.amountReceived,
      cashAmount: studentPaymentData?.cashAmount,
      cardAmount: studentPaymentData?.cardAmount,
      discountAmount: studentPaymentData?.discountAmount,
      dueDate: studentPaymentData?.dueDate,
      subDiv: studentPaymentData?.subDiv,
      discount: studentPaymentData?.discountAmount,
      discountUnit: '%',
      isWeekend: studentPaymentData?.isWeekend,
    },
  })
  const assignment = useRecoilValue(assignmentState)
  const additionalState = useRecoilValue(additionalAmountState)
  const [subjectSelectedData, setSubjectSelectedData] = useState(null)
  const [subjectSelected, setSubjectSelected] = useState(null)
  const [disCountType, setDisCountType] = useState('%')
  const [paymentDateSelect, setPaymentDateSelect] = useState(null)
  const [dueDateSelect, setDueDateSelect] = useState(null)
  const [sub, setSub] = useState('-')
  const [subjectManager, setSubjectManager] = useState('담당자 지정필요')
  const [weekendClass, setWeekendClass] = useState([])
  const [isDiscount, setIsDiscount] = useState(false)

  const {
    isOpen: sbjIsOpen,
    onOpen: sbjOpen,
    onClose: sbjClose,
  } = useDisclosure()
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  useEffect(() => {
    if (studentPaymentData) {
      setValue('tuitionFee', studentPaymentData.tuitionFee)
    }
    if (
      studentPaymentData?.processingManagerId === undefined ||
      studentPaymentData?.processingManagerId === null
    ) {
      setSubjectManager('담당자 지정필요')
    } else {
      setSubjectManager(String(studentPaymentData?.processingManagerId))
    }
    if (
      studentPaymentData?.subDiv === undefined ||
      studentPaymentData?.subDiv === null
    ) {
      setSub('-')
    } else {
      setSub(studentPaymentData?.subDiv)
    }
    if (
      studentPaymentData?.paymentDate === null ||
      studentPaymentData?.paymentDate === undefined
    ) {
      setPaymentDateSelect(null)
    } else {
      const date = parseInt(studentPaymentData?.paymentDate)
      setPaymentDateSelect(date)
    }
    if (
      studentPaymentData?.dueDate === null ||
      studentPaymentData?.dueDate === undefined
    ) {
      setDueDateSelect(null)
    } else {
      const date = parseInt(studentPaymentData?.dueDate)
      setDueDateSelect(date)
    }
    if (
      studentPaymentData?.isWeekend === null ||
      studentPaymentData?.isWeekend === undefined
    ) {
      setWeekendClass([])
    } else if (studentPaymentData?.isWeekend.includes('Y')) {
      setWeekendClass([studentPaymentData?.isWeekend])
      setValue('isWeekend', studentPaymentData?.isWeekend)
    }
    if (
      studentPaymentData?.discountAmount === null ||
      studentPaymentData?.discountAmount === '0'
    ) {
      setIsDiscount(false)
    } else {
      setIsDiscount(true)
    }
    if (
      studentPaymentData?.discountAmount === null ||
      studentPaymentData?.discountAmount === undefined
    ) {
      setDisCountType('%')
    } else {
      const discoutUnit =
        extractUnit(studentPaymentData?.discountAmount) === undefined
          ? '%'
          : extractUnit(studentPaymentData?.discountAmount)
      setDisCountType(discoutUnit)
      setValue('discountUnit', discoutUnit)
    }
    setSubjectSelected(studentSubjectData?.id)
  }, [router, studentPaymentData, studentSubjectData])

  const disCountPrice = (disCountType, tuitionFee) => {
    const discount = getValues('discount')
    if (disCountType === '%') {
      const disCountP = (tuitionFee * (100 - discount)) / 100
      return disCountP
    } else {
      const disCountP = tuitionFee - discount
      return disCountP
    }
  }

  const disCounCalculator = fee => {
    const price = disCountPrice(getValues('discountUnit'), fee)
    const total = price - parseInt(studentPaymentData?.amountReceived)

    if (price < 0) {
      setError('actualAmount', {
        type: 'custom',
        message: '할인 금액이 너무 많습니다.',
      })
      setValue('actualAmount', price, { shouldDirty: true })
      setValue('unCollectedAmount', total, { shouldDirty: true })
    } else {
      clearErrors('actualAmount')
      setValue('actualAmount', price, { shouldDirty: true })
      setValue('unCollectedAmount', total, { shouldDirty: true })
    }
  }

  useEffect(() => {
    if (subjectSelectedData !== null) {
      setSub(subjectSelectedData?.subDiv)
      setValue('tuitionFee', subjectSelectedData?.fee)
      setValue('actualAmount', subjectSelectedData?.fee)
      setValue('subDiv', subjectSelectedData?.subDiv)
      setValue('discount', 0)
      disCounCalculator(subjectSelectedData?.fee)
      setIsDiscount(false)
      setWeekendClass([])
      resetField('isWeekend')
    }
  }, [subjectSelectedData])

  const onSubmit = data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        if (data.actualAmount >= 0 && parseInt(data.unCollectedAmount) >= 0) {
          updateStudentPayment({
            variables: {
              editStudentPaymentId: parseInt(studentPaymentData.id),
              subjectId:
                subjectSelected === null
                  ? parseInt(studentPaymentData.subject.id)
                  : parseInt(subjectSelected),
              seScore: data.seScore === '' ? 0 : parseInt(data.seScore),
              tuitionFee: data.tuitionFee,
              processingManagerId: parseInt(subjectManager),
              cashAmount: studentPaymentData.cashAmount,
              cardAmount: studentPaymentData.cardAmount,
              situationReport: data.situationReport === '동의' ? true : false,
              paymentDate:
                data.paymentDate === null
                  ? null
                  : typeof data.paymentDate === 'string'
                    ? new Date(parseInt(data.paymentDate))
                    : new Date(data.paymentDate),
              actualAmount:
                data.actualAmount === null ? 0 : parseInt(data.actualAmount),
              discountAmount:
                data.discount === null
                  ? studentPaymentData?.discountAmount
                  : data.discount === '0' || data.discount === ''
                    ? '0'
                    : data.discount + disCountType,
              unCollectedAmount: parseInt(data.unCollectedAmount),
              amountReceived: studentPaymentData.amountReceived,
              subDiv: data.subDiv,
              dueDate:
                data.dueDate === null
                  ? null
                  : typeof data.dueDate === 'string'
                    ? new Date(parseInt(data.dueDate))
                    : new Date(data.dueDate),
              isWeekend: data.isWeekend === undefined ? 'N' : data.isWeekend,
              lastModifiedTime: new Date(),
            },
            onCompleted: result => {
              const dirtyFieldsArray = [...Object.keys(dirtyFields)]
              // userLogs(
              //   `${studentData.name} 수강신청 수정`,
              //   `ok: ${result.editStudentPayment.ok} / ${dirtyFieldsArray.join(
              //     ', ',
              //   )}`,
              // )
              if (result.editStudentPayment.ok) {
                alert('수정되었습니다.')
                router.back()
              }
            },
          })
        } else {
          if (data.actualAmount < 0) {
            setError(
              'actualAmount',
              {
                type: 'custom',
                message: '실 수강료가 0보다 작습니다.',
              },
              { shouldFocus: true },
            )
          }
          if (parseInt(data.unCollectedAmount) < 0) {
            setError(
              'unCollectedAmount',
              {
                type: 'custom',
                message: '수납액이 더 많습니다.',
              },
              { shouldFocus: true },
            )
          }
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const feeFormet = fee => {
    if (fee !== null && fee !== undefined) {
      const result = fee
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
      return result
    }
  }

  const handleDisCountChange = e => {
    setDisCountType(e.target.value)
    if (subjectSelectedData !== null) {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = subjectSelectedData?.fee * additionalState.basic
      } else {
        fee = subjectSelectedData?.fee
      }
      disCounCalculator(fee)
    } else {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = studentSubjectData?.fee * additionalState.basic
      } else {
        fee = studentSubjectData?.fee
      }
      disCounCalculator(fee)
    }
  }

  const discountChange = value => {
    if (value === '' || value === '0') {
      setIsDiscount(false)
    } else {
      setIsDiscount(true)
    }

    if (value === '' || value < 0) {
      setValue('discount', 0)
    } else {
      setValue('discount', parseInt(value))
    }
    if (subjectSelectedData !== null) {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = subjectSelectedData?.fee * additionalState.basic
      } else {
        fee = subjectSelectedData?.fee
      }
      disCounCalculator(fee)
    } else {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = studentSubjectData?.fee * additionalState.basic
      } else {
        fee = studentSubjectData?.fee
      }
      disCounCalculator(fee)
    }
  }

  const discountTotal = value => {
    if (subjectSelectedData !== null) {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = subjectSelectedData?.fee * additionalState.basic
      } else {
        fee = subjectSelectedData?.fee
      }
      const discountPrice = fee - parseInt(value)
      setValue('discount', discountPrice)
      setDisCountType('원')
      setValue('discountUnit', '원')
      disCounCalculator(fee)
    } else {
      let fee
      if (weekendClass[0] === 'Y') {
        fee = studentSubjectData?.fee * additionalState.basic
      } else {
        fee = studentSubjectData?.fee
      }
      const discountPrice = fee - parseInt(value)
      setValue('discount', discountPrice)
      setDisCountType('원')
      setValue('discountUnit', '원')
      disCounCalculator(fee)
    }
  }

  const handleSubManagerChange = e => {
    setSubjectManager(e.target.value)
  }

  const clickSubject = () => {
    if (studentData.lectureAssignment) {
      alert('과정 변경이 불가능합니다.')
    } else {
      sbjOpen()
    }
  }
  const handleSubChange = e => {
    setSub(e.target.value)
    setValue('subDiv', e.target.value)
  }

  const handleCheckboxChange = value => {
    setValue('isWeekend', value[0])
    setWeekendClass(value)
    if (value[0] === 'Y') {
      if (subjectSelectedData !== null) {
        setValue(
          'actualAmount',
          subjectSelectedData?.fee * additionalState.basic,
        )
        setValue('tuitionFee', subjectSelectedData?.fee * additionalState.basic)
        disCounCalculator(subjectSelectedData?.fee * additionalState.basic)
      } else {
        setValue(
          'actualAmount',
          studentSubjectData?.fee * additionalState.basic,
        )
        setValue('tuitionFee', studentSubjectData?.fee * additionalState.basic)
        disCounCalculator(studentSubjectData?.fee * additionalState.basic)
      }
    } else {
      if (subjectSelectedData !== null) {
        setValue('actualAmount', subjectSelectedData?.fee)
        setValue('tuitionFee', subjectSelectedData?.fee)
        disCounCalculator(subjectSelectedData?.fee)
      } else {
        setValue('actualAmount', studentSubjectData?.fee)
        setValue('tuitionFee', studentSubjectData?.fee)
        disCounCalculator(studentSubjectData?.fee)
      }
    }
  }

  return (
    <>
      {studentPaymentData !== null && studentSubjectData !== null && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DetailBox>
            <FormTopInfo item={studentPaymentData} noti={true} time={true} />
            <DetailDiv>
              <AreaTitle>
                <h4>수강료 정보</h4>
              </AreaTitle>
              <FlexBox>
                <AreaSmallBox style={{ minWidth: '20%' }}>
                  <Input
                    readOnly
                    labelPlacement="outside"
                    placeholder="과정코드"
                    value={
                      subjectSelectedData?.subjectCode !== undefined
                        ? String(subjectSelectedData?.subjectCode)
                        : studentSubjectData?.subjectCode !== null
                          ? studentSubjectData?.subjectCode
                          : ''
                    }
                    variant="faded"
                    radius="md"
                    type="text"
                    label="과정코드"
                    className="w-full"
                  />
                </AreaSmallBox>
                <AreaBox>
                  <Textarea
                    readOnly
                    value={
                      subjectSelectedData?.subjectName !== undefined
                        ? String(subjectSelectedData?.subjectName)
                        : studentSubjectData?.subjectName !== null
                          ? studentSubjectData?.subjectName
                          : ''
                    }
                    label={
                      <FilterLabel>
                        과정 선택<span>*</span>
                      </FilterLabel>
                    }
                    labelPlacement="outside"
                    className="max-w-full"
                    variant={
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? 'bordered'
                        : 'faded'
                    }
                    minRows={1}
                    onClick={() =>
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? clickSubject()
                        : null
                    }
                    {...register('subject', {
                      required: {
                        value: true,
                        message: '수강 과정을 선택해주세요.',
                      },
                    })}
                  />
                  {errors.subject && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.subject.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaSmallBox>
                  <div>
                    <FlexCon>
                      <Controller
                        control={control}
                        name="isWeekend"
                        render={({ field, fieldState }) => (
                          <CheckboxGroup
                            isDisabled={isDiscount ? true : false}
                            label={
                              <FilterLabel>
                                주말
                                <ToolTipBox>
                                  <Tooltip
                                    content={'실 수강료의 20%만큼 가산됩니다.'}
                                    placement="bottom"
                                    isOpen={isOpen}
                                    onOpenChange={open => setIsOpen(open)}
                                  >
                                    <i
                                      className="xi-help"
                                      onClick={() => {
                                        setIsOpenClick(!isOpenClick)
                                        setIsOpen(!isOpenClick)
                                      }}
                                    />
                                  </Tooltip>
                                </ToolTipBox>
                              </FilterLabel>
                            }
                            value={weekendClass}
                            onValueChange={handleCheckboxChange}
                            classNames={{
                              wrapper: 'items-center',
                              label: 'text-[0.875rem] text-black',
                            }}
                          >
                            <Checkbox value="Y"></Checkbox>
                          </CheckboxGroup>
                        )}
                      />
                    </FlexCon>
                  </div>
                  <div>
                    <RadioBox>
                      <Controller
                        control={control}
                        name="situationReport"
                        render={({ field }) => (
                          <RadioGroup
                            label={<FilterLabel>교육상황보고여부</FilterLabel>}
                            orientation="horizontal"
                            className="gap-[0.65rem]"
                            classNames={{ wrapper: 'z-0' }}
                            defaultValue={
                              studentPaymentData?.situationReport === null
                                ? '비동의'
                                : studentPaymentData?.situationReport
                                  ? '동의'
                                  : '비동의'
                            }
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                          >
                            <Radio key={'동의'} value={'동의'}>
                              동의
                            </Radio>
                            <Radio key={'비동의'} value={'비동의'}>
                              비동의
                            </Radio>
                          </RadioGroup>
                        )}
                      />
                    </RadioBox>
                  </div>
                </AreaSmallBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Input
                    labelPlacement="outside"
                    placeholder="선발 평가 점수"
                    variant="bordered"
                    radius="md"
                    type="number"
                    defaultValue={String(studentPaymentData?.seScore)}
                    endContent={<InputText>/ 100</InputText>}
                    label={
                      <FilterLabel>
                        선발 평가 점수
                        {subjectSelectedData === null
                          ? sub === '국가기간' && <span>*</span>
                          : subjectSelectedData.subDiv === '국가기간' && (
                              <span>*</span>
                            )}
                      </FilterLabel>
                    }
                    className="w-full"
                    {...register('seScore', {
                      required: {
                        value:
                          subjectSelectedData === null
                            ? sub === '국가기간'
                              ? true
                              : false
                            : subjectSelectedData.subDiv === '국가기간'
                              ? true
                              : false,
                        message: '선발 평가 점수를 작성해주세요.',
                      },
                      min: {
                        value: 0,
                        message: '0 이상의 숫자를 작성해주세요.',
                      },
                      max: {
                        value: 100,
                        message: '100 이하의 숫자를 작성해주세요.',
                      },
                    })}
                  />
                  {errors.seScore && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.seScore.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Controller
                    control={control}
                    name="subDiv"
                    defaultValue={studentPaymentData?.subDiv}
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
                <AreaBox>
                  <Input
                    readOnly
                    labelPlacement="outside"
                    placeholder="수강료"
                    value={
                      subjectSelectedData
                        ? weekendClass[0] === 'Y'
                          ? feeFormet(
                              subjectSelectedData?.fee * additionalState.basic,
                            )
                          : feeFormet(subjectSelectedData?.fee)
                        : studentPaymentData !== null
                          ? weekendClass[0] === 'Y'
                            ? feeFormet(
                                studentSubjectData?.fee * additionalState.basic,
                              )
                            : feeFormet(studentSubjectData?.fee)
                          : ''
                    }
                    variant="faded"
                    radius="md"
                    type="text"
                    label="수강료"
                    className="w-full"
                    {...register('tuitionFee')}
                  />
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Input
                    isReadOnly={
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? false
                        : true
                    }
                    labelPlacement="outside"
                    placeholder="할인"
                    variant={
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? 'bordered'
                        : 'faded'
                    }
                    radius="md"
                    type="number"
                    label="할인"
                    defaultValue={
                      studentPaymentData?.discountAmount !== null
                        ? extractNumber(studentPaymentData?.discountAmount)
                        : ''
                    }
                    onValueChange={e => {
                      discountChange(e)
                    }}
                    {...register('discount')}
                    endContent={
                      <Controller
                        control={control}
                        name="discountUnit"
                        render={({ field, fieldState }) => (
                          <Select
                            isDisabled={
                              studentPaymentData.lectureAssignment ===
                              assignment.unassigned
                                ? false
                                : true
                            }
                            labelPlacement="outside"
                            label={<span style={{ display: 'none' }}></span>}
                            placeholder=" "
                            variant={'underlined'}
                            defaultValue={extractUnit(
                              studentPaymentData?.discountAmount !== null
                                ? studentPaymentData?.discountAmount
                                : '%',
                            )}
                            selectedKeys={[disCountType]}
                            classNames={{
                              base: 'w-[6rem]',
                              label: 'hidden',
                              trigger: 'h-unit-8 min-h-unit-8',
                              value: 'text-center',
                            }}
                            onChange={value => {
                              if (value.target.value !== '') {
                                field.onChange(value)
                                handleDisCountChange(value)
                              }
                            }}
                          >
                            <SelectItem key={'%'} value={'%'}>
                              %
                            </SelectItem>
                            <SelectItem key={'원'} value={'원'}>
                              원
                            </SelectItem>
                          </Select>
                        )}
                      />
                    }
                  />
                </AreaBox>
                <AreaBox>
                  <Input
                    isReadOnly={
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? false
                        : true
                    }
                    labelPlacement="outside"
                    placeholder="할인된 수강료"
                    variant={
                      studentPaymentData.lectureAssignment ===
                      assignment.unassigned
                        ? 'bordered'
                        : 'faded'
                    }
                    radius="md"
                    type="number"
                    label={
                      <FilterLabel>
                        할인된 수강료 <span>(실 결제금액)</span>
                      </FilterLabel>
                    }
                    defaultValue={
                      studentPaymentData?.actualAmount !== undefined
                        ? studentPaymentData?.actualAmount
                        : ''
                    }
                    onValueChange={value => {
                      if (value !== '') {
                        discountTotal(value)
                      } else {
                        discountTotal(0)
                      }
                    }}
                    onChange={e => {
                      register('actualAmount').onChange(e)
                    }}
                    {...register('actualAmount')}
                  />
                  {errors.actualAmount && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.actualAmount.message)}
                    </p>
                  )}
                </AreaBox>
                <AreaBox>
                  <Input
                    isReadOnly
                    labelPlacement="outside"
                    placeholder="수납액"
                    variant="faded"
                    radius="md"
                    type="text"
                    label="수납액"
                    defaultValue={
                      studentPaymentData?.amountReceived === null
                        ? '0'
                        : feeFormet(studentPaymentData?.amountReceived)
                    }
                    {...register('amountReceived')}
                  />
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <Input
                    isReadOnly
                    labelPlacement="outside"
                    placeholder="현금결제액"
                    variant="faded"
                    radius="md"
                    type="text"
                    label="현금결제액"
                    defaultValue={
                      studentPaymentData?.cashAmount === null
                        ? '0'
                        : feeFormet(studentPaymentData?.cashAmount)
                    }
                    {...register('cashAmount')}
                  />
                </AreaBox>
                <AreaBox>
                  <Input
                    isReadOnly
                    labelPlacement="outside"
                    placeholder="카드 결제액"
                    variant="faded"
                    radius="md"
                    type="text"
                    label="카드 결제액"
                    defaultValue={
                      studentPaymentData?.cardAmount === null
                        ? '0'
                        : feeFormet(studentPaymentData?.cardAmount)
                    }
                    {...register('cardAmount')}
                  />
                </AreaBox>
                <AreaBox>
                  <Input
                    isReadOnly
                    labelPlacement="outside"
                    placeholder="미수납액"
                    variant="faded"
                    radius="md"
                    type="text"
                    label="미수납액"
                    defaultValue={
                      studentPaymentData?.unCollectedAmount === null
                        ? '0'
                        : studentPaymentData?.unCollectedAmount
                    }
                    {...register('unCollectedAmount')}
                  />
                  {errors.unCollectedAmount && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.unCollectedAmount.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <DatePickerBox>
                    <Controller
                      control={control}
                      name="paymentDate"
                      defaultValue={studentPaymentData?.paymentDate}
                      rules={{
                        required: {
                          value: true,
                          message: '결제예정일을 선택해주세요.',
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
                            paymentDateSelect === null
                              ? null
                              : new Date(paymentDateSelect)
                          }
                          placeholderText="날짜를 선택해주세요."
                          isClearable
                          onChange={date => {
                            field.onChange(date)
                            setPaymentDateSelect(date)
                          }}
                          dateFormat="yyyy/MM/dd"
                          onChangeRaw={e => e.preventDefault()}
                          onFocus={e => e.target.blur()}
                          customInput={
                            <Input
                              ref={field.ref}
                              label={
                                <FilterLabel>
                                  결제일자<span>*</span>
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
                    {errors.paymentDate && (
                      <p className="px-2 pt-2 text-xs text-red">
                        {String(errors.paymentDate.message)}
                      </p>
                    )}
                  </DatePickerBox>
                </AreaBox>
                <AreaBox>
                  <DatePickerBox>
                    <Controller
                      control={control}
                      name="dueDate"
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
                            dueDateSelect === null
                              ? null
                              : new Date(dueDateSelect)
                          }
                          placeholderText="날짜를 선택해주세요."
                          isClearable
                          onChange={date => {
                            field.onChange(date)
                            setDueDateSelect(date)
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
                </AreaBox>
                <AreaBox>
                  <Controller
                    control={control}
                    name="processingManagerId"
                    defaultValue={studentPaymentData?.processingManagerId}
                    rules={{
                      required: {
                        value: true,
                        message: '영업담당자를 선택해주세요.',
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
                        <PermissionManagerSelect
                          selectedKey={subjectManager}
                          field={field}
                          label={
                            <FilterLabel>
                              영업담당자<span>*</span>
                            </FilterLabel>
                          }
                          defaultValue={studentPaymentData?.processingManagerId}
                          handleChange={handleSubManagerChange}
                          optionDefault={{
                            id: '담당자 지정필요',
                            mUsername: '담당자 지정필요',
                          }}
                          parmissionName={'상담관리접근'}
                          isId={true}
                        />
                      </Suspense>
                    )}
                  />
                  {errors.processingManagerId && (
                    <p className="px-2 pt-2 text-xs text-red">
                      {String(errors.processingManagerId.message)}
                    </p>
                  )}
                </AreaBox>
              </FlexBox>
            </DetailDiv>
          </DetailBox>
          <DetailBox>
            <DetailDiv>
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
            </DetailDiv>
          </DetailBox>
        </form>
      )}
      <SubjectModal
        subjectSelected={subjectSelected}
        setSubjectSelected={setSubjectSelected}
        setSubjectSelectedData={setSubjectSelectedData}
        setSub={setSub}
        sbjIsOpen={sbjIsOpen}
        sbjClose={sbjClose}
        setValue={setValue}
        radio={true}
      />
    </>
  )
}
StudentPaymentEditForm.getLayout = page => <Layout>{page}</Layout>
