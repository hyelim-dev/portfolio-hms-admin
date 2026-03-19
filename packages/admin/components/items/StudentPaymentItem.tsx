import { Textarea } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { styled, useTheme } from 'styled-components'
import Layout from '@/pages/students/layout'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import {
  assignmentState,
  completionStatus,
  employmentStatus,
} from '@/lib/recoilAtoms'
import { useRecoilValue } from 'recoil'

const FlexCardBox = styled.div<{ $lectureAssignment: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: ${props =>
    props.$lectureAssignment
      ? `2px solid ${({ theme }) => theme.colors.tertiary};`
      : '2px solid hsl(240 6% 90%);'};
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.black};
  &:hover {
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.8);
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    width: 100% !important;
  }
`

const AreaBoxS = styled.div`
  width: 20%;
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  cursor: inherit;
  span {
    color: red;
  }
`
const FlatBox = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background: hsl(240 5% 96%);
  height: 40px;
  line-height: 40px;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`
type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}
export default function StudentPaymentItem({ detailtData, index, studentId }) {
  const router = useRouter()
  const theme = useTheme()
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  const employment = useRecoilValue(employmentStatus)
  const { data: managerData, error } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          permissionName: '상담관리접근',
        },
      },
    )
  const managerList = managerData?.searchPermissionsGranted.data[0].ManageUser

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  const formatTime = dateString => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const extractTimeRange = dates => {
    const startTime = formatTime(dates[0])
    const endTime = formatTime(dates[1])
    return `${startTime} - ${endTime}`
  }

  const formatUsernames = data => {
    return data.map(item => item.mUsername).join(', ')
  }

  const clickItem = item => {
    router.push(`/students/detail/course/${detailtData.id}`)
  }

  if (error) {
    console.log(error)
  }

  console.log(detailtData)

  return (
    <>
      <FlexCardBox
        onClick={() => clickItem(index)}
        $lectureAssignment={
          detailtData?.lectureAssignment === assignment.withdrawal
        }
      >
        <FlexBox>
          <AreaGroup style={{ width: '30%' }}>
            <AreaBoxS>
              <div>
                <FilterLabel>No.</FilterLabel>
                <FlatBox>{index + 1}</FlatBox>
              </div>
            </AreaBoxS>
            <AreaBox>
              <div>
                <FilterLabel>수강구분</FilterLabel>
                <FlatBox>{detailtData?.subDiv}</FlatBox>
              </div>
            </AreaBox>
          </AreaGroup>
          <AreaBox>
            <div>
              <Textarea
                label="과정명"
                isDisabled={true}
                isReadOnly={true}
                labelPlacement="outside"
                defaultValue={detailtData?.subject.subjectName}
                minRows={1}
                variant="flat"
                size="md"
                radius="sm"
                classNames={{
                  base: 'opacity-1',
                }}
              ></Textarea>
            </div>
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaGroup style={{ width: '50%' }}>
            <AreaBox>
              <div>
                <FilterLabel>배정</FilterLabel>
                <FlatBox
                  style={{
                    color:
                      detailtData?.lectureAssignment === assignment.assignment
                        ? theme.colors.secondary
                        : detailtData?.lectureAssignment ===
                          assignment.unassigned
                        ? theme.colors.accent
                        : theme.colors.tertiary,
                  }}
                >
                  {detailtData?.lectureAssignment}
                </FlatBox>
              </div>
            </AreaBox>
            <AreaBox>
              <div>
                <FilterLabel>수료</FilterLabel>
                <FlatBox
                  style={{
                    color:
                      detailtData?.courseComplete === completion.completed ||
                      detailtData?.courseComplete === completion.inTraining
                        ? theme.colors.secondary
                        : detailtData?.courseComplete === completion.notAttended
                        ? theme.colors.accent
                        : theme.colors.tertiary,
                  }}
                >
                  {detailtData?.courseComplete}
                </FlatBox>
              </div>
            </AreaBox>
            <AreaBox>
              <div>
                <FilterLabel>취업</FilterLabel>
                <FlatBox
                  style={{
                    color:
                      detailtData?.employment === employment.employed
                        ? theme.colors.secondary
                        : theme.colors.accent,
                  }}
                >
                  {detailtData?.employment}
                </FlatBox>
              </div>
            </AreaBox>
          </AreaGroup>
          <AreaBox>
            <div>
              <FilterLabel>영업담당자</FilterLabel>
              <FlatBox>
                {
                  managerList.find(
                    user => user.id === detailtData?.processingManagerId,
                  )?.mUsername
                }
              </FlatBox>
            </div>
          </AreaBox>
          <AreaBox>
            <div>
              <FilterLabel>등록일시</FilterLabel>
              <FlatBox>{formatDate(detailtData.createdAt)}</FlatBox>
            </div>
          </AreaBox>
        </FlexBox>

        {detailtData?.lectureAssignment === assignment.assignment && (
          <>
            <FlexBox>
              <AreaBoxS>
                <div>
                  <FilterLabel>회차</FilterLabel>
                  <FlatBox>
                    {detailtData?.subject?.lectures?.sessionNum}회차
                  </FlatBox>
                </div>
              </AreaBoxS>
              <AreaBox>
                <div>
                  <Textarea
                    label="수강명"
                    isDisabled={true}
                    isReadOnly={true}
                    labelPlacement="outside"
                    defaultValue={detailtData?.subject?.lectures?.temporaryName}
                    minRows={1}
                    variant="flat"
                    size="md"
                    radius="sm"
                    classNames={{
                      base: 'opacity-1',
                    }}
                  ></Textarea>
                </div>
              </AreaBox>
            </FlexBox>
            <FlexBox>
              <AreaBox>
                <div>
                  <FilterLabel>강의기간</FilterLabel>
                  <FlatBox>{`${formatDate(
                    detailtData?.subject?.lectures?.lecturePeriodStart,
                  )} - ${formatDate(
                    detailtData?.subject?.lectures?.lecturePeriodEnd,
                  )}`}</FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>강의시간</FilterLabel>
                  <FlatBox>
                    {extractTimeRange(
                      detailtData?.subject?.lectures?.lectureTime,
                    )}
                  </FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>강의실</FilterLabel>
                  <FlatBox>{detailtData?.subject?.lectures?.roomNum}</FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>담당강사</FilterLabel>
                  <FlatBox>
                    {formatUsernames(detailtData?.subject?.lectures?.teachers)}
                  </FlatBox>
                </div>
              </AreaBox>
            </FlexBox>
          </>
        )}
      </FlexCardBox>
    </>
  )
}
StudentPaymentItem.getLayout = page => <Layout>{page}</Layout>
