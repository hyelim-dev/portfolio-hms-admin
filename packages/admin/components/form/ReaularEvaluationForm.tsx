import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { CREATE_REGULAR_EVALUATION_SET_MUTATION } from '@/graphql/mutations'
import { useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import { SEE_REGULAREVALUATION_SET_QUERY } from '@/graphql/queries'

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

export default function ReaularEvaluationForm({ setIsCreate, subjectId }) {
  // const { userLogs } = useUserLogsMutation()
  const [createRegularEvaluationSet] = useMutation(
    CREATE_REGULAR_EVALUATION_SET_MUTATION,
  )
  const { register, handleSubmit, reset, control, formState } = useForm()
  const { errors } = formState
  const onSubmit = data => {
    createRegularEvaluationSet({
      variables: {
        subjectId: subjectId,
        statusType: data.statusType === '' ? null : data.statusType,
        evaluationDetails:
          data.evaluationDetails === '' ? null : data.evaluationDetails,
        points: data.points === '' ? 0 : parseInt(data.points),
      },
      refetchQueries: [SEE_REGULAREVALUATION_SET_QUERY],
      onCompleted: result => {
        // userLogs(
        //   `${data.statusType} 정기평가 내용 설정`,
        //   `ok: ${result.createRegularEvaluationSet.ok}`,
        // )
        if (result.createRegularEvaluationSet.ok) {
          setIsCreate(true)
          alert(`정기평가 내용이 설정되었습니다.`)
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
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  구분 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('statusType', {
                required: {
                  value: true,
                  message: '구분을 작성해주세요',
                },
              })}
            />
            {errors.statusType && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.statusType.message)}
              </p>
            )}
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              variant="bordered"
              label={
                <FilterLabel>
                  배점 <span>*</span>
                </FilterLabel>
              }
              type="text"
              placeholder=" "
              className="w-full"
              {...register('points', {
                required: {
                  value: true,
                  message: '배점을 작성해주세요',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: '숫자만 사용가능합니다.',
                },
              })}
            />
            {errors.points && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.points.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  평가내용 <span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('evaluationDetails').onChange(e)
              }}
              {...register('evaluationDetails', {
                required: {
                  value: true,
                  message: '평가내용을 입력해주세요.',
                },
              })}
            />
            {errors.evaluationDetails && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.evaluationDetails.message)}
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
