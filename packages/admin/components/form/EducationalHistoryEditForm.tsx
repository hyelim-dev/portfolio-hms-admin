import {
  DEIT_EDU_INFOMATION_MUTATION,
  DELETE_EDU_INFOMATION_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import ListInfo from '@/components/common/ListInfo'

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

export default function EducationalHistoryEditForm({
  item,
  refetch,
  setPage,
  mId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [editEduInfo] = useMutation(DEIT_EDU_INFOMATION_MUTATION)
  const [deleteEduInfo] = useMutation(DELETE_EDU_INFOMATION_MUTATION)
  const [educationValue, setEducationValue] = useState('학력선택')
  const [graduationValue, setGraduationValue] = useState('졸업여부')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      eduType: '',
      eduName: '',
      major: '',
      graduationStatus: '',
    },
  })

  useEffect(() => {
    reset({
      eduType: item.eduType || '학력선택',
      eduName: item.eduName || '',
      major: item.major || '',
      graduationStatus: item.graduationStatus || '졸업여부',
    })

    if (item.eduType) {
      setEducationValue(item.eduType)
    }
    if (item.graduationStatus) {
      setGraduationValue(item.graduationStatus)
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editEduInfo({
            variables: {
              editEduInfomationId: item.id,
              eduType: data.eduType === '' ? '학력선택' : data.eduType,
              eduName: data.eduName === '' ? null : data.eduName,
              graduationStatus:
                data.graduationStatus === '' ? null : data.graduationStatus,
              major: data.major === '' ? null : data.major,
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} 학력 사항 id:${item.id} 수정`,
          //   `ok: ${result.data.editEduInfomation.ok} / ${dirtyFieldsArray.join(
          //     ', ',
          //   )}`,
          // )

          if (!result.data.editEduInfomation.ok) {
            throw new Error('학력 사항 수정 실패')
          }
          setPage(1)
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('학력 사항 수정 중 에러 발생:', error)
          alert('학력 사항 수정 처리 중 오류가 발생했습니다.')
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
        const result = await deleteEduInfo({
          variables: {
            deleteEduInfomationId: id,
          },
        })
        // userLogs(
        //   `${item.stName} 학력 사항 id:${id} 삭제`,
        //   `ok: ${result.data.deleteEduInfomation.ok}`,
        // )

        if (!result.data.deleteEduInfomation.ok) {
          throw new Error('학력 사항 삭제 실패')
        }
        setPage(1)
        refetch()
        alert('삭제되었습니다.')
      } catch (error) {
        console.error('학력 사항 삭제 중 에러 발생:', error)
        alert('학력 사항 삭제 처리 중 오류가 발생했습니다.')
      }
    }
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
              defaultValue={item.eduName}
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
              defaultValue={item.major}
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
          </BtnBox>
        </FlexBox>
        <ListInfo item={item} />
      </DetailForm>
    </>
  )
}
