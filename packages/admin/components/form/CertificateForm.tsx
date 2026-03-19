import { CREATE_CERTIFICATE_MUTATION } from '@/graphql/mutations'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import DatePickerHeader from '@/components/common/DatePickerHeader'

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
`

export default function CertificateForm({ setIsCreate, paymentId, subjectId }) {
  // const { userLogs } = useUserLogsMutation()
  const [createCertificate] = useMutation(CREATE_CERTIFICATE_MUTATION)
  const [certificateDate, setCertificateDate] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    createCertificate({
      variables: {
        subjectId: subjectId,
        studentPaymentId: paymentId,
        cAdate: data.cAdate === undefined ? null : new Date(data.cAdate),
        certificateName:
          data.certificateName === '' ? null : data.certificateName,
        certificateIssuer:
          data.certificateIssuer === '' ? null : data.certificateIssuer,
        certificateLevel:
          data.certificateLevel === '' ? null : data.certificateLevel,
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId: ${paymentId} 자격 취득 현황 등록`,
        //   `ok: ${result.createCertificate.ok}`,
        // )
        if (result.createCertificate.ok) {
          setIsCreate(true)
          alert('자격 취득 현황이 추가되었습니다.')
          reset()
          setCertificateDate(null)
        }
      },
    })
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <DatePickerBox>
              <Controller
                control={control}
                name="cAdate"
                rules={{
                  required: {
                    value: true,
                    message: '취득일자를 선택해주세요.',
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
                      certificateDate === null
                        ? null
                        : new Date(certificateDate)
                    }
                    placeholderText="날짜를 선택해주세요."
                    isClearable
                    onChange={date => {
                      field.onChange(date)
                      setCertificateDate(date)
                    }}
                    dateFormat="yyyy/MM/dd"
                    onChangeRaw={e => e.preventDefault()}
                    onFocus={e => e.target.blur()}
                    customInput={
                      <Input
                        ref={field.ref}
                        label={
                          <FilterLabel>
                            취득 일자 <span>*</span>
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
            {errors.cAdate && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.cAdate.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  자격증명 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('certificateName', {
                required: {
                  value: true,
                  message: '자격증명을 작성해주세요',
                },
              })}
            />
            {errors.certificateName && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.certificateName.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label="급수"
              type="text"
              placeholder=" "
              className="w-full"
              {...register('certificateLevel')}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  발행처 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('certificateIssuer', {
                required: {
                  value: true,
                  message: '발행처를 작성해주세요',
                },
              })}
            />
            {errors.certificateIssuer && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.certificateIssuer.message)}
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
