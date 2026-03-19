import { styled } from 'styled-components'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import {
  COMP_CONSULTATION_STATISTICS_LIST_MUTATION,
  CONSULTATION_STATISTICS_LIST_MUTATION,
} from '@/graphql/mutations'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { progressStatusState } from '@/lib/recoilAtoms'

type ConsultItemProps = {
  tableData: {
    adviceTypes: any
    id: number
    stName: string
    phoneNum1: string
    progress: number
    subDiv: string
    stVisit: string
    createdAt: string
    receiptDiv: string
    pic: string
  }
  forName?: string
  itemIndex: number
  currentPage: number
  limit?: number
  favorite?: boolean
  favoTotal?: number
  flagNum?: number
  checkBtn?: boolean
  checkItem?: number[]
  setCheckItem?: (newItems: number[]) => void
}

const TableItem = styled.div`
  position: relative;
  display: table;
  width: 100%;
  min-width: fit-content;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;
`

const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
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
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const Refund = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`
const AreaBoxS = styled.div`
  min-width: 5%;
  text-align: center;
  @media (max-width: 768px) {
    min-width: 100%;
    text-align: left;
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
  font-weight: bold;
`

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function PerformanceTotal({
  ranking,
  managerUsernames,
  dateRange,
  managerId,
  totalActualAmount,
  totalAmount,
  totalPaymentCount,
  totalRefundAmount,
  totalRefundCount,
}) {
  const progressStatus = useRecoilValue(progressStatusState)
  const {
    data: managerData,
    error,
    refetch,
  } = useSuspenseQuery<SearchPermissionsGrantedQeury>(
    SEARCH_PERMISSIONS_GRANTED_QUERY,
    {
      variables: {
        permissionName: '영업실적대상자',
      },
    },
  )
  const managerList = managerData?.searchPermissionsGranted.data[0].ManageUser

  const [consultationTotal] = useMutation(CONSULTATION_STATISTICS_LIST_MUTATION)
  const [compConsultationTotal] = useMutation(
    COMP_CONSULTATION_STATISTICS_LIST_MUTATION,
  )
  const [totalConsultation, setTotalConsultation] = useState(0)
  const [totalCompConsultation, setTotalCompConsultation] = useState(0)

  useEffect(() => {
    consultationTotal({
      variables: {
        createdAt: dateRange,
        pic: managerUsernames,
      },
      onCompleted: result => {
        if (result.searchStudentState.ok) {
          setTotalConsultation(result.searchStudentState.totalCount)
        }
      },
    })
    compConsultationTotal({
      variables: {
        progress: [60],
        createdAt: dateRange,
        pic: managerUsernames,
      },
      onCompleted: result => {
        if (result.searchStudentState.ok) {
          setTotalCompConsultation(result.searchStudentState.totalCount)
        }
      },
    })
  }, [managerId, dateRange])

  const feeFormet = fee => {
    const result = String(fee).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  if (error) {
    console.log(error)
  }

  return (
    <>
      <FlexBox>
        <AreaBoxS>
          <FilterLabel>순위</FilterLabel>
          <FlatBox>{totalPaymentCount === 0 ? '-' : ranking + 1}</FlatBox>
        </AreaBoxS>
        <AreaBox>
          <FilterLabel>이름</FilterLabel>
          <FlatBox>
            {managerList?.find(user => user.id === managerId).mUsername}
          </FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 결제건수</FilterLabel>
          <FlatBox>{totalPaymentCount}</FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 결제액</FilterLabel>
          <FlatBox>
            {totalAmount === undefined || totalAmount === null
              ? '0'
              : feeFormet(totalAmount)}
          </FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 환불건수</FilterLabel>
          <FlatBox>{totalRefundCount}</FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 환불액</FilterLabel>
          <FlatBox>
            <Refund>
              {totalRefundAmount === undefined || totalRefundAmount === null
                ? '0'
                : feeFormet(totalRefundAmount)}
            </Refund>
          </FlatBox>
        </AreaBox>
      </FlexBox>
      <FlexBox>
        <AreaBox>
          <FilterLabel>실 결제액</FilterLabel>
          <FlatBox>
            {totalActualAmount === undefined || totalActualAmount === null
              ? '0'
              : feeFormet(totalActualAmount)}
          </FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>객단가 &#40; 실 결제액 / 총 결제건수 &#41;</FilterLabel>
          <FlatBox>
            {totalActualAmount === 0 || totalPaymentCount === 0
              ? '0'
              : feeFormet(Math.round(totalActualAmount / totalPaymentCount))}
          </FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 DB개수</FilterLabel>
          <FlatBox>{totalConsultation}</FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>총 등록개수</FilterLabel>
          <FlatBox>{totalCompConsultation}</FlatBox>
        </AreaBox>
        <AreaBox>
          <FilterLabel>등록률</FilterLabel>
          <FlatBox>
            {totalConsultation > 0 && totalCompConsultation > 0
              ? Math.round((totalCompConsultation / totalConsultation) * 100)
              : 0}
            %
          </FlatBox>
        </AreaBox>
      </FlexBox>
    </>
  )
}
