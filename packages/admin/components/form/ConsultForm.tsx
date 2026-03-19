import { Suspense, useState } from 'react'
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
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { progressStatusState } from '@/lib/recoilAtoms'
import { useRecoilValue } from 'recoil'
import { useMutation } from '@apollo/client'
import { CREATE_STUDENT_STATE_MUTATION } from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
import { SEE_STUDENT_STATE_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import AdviceTypeModal from '@/components/modal/AdviceTypeModal'
import SubjectModal from '@/components/modal/SubjectModal'
import DatePickerHeader from '@/components/common/DatePickerHeader'
import PermissionManagerSelect from '@/components/common/select/PermissionManagerSelect'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import TypeLink from '@/components/common/TypeLink'

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

const today = new Date()

const todayStart = new Date(today)
todayStart.setHours(0, 0, 0, 0)

const todayEnd = new Date(today)
todayEnd.setHours(23, 59, 59, 999)

export default function ConsultForm({ supervisor }) {
  const router = useRouter()
  const [createStudent] = useMutation(CREATE_STUDENT_STATE_MUTATION)
  // const { userLogs } = useUserLogsMutation()
  const progressStatus = useRecoilValue(progressStatusState)
  const { register, control, setValue, handleSubmit, formState } = useForm()
  const { errors } = formState
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: sbjIsOpen,
    onOpen: sbjOpen,
    onClose: sbjClose,
  } = useDisclosure()
  const [subjectSelected, setSubjectSelected] = useState<string[]>([])
  const [adviceTypeSelected, setAdviceTypeSelected] = useState([])
  const [adviceTypeSelectedName, setAdviceTypeSelectedName] = useState([])
  const [stVisitDate, setStVisitDate] = useState(null)
  const [expEnrollDate, setExpEnrollDate] = useState(null)
  const [receipt, setReceipt] = useState('-')
  const [sub, setSub] = useState('-')
  const [manager, setManager] = useState('담당자 지정필요')
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  const onSubmit = data => {
    createStudent({
      variables: {
        stName: data.stName.trim(),
        agreement: '동의',
        adviceTypes: data.adviceTypes === '' ? [] : adviceTypeSelected,
        subject: data.subject === '' ? [] : subjectSelected,
        campus: '신촌',
        detail: data.detail === '' ? null : data.detail.trim(),
        category: null,
        phoneNum1: data.phoneNum1.trim(),
        phoneNum2: data.phoneNum2 === '' ? null : data.phoneNum2.trim(),
        phoneNum3: data.phoneNum3 === '' ? null : data.phoneNum3.trim(),
        stEmail: data.stEmail === '' ? null : data.stEmail.trim(),
        stAddr: null,
        subDiv: data.subDiv === undefined ? null : data.subDiv,
        stVisit: data.stVisit === undefined ? null : new Date(data.stVisit),
        expEnrollDate:
          data.expEnrollDate === undefined
            ? null
            : new Date(data.expEnrollDate),
        perchase: null,
        birthday: null,
        progress: data.progress === undefined ? 0 : data.progress,
        receiptDiv: data.receiptDiv === undefined ? '' : data.receiptDiv,
        pic: data.pic === undefined ? '담당자 지정필요' : data.pic,
        today: [todayStart, todayEnd],
      },
      refetchQueries: [
        {
          query: SEE_STUDENT_STATE_QUERY,
          variables: { page: 1, limit: 10 },
        },
      ],
      onCompleted: result => {
        // userLogs(
        //   `${data.stName}의 상담 등록`,
        //   `ok: ${result.createStudentState.ok}`,
        // )
        if (result.createStudentState.ok) {
          alert('등록되었습니다.')
          router.back()
        }
      },
    })
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
              onChange={e => {
                register('phoneNum1').onChange(e)
              }}
              className="w-full"
              maxLength={11}
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
            onClick={sbjOpen}
            {...register('subject')}
          />
        </AreaBox>
        <FlexBox>
          <AreaBox>
            <Controller
              control={control}
              name="receiptDiv"
              render={({ field }) => (
                <Controller
                  control={control}
                  name="receiptDiv"
                  render={({ field }) => (
                    <AdviceSelect
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
        </FlexBox>
        <FlexBox>
          <Controller
            control={control}
            name="pic"
            render={({ field, fieldState }) => (
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
            startContent={<i className="xi-calendar" />}
            className="w-full"
          />
        </FlexBox>
        <RadioBox>
          <Controller
            control={control}
            name="progress"
            render={({ field }) => (
              <RadioGroup
                label={<FilterLabel>진행상태</FilterLabel>}
                orientation="horizontal"
                className="gap-1"
                classNames={{ wrapper: 'z-0' }}
                onValueChange={value => {
                  field.onChange(parseInt(value))
                }}
              >
                {Object.entries(progressStatus)
                  .filter(([key]) => key !== '999')
                  .map(([key, value]) => (
                    <Radio key={key} value={key}>
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
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                  onChangeRaw={e => e.preventDefault()}
                  onFocus={e => e.target.blur()}
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
        <FlexBox>
          <Textarea
            label="상담 내용"
            labelPlacement="outside"
            className="max-w-full"
            variant="bordered"
            minRows={5}
            onChange={e => {
              register('detail').onChange(e)
            }}
            {...register('detail')}
          />
        </FlexBox>
        <BtnBox>
          <Button type="submit" color="primary" className="w-full text-white">
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
