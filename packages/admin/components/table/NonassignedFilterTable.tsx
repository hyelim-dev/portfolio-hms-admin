import { Button, Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useRecoilValue } from 'recoil'
import { assignmentState } from '@/lib/recoilAtoms'
import NonassignedItem from '@/components/items/NonassignedItem'
import { useMutation } from '@apollo/client'
import { SEARCH_STUDENT_NONASSIGNED_MUTATION } from '@/graphql/mutations'

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
const ClickBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
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
const TsubDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const TsubjectName = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 56%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.56}px;
`
const Tdate = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
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
const TManager = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const TCode = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
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

const resetList = () => {
  window.location.href = '/students/nonassigned'
}

export default function NonassignedFilterTable({ studentFilter }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(10)
  const assignment = useRecoilValue(assignmentState)
  const [searchStudentNonassigned] = useMutation(
    SEARCH_STUDENT_NONASSIGNED_MUTATION,
  )
  const [searchResult, setSearchResult] = useState(null)

  useEffect(() => {
    searchStudentNonassigned({
      variables: {
        ...studentFilter,
        lectureAssignment: assignment.unassigned,
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

  return (
    searchResult && (
      <>
        <TTopic>
          <TopBox>
            <Ttotal>
              총{' '}
              <span>
                {searchResult?.totalCount === null
                  ? 0
                  : searchResult?.totalCount}
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
                  <Tflag
                    style={{
                      background: 'transparent',
                    }}
                  ></Tflag>
                  <ClickBox>
                    <Tnum>No</Tnum>
                    <Tdate>수강신청일</Tdate>
                    <Tname>수강생명</Tname>
                    <TsubDiv>수강구분</TsubDiv>
                    <TCode>과정코드</TCode>
                    <TsubjectName>과정명</TsubjectName>
                    <TManager>영업담당자</TManager>
                  </ClickBox>
                </TheaderBox>
              </Theader>
              {searchResult?.totalCount > 0 &&
                searchResult?.data.map((item, index) => (
                  <NonassignedItem
                    forName="student"
                    key={index}
                    tableData={item}
                    itemIndex={index}
                    currentPage={currentPage}
                    limit={currentLimit}
                  />
                ))}
              {searchResult.totalCount === 0 && (
                <Nolist>{assignment.unassigned} 수강생이 없습니다.</Nolist>
              )}
            </TableWrap>
          </ScrollShadow>
          {searchResult.totalCount > 0 && (
            <PagerWrap>
              <Pagination
                variant="light"
                showControls
                initialPage={currentPage}
                page={currentPage}
                total={Math.ceil(searchResult.totalCount / currentLimit)}
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
