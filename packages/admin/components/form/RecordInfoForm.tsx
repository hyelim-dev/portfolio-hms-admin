import { Suspense, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { Button } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { EDIT_STUDENT_INFOMATION_MUTATION } from '@/graphql/mutations'
import StudentInfo from '@/components/layout/infoCard/StudentInfo'
import Address from '@/components/common/Address'
import { Controller, useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import AdviceSelect from '@/components/common/select/AdviceSelect'
import TypeLink from '@/components//common/TypeLink'

const FormBox = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const FlexConBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const AreaBox = styled.div`
  width: 100%;
  display: flex;
  position: relative;

  > div {
    width: 100%;
  }
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  span {
    color: red;
  }
`
const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: none;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function RecordInfoForm({ paymentData, fetchData }) {
  const router = useRouter()
  // const { userLogs } = useUserLogsMutation()
  const [editStudent] = useMutation(EDIT_STUDENT_INFOMATION_MUTATION)
  const [selectValue, setSelectValue] = useState('-')
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      supportType: '',
      mAddresses: '',
      mAddressDetail: '',
      mZipCode: '',
    },
  })

  useEffect(() => {
    if (paymentData) {
      reset({
        supportType: paymentData.supportType || '-',
        mAddresses: paymentData.mAddresses || '',
        mAddressDetail: paymentData.mAddressDetail || '',
        mZipCode: paymentData.mZipCode || '',
      })

      if (paymentData.supportType) {
        setSelectValue(paymentData.supportType)
      }
    }
  }, [paymentData])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editStudent({
            variables: {
              editStudentPaymentId: paymentData.id,
              subjectId: paymentData.subjectId,
              supportType: data.supportType,
              mAddressDetail:
                data.mAddressDetail === '' ? null : data.mAddressDetail,
              mAddresses: data.mAddresses === '' ? null : data.mAddresses,
              mZipCode: data.mZipCode === '' ? null : data.mZipCode,
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${paymentData.student.stName} 학생 정보 수정`,
          //   `ok: ${result.data.editStudentPayment.ok} / ${dirtyFieldsArray.join(
          //     ', ',
          //   )}`,
          // )

          if (!result.data.editStudentPayment.ok) {
            throw new Error('학생 정보 수정 실패')
          }
          fetchData()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('학생 정보 수정 중 에러 발생:', error)
          alert('학생 정보 수정 처리 중 오류가 발생했습니다.')
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
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

  const calculateAge = birthday => {
    const today = new Date()
    const timestamp = parseInt(birthday, 10)
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDifference = today.getMonth() - birthDate.getMonth()
    const dayDifference = today.getDate() - birthDate.getDate()

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--
    }

    return age
  }

  const handleSelectChange = e => {
    setSelectValue(e.target.value)
  }

  return (
    <>
      <StudentInfo
        studentData={paymentData.student}
        detailAll={false}
        record={true}
      />
      <FormBox onSubmit={handleSubmit(onSubmit)}>
        <FlexConBox>
          <AreaBox>
            <div>
              <FilterLabel>나이</FilterLabel>
              <LineBox>{calculateAge(paymentData.student.birthday)}세</LineBox>
            </div>
          </AreaBox>
          <AreaBox>
            <div>
              <FilterLabel>선발평가 점수</FilterLabel>
              <LineBox>{paymentData.seScore}점</LineBox>
            </div>
          </AreaBox>
          <AreaBox>
            <Controller
              control={control}
              name="supportType"
              rules={{
                required: {
                  value: true,
                  message: '훈련생유형을 선택해주세요',
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
                    selectedKey={selectValue}
                    field={field}
                    optionDefault={{
                      type: '-',
                    }}
                    label={
                      <FilterLabel>
                        훈련생유형 <span>*</span>
                      </FilterLabel>
                    }
                    handleChange={handleSelectChange}
                    category={'훈련생유형'}
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
                typeLink={'supportType'}
                typeName={'훈련생유형'}
                permissionName={'훈련생유형'}
              />
            </Suspense>
            {errors.supportType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.supportType.message)}
              </p>
            )}
          </AreaBox>
        </FlexConBox>
        <Address
          codeValueName={'mZipCode'}
          valueName={'mAddresses'}
          detailValueName={'mAddressDetail'}
          setValue={setValue}
          defaultPostcode={paymentData.mZipCode}
          defaultAddress={paymentData.mAddresses}
          defaultDetails={paymentData.mAddressDetail}
        />
        <BtnBox>
          <Button type="submit" color="primary" className="md:w-[50%] w-full">
            저장
          </Button>
        </BtnBox>
      </FormBox>
    </>
  )
}
