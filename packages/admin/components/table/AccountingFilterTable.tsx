import { useMutation } from '@apollo/client'
import { Button, Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { SEARCH_PAYMENT_DETAIL_FILTER_MUTATION } from '@/graphql/mutations'
import { useRecoilState } from 'recoil'
import { paymentDetailFilterPageState } from '@/lib/recoilAtoms'
import AccountingItem from '@/components/items/AccountingItem'

const TableArea = styled.div`
  margin-top: 0.5rem;
`
const TTopic = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
    align-items: flex-start;
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
const Ttotal = styled.p`
  font-weight: 300;
  margin-right: 0.5rem;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`
const ColorHelp = styled.div`
  display: flex;

  @media (max-width: 768px) {
    width: 100%;
  }
`
const ColorCip = styled.p`
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.7rem;

  span {
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 2px;
  }

  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0.5rem;
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
const Tflag = styled.div`
  display: table-cell;
  width: 0.5rem;
  height: 100%;
  min-width: 7px;
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
  width: 24%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.24}px;
`
const Tapproval = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
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

export default function AccountingFilterTable({ studentFilter }) {
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useRecoilState(
    paymentDetailFilterPageState,
  )
  const [currentLimit] = useState(10)
  const [searchPaymentFilterMutation] = useMutation(
    SEARCH_PAYMENT_DETAIL_FILTER_MUTATION,
  )
  const [searchResult, setSearchResult] = useState(null)

  useEffect(() => {
    searchPaymentFilterMutation({
      variables: {
        ...studentFilter,
        page: currentPage,
        perPage: currentLimit,
        sortOf: 'paymentDate',
      },
      onCompleted: resData => {
        if (resData.searchPaymentDetail.ok) {
          const { PaymentDetail, totalCount } =
            resData.searchPaymentDetail || {}
          setSearchResult({ PaymentDetail, totalCount })
        }
      },
    })
  }, [studentFilter, currentPage])

  const resetList = () => {
    window.location.href = '/accounting'
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
        <ColorHelp>
          <ColorCip>
            <span style={{ background: theme.colors.accent }}></span> : 환불
          </ColorCip>
        </ColorHelp>
      </TTopic>
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <Tflag></Tflag>
                <Tnum>No</Tnum>
                <TcreatedAt>결제 일시</TcreatedAt>
                <Tname>수강생명</Tname>
                <Tmanager>영업 담당자</Tmanager>
                <Tmanager>회계 담당자</Tmanager>
                <Tsubject>수강과정</Tsubject>
                <Tapproval>카드승인번호</Tapproval>
                <Tamount className="amount">카드 결제액</Tamount>
                <Tamount className="amount">현금 결제액</Tamount>
              </TheaderBox>
            </Theader>
            {searchResult?.totalCount > 0 &&
              searchResult?.PaymentDetail?.map((item, index) => (
                <AccountingItem
                  key={index}
                  tableData={item}
                  itemIndex={index}
                  currentPage={currentPage}
                  limit={currentLimit}
                />
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
