import { useMutation } from '@apollo/client'
import { Button, Pagination, ScrollShadow } from '@nextui-org/react'
import { Suspense, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useRecoilState } from 'recoil'
import { paymentPageState } from '@/lib/recoilAtoms'
import { SEARCH_PAYMENT_FILTER_MUTATION } from '@/graphql/mutations'
import OutstandingItem from '@/components/items/OutstandingItem'

const TableArea = styled.div`
  margin-top: 0.5rem;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TTopic = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Ttotal = styled.p`
  font-weight: 300;
  margin-right: 0.5rem;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`
const TopBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`
const TableWrap = styled.div`
  width: 100%;
  display: table;
  min-width: 1200px;
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  text-align: center;
`
const TheaderBox = styled.div`
  display: flex;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 6%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.06}px;
`
const Tamount = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.08}px;
`
const Tsubject = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 21%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.21}px;
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
const Tmanager = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const PagerWrap = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: center;
`
const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

export default function OutstandingFilterTable({ studentFilter }) {
  const [currentPage, setCurrentPage] = useRecoilState(paymentPageState)
  const [currentLimit] = useState(10)
  const [searchPaymentFilterMutation] = useMutation(
    SEARCH_PAYMENT_FILTER_MUTATION,
  )
  const [searchResult, setSearchResult] = useState(null)

  useEffect(() => {
    searchPaymentFilterMutation({
      variables: {
        ...studentFilter,
        page: currentPage,
        perPage: currentLimit,
      },
      onCompleted: resData => {
        if (resData.searchStudentPayment.ok) {
          const { data, totalCount } = resData.searchStudentPayment || {}
          setSearchResult({ data, totalCount })
        }
      },
    })
  }, [studentFilter, currentPage])

  const resetList = () => {
    window.location.href = '/accounting/outstanding'
  }

  return (
    <>
      <TTopic>
        <TopBox>
          <Ttotal>
            총
            <span>
              {searchResult?.totalCount === null ? 0 : searchResult?.totalCount}
            </span>
            건이 검색되었습니다.
          </Ttotal>
          <Button size="sm" radius="sm" color="primary" onClick={resetList}>
            전체보기
          </Button>
        </TopBox>
      </TTopic>
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <Tnum>No</Tnum>
                <TcreatedAt>수강신청일</TcreatedAt>
                <Tname>수강생명</Tname>
                <Tmanager>영업 담당자</Tmanager>
                <Tsubject>수강과정</Tsubject>
                <Tamount className="fee">수강료</Tamount>
                <Tamount className="discount">할인금액</Tamount>
                <Tamount className="actual">실 수강료</Tamount>
                <Tamount className="unpaid">미수납액</Tamount>
                <Tamount className="amount">총 결제액</Tamount>
              </TheaderBox>
            </Theader>
            {searchResult?.totalCount > 0 &&
              searchResult?.data?.map((item, index) => (
                <Suspense
                  key={index}
                  fallback={
                    <LodingDiv>
                      <i className="xi-spinner-2" />
                    </LodingDiv>
                  }
                >
                  <OutstandingItem
                    key={index}
                    tableData={item}
                    itemIndex={index}
                    currentPage={currentPage}
                    limit={currentLimit}
                  />
                </Suspense>
              ))}
            {searchResult?.totalCount === 0 && (
              <Nolist>검색결과가 없습니다.</Nolist>
            )}
          </TableWrap>
        </ScrollShadow>
        {searchResult?.totalCount > 0 && (
          <PagerWrap>
            <Pagination
              variant="light"
              showControls
              initialPage={currentPage}
              page={currentPage}
              total={Math.ceil(searchResult?.totalCount / currentLimit)}
              onChange={newPage => {
                setCurrentPage(newPage)
              }}
            />
          </PagerWrap>
        )}
      </TableArea>
    </>
  )
}
