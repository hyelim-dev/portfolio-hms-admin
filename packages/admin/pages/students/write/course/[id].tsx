import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
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
import { useRecoilValue } from 'recoil'
import {
  additionalAmountState,
  assignmentState,
  completionStatus,
  employmentStatus,
  gradeState,
} from '@/lib/recoilAtoms'
import SubjectModal from '@/components/modal/SubjectModal'
import {
  CREATE_STUDENT_PAYMENT_MUTATION,
  SEARCH_STUDENT_BASIC_MUTATION,
} from '@/graphql/mutations'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import useMmeQuery from '@/utils/mMe'
import FormTopInfo from '@/components/common/FormTopInfo'
import PermissionManagerSelect from '@/components/common/select/PermissionManagerSelect'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import TypeLink from '@/components/common/TypeLink'

const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
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
const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
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
const ToolTipBox = styled.i`
  color: ${({ theme }) => theme.colors.gray};
  vertical-align: -1px;
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
const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

export default function StudentsWriteCourse() {
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenClick, setIsOpenClick] = useState(false)
  const studentId = typeof router.query.id === 'string' ? router.query.id : null
  const [searchStudentBasic] = useMutation(SEARCH_STUDENT_BASIC_MUTATION)
  const [createStudentPayment] = useMutation(CREATE_STUDENT_PAYMENT_MUTATION)
  const {
    register,
    getValues,
    control,
    setError,
    setValue,
    handleSubmit,
    resetField,
    formState,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      editStudentPaymentId: studentId,
      seScore: null,
      subject: null,
      tuitionFee: null,
      actualAmount: null,
      unCollectedAmount: null,
      paymentDate: null,
      processingManagerId: null,
      situationReport: null,
      subjectId: null,
      amountReceived: null,
      cashAmount: null,
      cardAmount: null,
      discountAmount: null,
      dueDate: null,
      discount: 0,
      discountUnit: '%',
      subDiv: null,
      isWeekend: '',
    },
  })
  const { errors } = formState
  const {
    isOpen: sbjIsOpen,
    onOpen: sbjOpen,
    onClose: sbjClose,
  } = useDisclosure()
  const additionalState = useRecoilValue(additionalAmountState)
  const { unassigned } = useRecoilValue(assignmentState)
  const { notAttended } = useRecoilValue(completionStatus)
  const { unemployed } = useRecoilValue(employmentStatus)
  const [studentData, setStudentData] = useState(null)
  const [subjectSelectedData, setSubjectSelectedData] = useState(null)
  const [subjectSelected, setSubjectSelected] = useState(null)
  const [disCountType, setDisCountType] = useState('%')
  const [paymentDate, setPaymentDate] = useState(null)
  const [dueDate, setDueDate] = useState(null)
  const [sub, setSub] = useState('-')
  const [weekendClass, setWeekendClass] = useState([])
  const [isDiscount, setIsDiscount] = useState(false)
  const [subjectManager, setSubjectManager] = useState('담당자 지정필요')
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  useEffect(() => {
    searchStudentBasic({
      variables: {
        searchStudentId: parseInt(studentId),
      },
      onCompleted: data => {
        if (data.searchStudent.ok) {
          setStudentData(data.searchStudent.student[0])
        }
      },
    })
  }, [router])

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
    if (price < 0) {
      setError('actualAmount', {
        type: 'custom',
        message: '할인 금액이 너무 큽니다.',
      })
      setValue('actualAmount', price, { shouldDirty: true })
      setValue('unCollectedAmount', price, { shouldDirty: true })
    } else {
      setValue('actualAmount', price, { shouldDirty: true })
      setValue('unCollectedAmount', price, { shouldDirty: true })
    }
  }

  useEffect(() => {
    if (subjectSelectedData !== null) {
      setSub(subjectSelectedData?.subDiv)
      setValue('tuitionFee', subjectSelectedData?.fee)
      setValue('actualAmount', subjectSelectedData?.fee)
      setValue('subDiv', subjectSelectedData?.subDiv)
      setValue('unCollectedAmount', subjectSelectedData?.fee)
      resetField('discount')
      setIsDiscount(false)
      setWeekendClass([])
      resetField('isWeekend')
    }
  }, [subjectSelectedData])

  // const onSubmit = data => {
  //   if (data.actualAmount >= 0) {
  //     createStudentPayment({
  //       variables: {
  //         campus: '신촌',
  //         seScore:
  //           data.seScore === '' || data.seScore === null
  //             ? 0
  //             : parseInt(data.seScore),
  //         tuitionFee: parseInt(data.tuitionFee),
  //         studentId: parseInt(studentId),
  //         subjectId: parseInt(subjectSelected),
  //         processingManagerId: parseInt(data.processingManagerId),
  //         paymentDate: data.paymentDate,
  //         amountReceived: 0,
  //         situationReport: data.situationReport === '동의' ? true : false,
  //         actualAmount:
  //           data.actualAmount === null ? 0 : parseInt(data.actualAmount),
  //         discountAmount:
  //           data.discount === 0 ? null : data.discount + disCountType,
  //         unCollectedAmount:
  //           data.actualAmount === null ? 0 : parseInt(data.actualAmount),
  //         subDiv: data.subDiv,
  //         dueDate: data.dueDate === null ? null : data.dueDate,
  //         isWeekend: data.isWeekend === '' ? 'N' : data.isWeekend,
  //         lectureAssignment: unassigned,
  //         courseComplete: notAttended,
  //         employment: unemployed,
  //       },
  //       onCompleted: result => {
  //         if (result.createStudentPayment.ok) {
  //           // userLogs(`${studentData.name} 수강신청`)
  //           alert('등록되었습니다.')
  //           router.back()
  //         } else {
  //           alert(result.createStudentPayment.message)
  //         }
  //       },
  //     })
  //   } else {
  //     setError(
  //       'actualAmount',
  //       {
  //         type: 'custom',
  //         message: '실 수강료가 0보다 작습니다.',
  //       },
  //       { shouldFocus: true },
  //     )
  //   }
  // }
  const onSubmit = data => {
    if (data.actualAmount >= 0) {
      createStudentPayment({
        variables: {
          campus: '신촌',
          seScore:
            data.seScore === '' || data.seScore === null
              ? 0
              : parseInt(data.seScore),
          tuitionFee: parseInt(data.tuitionFee),
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectSelected),
          processingManagerId: parseInt(data.processingManagerId),
          paymentDate: data.paymentDate,
          amountReceived: 0,
          situationReport: data.situationReport === '동의' ? true : false,
          actualAmount:
            data.actualAmount === null ? 0 : parseInt(data.actualAmount),
          discountAmount:
            data.discount === 0 ? null : data.discount + disCountType,
          unCollectedAmount:
            data.actualAmount === null ? 0 : parseInt(data.actualAmount),
          subDiv: data.subDiv,
          dueDate: data.dueDate === null ? null : data.dueDate,
          isWeekend: data.isWeekend === '' ? 'N' : data.isWeekend,
          lectureAssignment: unassigned,
          courseComplete: notAttended,
          employment: unemployed,
        },

        refetchQueries: ['SeeStudent'], // 🔥 추가
        awaitRefetchQueries: true, // 🔥 추가

        onCompleted: result => {
          if (result.createStudentPayment.ok) {
            alert(result.createStudentPayment.message)
            router.back()
          } else {
            alert(result.createStudentPayment.message)
          }
        },
      })
    } else {
      setError(
        'actualAmount',
        {
          type: 'custom',
          message: '실 수강료가 0보다 작습니다.',
        },
        { shouldFocus: true },
      )
    }
  }
  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  const feeFormet = fee => {
    const result = fee
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
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
    }
  }
  const handleSubChange = e => {
    setSub(e.target.value)
    setValue('subDiv', e.target.value)
  }
  const handleSubManagerChange = e => {
    setSubjectManager(e.target.value)
  }

  const handleCheckboxChange = value => {
    setValue('isWeekend', value[0])
    setWeekendClass(value)
    if (value[0] === 'Y') {
      setValue('actualAmount', subjectSelectedData?.fee * additionalState.basic)
      setValue('tuitionFee', subjectSelectedData?.fee * additionalState.basic)
      setValue(
        'unCollectedAmount',
        subjectSelectedData?.fee * additionalState.basic,
      )
    } else {
      setValue('actualAmount', subjectSelectedData?.fee)
      setValue('tuitionFee', subjectSelectedData?.fee)
      setValue('unCollectedAmount', subjectSelectedData?.fee)
    }
  }

  return (
    <>
      <MainWrap>
        <ConArea>
          <Breadcrumb rightArea={false} isFilter={false} />
          <DetailBox>
            {studentData && (
              <FormTopInfo item={studentData} noti={true} time={true} />
            )}
            <DetailDiv>
              <AreaTitle>
                <h4>기본정보</h4>
              </AreaTitle>
              <FlexBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      이름<span>*</span>
                    </FilterLabel>
                    <LineBox>{studentData?.name}</LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      생년월일<span>*</span>
                    </FilterLabel>
                    <LineBox>
                      {formatDate(studentData?.birthday, false)}
                    </LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      연락처<span>*</span>
                    </FilterLabel>
                    <LineBox>{studentData?.phoneNum1}</LineBox>
                  </div>
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <div>
                    <FilterLabel>담당자</FilterLabel>
                    <LineBox>{studentData?.writer}</LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>등록일시</FilterLabel>
                    <LineBox>
                      {formatDate(studentData?.createdAt, true)}
                    </LineBox>
                  </div>
                </AreaBox>
              </FlexBox>
            </DetailDiv>
          </DetailBox>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DetailBox>
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
                        subjectSelectedData !== null &&
                        subjectSelectedData?.subjectCode !== null
                          ? String(subjectSelectedData?.subjectCode)
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
                      onClick={sbjOpen}
                      {...register('subject', {
                        required: {
                          value: true,
                          message: '과정을 선택해 주세요.',
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
                              isDisabled={
                                subjectSelectedData === null || isDiscount
                                  ? true
                                  : false
                              }
                              label={
                                <FilterLabel>
                                  주말
                                  <ToolTipBox>
                                    <Tooltip
                                      content={
                                        '실 수강료의 20%만큼 가산됩니다.'
                                      }
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
                          defaultValue={'비동의'}
                          render={({ field }) => (
                            <RadioGroup
                              label={
                                <FilterLabel>교육상황보고여부</FilterLabel>
                              }
                              defaultValue={'비동의'}
                              orientation="horizontal"
                              className="gap-[0.65rem]"
                              classNames={{ wrapper: 'z-0' }}
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
                      endContent={<InputText>/ 100</InputText>}
                      label={
                        <FilterLabel>
                          선발 평가 점수
                          {sub === '국가기간' && <span>*</span>}
                        </FilterLabel>
                      }
                      className="w-full"
                      {...register('seScore', {
                        required: {
                          value: sub === '국가기간' ? true : false,
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
                        subjectSelectedData !== null
                          ? weekendClass[0] === 'Y'
                            ? feeFormet(
                                subjectSelectedData?.fee *
                                  additionalState.basic,
                              )
                            : feeFormet(subjectSelectedData?.fee)
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
                      isDisabled={subjectSelectedData === null ? true : false}
                      labelPlacement="outside"
                      placeholder="할인"
                      variant="bordered"
                      radius="md"
                      type="number"
                      label="할인"
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
                              labelPlacement="outside"
                              label={<span style={{ display: 'none' }}></span>}
                              placeholder=" "
                              variant={'underlined'}
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
                      isDisabled={subjectSelectedData === null ? true : false}
                      labelPlacement="outside"
                      placeholder="할인된 수강료"
                      variant="bordered"
                      radius="md"
                      type="number"
                      label={
                        <FilterLabel>
                          할인된 수강료 <span>(실 결제금액)</span>
                        </FilterLabel>
                      }
                      defaultValue={
                        subjectSelectedData !== null
                          ? weekendClass[0] === 'Y'
                            ? feeFormet(
                                subjectSelectedData?.fee *
                                  additionalState.basic,
                              )
                            : feeFormet(subjectSelectedData?.fee)
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
                      {...register('unCollectedAmount')}
                    />
                  </AreaBox>
                </FlexBox>
                <FlexBox>
                  <AreaBox>
                    <DatePickerBox>
                      <Controller
                        control={control}
                        name="paymentDate"
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
                              paymentDate === null
                                ? null
                                : new Date(paymentDate)
                            }
                            placeholderText="날짜를 선택해주세요."
                            isClearable
                            onChange={date => {
                              field.onChange(date)
                              setPaymentDate(date)
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
                              dueDate === null ? null : new Date(dueDate)
                            }
                            placeholderText="날짜를 선택해주세요."
                            isClearable
                            onChange={date => {
                              field.onChange(date)
                              setDueDate(date)
                            }}
                            ref={field.ref}
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
              </DetailDiv>
            </DetailBox>
          </form>
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
      />
    </>
  )
}
StudentsWriteCourse.getLayout = page => <Layout>{page}</Layout>
