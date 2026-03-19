import { useMutation } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import EmploymentItem from '@/components/items/EmploymentItem'
import { SEARCH_EMPLOYMENT_STUDENTPAYMENT_MUTATION } from '@/graphql/mutations'
import { useRecoilValue } from 'recoil'
import { assignmentState } from '@/lib/recoilAtoms'

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
const ClickBox = styled.div`
  display: flex;
  width: 100%;
`
const Tflag = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 1%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.01}px;
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
const TlecturName = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.25}px;
`
const Tperiod = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 16%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.16}px;
`
const Ttimes = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tteacher = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tcheck = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const Tbtn = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
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

export default function EmploymentTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(10)
  const assignment = useRecoilValue(assignmentState)
  const [searchEmploymentStudentPayment] = useMutation(
    SEARCH_EMPLOYMENT_STUDENTPAYMENT_MUTATION,
  )
  const [resultData, setResultData] = useState(null)

  useEffect(() => {
    searchEmploymentStudentPayment({
      variables: {
        lectureAssignment: assignment.assignment,
        page: currentPage,
        perPage: currentLimit,
      },
      onCompleted: resData => {
        if (resData.searchStudentPayment.ok) {
          const { data, totalCount } = resData.searchStudentPayment || {}
          setResultData({ data, totalCount })
        }
      },
    })
  }, [currentPage])

  return (
    <>
      <TTopic>
        <Ttotal>
          총 <span>{resultData?.totalCount}</span>건
        </Ttotal>
      </TTopic>
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <ClickBox>
                  <Tflag></Tflag>
                  <Tnum>No</Tnum>
                  <TlecturName>강의이름</TlecturName>
                  <Tnum>회차</Tnum>
                  <Tperiod>강의기간</Tperiod>
                  <Ttimes>관리 종료일</Ttimes>
                  <Tteacher>강사명</Tteacher>
                  <Tname>학생명</Tname>
                  <Tcheck>취업여부</Tcheck>
                  <Tbtn></Tbtn>
                </ClickBox>
              </TheaderBox>
            </Theader>
            {resultData?.totalCount > 0 &&
              resultData?.data.map((item, index) => (
                <EmploymentItem
                  forName="student"
                  key={index}
                  tableData={item}
                  itemIndex={index}
                  currentPage={currentPage}
                  limit={currentLimit}
                />
              ))}
            {resultData?.totalCount === 0 && (
              <Nolist>등록된 취업현황이 없습니다.</Nolist>
            )}
          </TableWrap>
        </ScrollShadow>
        {resultData?.totalCount > 0 && (
          <PagerWrap>
            <Pagination
              variant="light"
              showControls
              initialPage={currentPage}
              page={currentPage}
              total={Math.ceil(resultData?.totalCount / currentLimit)}
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
