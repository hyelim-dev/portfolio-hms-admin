import {
  DELETE_CERTIFICATE_MUTATION,
  EDIT_CERTIFICATE_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
registerLocale('ko', ko)
const _ = require('lodash')
import DatePickerHeader from '@/components/common/DatePickerHeader'
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

export default function CertificateEditForm({ item, setPage, refetch, mId }) {
  // const { userLogs } = useUserLogsMutation()
  const [editCertificate] = useMutation(EDIT_CERTIFICATE_MUTATION)
  const [deleteCertificate] = useMutation(DELETE_CERTIFICATE_MUTATION)
  const [certificateDate, setCertificateDate] = useState(null)
  const years = _.range(2000, getYear(new Date()) + 5, 1)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      cAdate: null,
      certificateName: '',
      certificateIssuer: '',
      certificateLevel: '',
    },
  })

  useEffect(() => {
    reset({
      cAdate: item.CAdate || null,
      certificateName: item.certificateName || '',
      certificateIssuer: item.CertificateIssuer || '',
      certificateLevel: item.certificateLevel || '',
    })

    if (item.CAdate === null || item.CAdate === undefined) {
      setCertificateDate(null)
    } else {
      const timestamp = parseInt(item.CAdate)
      setCertificateDate(timestamp)
    }
  }, [item])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editCertificate({
            variables: {
              editCertificateId: item.id,
              certificateIssuer:
                data.certificateIssuer === null ? null : data.certificateIssuer,
              certificateLevel:
                data.certificateLevel === null ? null : data.certificateLevel,
              certificateName:
                data.certificateName === null ? null : data.certificateName,
              cAdate:
                data.cAdate === null
                  ? null
                  : typeof data.cAdate === 'string'
                    ? new Date(parseInt(data.cAdate))
                    : new Date(data.cAdate),
              lastModifiedTime: new Date(),
            },
          })
          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} 자격 취득 현황 id:${item.id} 수정`,
          //   `ok: ${result.data.editCertificate.ok} / ${dirtyFieldsArray.join(
          //     ', ',
          //   )}`,
          // )

          if (!result.data.editCertificate.ok) {
            throw new Error('자격 취득 현황 수정 실패')
          }
          setPage(1)
          refetch()
          alert('수정되었습니다.')
        } catch (error) {
          console.error('자격 취득 현황 수정 중 에러 발생:', error)
          alert('자격 취득 현황 수정 처리 중 오류가 발생했습니다.')
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
        const result = await deleteCertificate({
          variables: {
            deleteCertificateId: id,
          },
        })
        // userLogs(
        //   `${item.stName} 자격 취득 현황 id:${id} 삭제`,
        //   `ok: ${result.data.deleteCertificate.ok}`,
        // )

        if (!result.data.deleteCertificate.ok) {
          throw new Error('자격 취득 현황 삭제 실패')
        }
        setPage(1)
        refetch()
        alert('삭제되었습니다.')
      } catch (error) {
        console.error('자격 취득 현황 삭제 중 에러 발생:', error)
        alert('자격 취득 현황 삭제 처리 중 오류가 발생했습니다.')
      }
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
