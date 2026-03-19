import { CREATE_EDU_INFOMATION_MUTATION } from '@/graphql/mutations'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'

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

export default function EducationalHistoryForm({
  setIsCreate,
  paymentId,
  subjectId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [createEduInfo] = useMutation(CREATE_EDU_INFOMATION_MUTATION)
  const [educationValue, setEducationValue] = useState('학력선택')
  const [graduationValue, setGraduationValue] = useState('졸업여부')
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    createEduInfo({
      variables: {
        subjectId: subjectId,
        studentPaymentId: paymentId,
        eduType: data.eduType === '' ? null : data.eduType,
        eduName: data.eduName === '' ? null : data.eduName,
        graduationStatus:
          data.graduationStatus === '' ? null : data.graduationStatus,
        major: data.major === '' ? null : data.major,
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId: ${paymentId} 학력 등록`,
        //   `ok: ${result.createEduInfomation.ok}`,
        // )
        if (result.createEduInfomation.ok) {
          setIsCreate(true)
          alert('학력이 추가되었습니다.')
          reset()
          setEducationValue('학력선택')
          setGraduationValue('졸업여부')
        }
      },
    })
  }

  const handleEducationChange = e => {
    setEducationValue(e.target.value)
  }
  const handleGraduationChange = e => {
    setGraduationValue(e.target.value)
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Controller
              control={control}
              name="eduType"
              rules={{
                required: {
                  value: true,
                  message: '학력을 선택해주세요',
                },
              }}
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder=" "
                  defaultValue={[educationValue]}
                  className="w-full"
                  label={
                    <FilterLabel>
                      학력 <span>*</span>
                    </FilterLabel>
                  }
                  variant="bordered"
                  selectedKeys={[educationValue]}
                  onChange={value => {
                    if (value.target.value !== '') {
                      field.onChange(value)
                      handleEducationChange(value)
                    }
                  }}
                >
                  <SelectItem value={'학력선택'} key={'학력선택'}>
                    학력선택
                  </SelectItem>
                  <SelectItem value={'초등학교'} key={'초등학교'}>
                    초등학교
                  </SelectItem>
                  <SelectItem value={'중학교'} key={'중학교'}>
                    중학교
                  </SelectItem>
                  <SelectItem value={'고등학교'} key={'고등학교'}>
                    고등학교
                  </SelectItem>
                  <SelectItem value={'대학,대학원'} key={'대학,대학원'}>
                    대학,대학원
                  </SelectItem>
                  <SelectItem value={'기타학력'} key={'기타학력'}>
                    기타학력
                  </SelectItem>
                </Select>
              )}
            />
            {errors.eduType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.eduType.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  학교명 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('eduName', {
                required: {
                  value: true,
                  message: '학교명을 작성해주세요',
                },
              })}
            />
            {errors.eduName && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.eduName.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label="전공"
              type="text"
              placeholder=" "
              className="w-full"
              {...register('major')}
            />
          </AreaBox>
          <AreaBox>
            <Controller
              control={control}
              name="graduationStatus"
              defaultValue={'졸업여부'}
              render={({ field }) => (
                <Select
                  label="졸업여부"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder=" "
                  className="w-full"
                  selectedKeys={[graduationValue]}
                  onChange={value => {
                    if (value.target.value !== '') {
                      field.onChange(value)
                      handleGraduationChange(value)
                    }
                  }}
                >
                  <SelectItem value={'졸업여부'} key={'졸업여부'}>
                    졸업여부
                  </SelectItem>
                  <SelectItem value={'졸업'} key={'졸업'}>
                    졸업
                  </SelectItem>
                  <SelectItem value={'휴학'} key={'휴학'}>
                    휴학
                  </SelectItem>
                  <SelectItem value={'재학'} key={'재학'}>
                    재학
                  </SelectItem>
                  <SelectItem value={'중퇴'} key={'중퇴'}>
                    중퇴
                  </SelectItem>
                </Select>
              )}
            />
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
