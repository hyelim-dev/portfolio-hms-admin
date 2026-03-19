import { useLazyQuery } from '@apollo/client'
import { Button, Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { SEARCH_ATTENDANCE_RECORD_ID_QUERY } from '@/graphql/queries'
import TimesheetItem from '@/components/items/TimesheetItem'

const TableArea = styled.div`
  margin-top: 0.5rem;
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
const TableWrap = styled.div`
  width: 100%;
  display: table;
  min-width: 1200px;

  @media (max-width: 1024px) {
    min-width: 800px;
  }
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
const TopBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`
const TheaderBox = styled.div`
  display: flex;
`
const ClickBox = styled.div`
  display: flex;
  width: 100%;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 5%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.05}px;

  @media (max-width: 1024px) {
    width: 10%;
    min-width: ${800 * 0.1}px;
  }
`
const Tavatar = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 6%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.06}px;

  @media (max-width: 1024px) {
    width: 11%;
    min-width: ${800 * 0.11}px;
  }
`
const Tid = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: ${({ theme }) => theme.colors.secondary};
  min-width: ${1200 * 0.1}px;
  font-weight: 600;

  @media (max-width: 1024px) {
    width: 15%;
    min-width: ${800 * 0.15}px;
  }
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: ${({ theme }) => theme.colors.primary};
  min-width: ${1200 * 0.09}px;
  font-weight: 600;

  @media (max-width: 1024px) {
    width: 14%;
    min-width: ${800 * 0.14}px;
  }
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.12}px;

  @media (max-width: 1024px) {
    width: 17%;
    min-width: ${800 * 0.17}px;
  }
`
const Trank = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;

  @media (max-width: 1024px) {
    width: 13%;
    min-width: ${800 * 0.13}px;
  }
`
const TjoiningDate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 15%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.15}px;

  @media (max-width: 1024px) {
    width: 20%;
    min-width: ${800 * 0.2}px;
  }
`
const EmptyBox = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 35%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.35}px;

  @media (max-width: 1024px) {
    display: none;
  }
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

export default function TimesheetFilterTable({ managerFilter }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(10)
  const [searchManagerAttendance, { refetch, loading, error, data }] =
    useLazyQuery(SEARCH_ATTENDANCE_RECORD_ID_QUERY)
  const [managerAttendanceData, setManagerAttendanceData] = useState(null)
  const [managerAttendanceTotal, setManagerAttendanceTotal] = useState(0)

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (managerFilter) {
      searchManagerAttendance({
        variables: {
          ...managerFilter,
          page: currentPage,
          limit: currentLimit,
        },
        onCompleted: result => {
          setManagerAttendanceData(result?.searchAttendanceRecord.result)
          setManagerAttendanceTotal(result?.searchAttendanceRecord.totalCount)
        },
      })
    }
  }, [managerFilter, currentPage])

  const resetList = () => {
    window.location.href = '/hr/timesheet'
  }

  if (error) {
    console.log(error)
  }

  return (
    managerAttendanceData && (
      <>
        <TTopic>
          <TopBox>
            <Ttotal>
              총{' '}
              <span>
                {managerAttendanceTotal === null ? 0 : managerAttendanceTotal}
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
                  <ClickBox>
                    <Tnum>No</Tnum>
                    <Tavatar></Tavatar>
                    <Tid>아이디</Tid>
                    <Tname>이름</Tname>
                    <TjoiningDate>출근시간</TjoiningDate>
                    <Tpart>부서</Tpart>
                    <Trank>직책/직위</Trank>
                    <EmptyBox></EmptyBox>
                  </ClickBox>
                </TheaderBox>
              </Theader>
              {managerAttendanceData.length > 0 &&
                managerAttendanceData?.map((item, index) => (
                  <TimesheetItem
                    forName="student"
                    key={index}
                    tableData={item}
                    itemIndex={index}
                    currentPage={currentPage}
                    limit={currentLimit}
                  />
                ))}
              {managerAttendanceTotal === 0 && (
                <Nolist>검색된 출근기록이 없습니다.</Nolist>
              )}
            </TableWrap>
          </ScrollShadow>
          {managerAttendanceTotal > 0 && (
            <PagerWrap>
              <Pagination
                variant="light"
                showControls
                initialPage={currentPage}
                page={currentPage}
                total={Math.ceil(managerAttendanceTotal / currentLimit)}
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
