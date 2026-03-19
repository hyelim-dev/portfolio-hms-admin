import { CREATE_CAREER_MUTATION } from '@/graphql/mutations'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { Button, Textarea } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
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

export default function CareerHistoryForm({
  setIsCreate,
  paymentId,
  subjectId,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [createCareer] = useMutation(CREATE_CAREER_MUTATION)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    createCareer({
      variables: {
        careerDetails: data.careerDetails === '' ? null : data.careerDetails,
        subjectId: subjectId,
        studentPaymentId: paymentId,
      },
      refetchQueries: [SEARCH_SM_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `paymentId: ${paymentId} 경력 등록`,
        //   `ok: ${result.createCareer.ok}`,
        // )
        if (result.createCareer.ok) {
          setIsCreate(true)
          alert('경력이 추가되었습니다.')
          reset()
        }
      },
    })
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  경력 내용<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('careerDetails').onChange(e)
              }}
              {...register('careerDetails', {
                required: {
                  value: true,
                  message: '경력내용을 작성해주세요',
                },
              })}
            />
            {errors.careerDetails && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.careerDetails.message)}
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
