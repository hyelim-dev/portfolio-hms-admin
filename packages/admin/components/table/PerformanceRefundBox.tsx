import { useMutation } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import PerformanceItem from '@/components/table/PerformanceItem'
import { SALES_STATISTICS_REFUND_LIST_MUTATION } from '@/graphql/mutations'

const TableArea = styled.div``

const Title = styled.h2`
  position: relative;
  font-size: 1.2rem;
  font-weight: 600;
  padding-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  &:after {
    content: '';
    width: 0.3rem;
    height: 100%;
    background: ${({ theme }) => theme.colors.accent};
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.3rem;
  }
`
const TableWrap = styled.div`
  width: 100%;
  display: table;
  min-width: 700px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.5rem;
`
const Theader = styled.div`
  width: 100%;
  min-width: fit-content;
  display: table;
  flex-wrap: nowrap;
  row-gap: 1rem;
  color: #111;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
`

const TheaderBox = styled.div`
  display: flex;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.07}px;
`
const Tamount = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tsubject = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.5}px;
`
const TcreatedAt = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
`
const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
`
const PagerWrap = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: center;
`

export default function PerformanceRefundBox({
  managerData,
  dateRange,
  totalRefundCount,
  filterSearch,
}) {
  const [salesStatisticsList] = useMutation(
    SALES_STATISTICS_REFUND_LIST_MUTATION,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(5)
  const [detailRefund, setDetailRefund] = useState(null)

  useEffect(() => {
    if (filterSearch) {
      if (currentPage !== 1) {
        setCurrentPage(1)
      } else {
        salesStatisticsList({
          variables: {
            receiverId: managerData.receiverId,
            refundApprovalDate: dateRange,
            reqRefund: true,
            refundApproval: true,
            sortOf: 'refundApprovalDate',
            page: currentPage,
            limit: currentLimit,
          },
          onCompleted: result => {
            if (result.searchPaymentDetail.ok) {
              const { PaymentDetail } = result.searchPaymentDetail
              setDetailRefund(PaymentDetail)
            }
          },
        })
      }
    }
  }, [dateRange, managerData])

  useEffect(() => {
    salesStatisticsList({
      variables: {
        receiverId: managerData.receiverId,
        refundApprovalDate: dateRange,
        sortOf: 'refundApprovalDate',
        reqRefund: true,
        refundApproval: true,
        page: currentPage,
        limit: currentLimit,
      },
      onCompleted: result => {
        if (result.searchPaymentDetail.ok) {
          const { PaymentDetail } = result.searchPaymentDetail
          setDetailRefund(PaymentDetail)
        }
      },
    })
  }, [currentPage])
  return (
    detailRefund && (
      <>
        <Title>환불 내역</Title>
        <TableArea>
          <ScrollShadow orientation="horizontal" className="scrollbar">
            <TableWrap>
              <Theader>
                <TheaderBox>
                  <Tnum>No</Tnum>
                  <TcreatedAt>환불 일시</TcreatedAt>
                  <Tamount className="amount">카드 결제액</Tamount>
                  <Tamount className="amount">현금 결제액</Tamount>
                  <Tsubject>수강과정</Tsubject>
                  <Tname>수강생명</Tname>
                </TheaderBox>
              </Theader>
              {detailRefund.length !== 0 && (
                <>
                  {detailRefund &&
                    detailRefund.map((item, index) => (
                      <PerformanceItem
                        key={index}
                        currentPage={currentPage}
                        limit={currentLimit}
                        tableData={item}
                        itemIndex={index}
                      />
                    ))}
                </>
              )}
              {detailRefund.length === 0 && <Nolist>데이터가 없습니다.</Nolist>}
            </TableWrap>
          </ScrollShadow>
          {detailRefund.length !== 0 && (
            <PagerWrap>
              <Pagination
                variant="light"
                showControls
                initialPage={currentPage}
                page={currentPage}
                total={Math.ceil(totalRefundCount / currentLimit)}
                onChange={newPage => {
                  setCurrentPage(newPage)
                }}
              />
            </PagerWrap>
          )}
        </TableArea>
      </>
    )
  )
}
