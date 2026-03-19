import { Pagination, ScrollShadow } from '@nextui-org/react'
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

export default function NonassignedTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(10)
  const assignment = useRecoilValue(assignmentState)
  const [searchStudentNonassigned] = useMutation(
    SEARCH_STUDENT_NONASSIGNED_MUTATION,
  )
  const [resultData, setResultData] = useState(null)

  useEffect(() => {
    searchStudentNonassigned({
      variables: {
        lectureAssignment: assignment.unassigned,
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
    resultData && (
      <>
        <TTopic>
          <Ttotal>
            총 <span>{resultData.totalCount}</span>건
          </Ttotal>
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
              {resultData?.totalCount > 0 &&
                resultData?.data.map((item, index) => (
                  <NonassignedItem
                    forName="student"
                    key={index}
                    tableData={item}
                    itemIndex={index}
                    currentPage={currentPage}
                    limit={currentLimit}
                  />
                ))}
              {resultData.totalCount === 0 && (
                <Nolist>{assignment.unassigned} 수강생이 없습니다.</Nolist>
              )}
            </TableWrap>
          </ScrollShadow>
          {resultData.totalCount > 0 && (
            <PagerWrap>
              <Pagination
                variant="light"
                showControls
                initialPage={currentPage}
                page={currentPage}
                total={Math.ceil(resultData.totalCount / currentLimit)}
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
