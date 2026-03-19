import { useMutation } from '@apollo/client'
import { Checkbox, Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import ConsultItem from '@/components/items/ConsultItem'
import { SEARCH_STUDENTSTATE_MUTATION } from '@/graphql/mutations'

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
const Tfavorite = styled.div`
  display: table-cell;
  font-size: inherit;
  color: inherit;
  min-width: 62px;
  padding: 1rem 1rem 1rem 1.5rem;
`
const ClickBox = styled.div`
  display: table;
  width: 100%;
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
const TreceiptDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const TsubDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const TadviceType = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
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
  font-weight: 600;
`
const Tphone = styled.div`
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
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
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
const TstVisit = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 16%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.16}px;
  font-weight: 600;
`
const Tprogress = styled.div`
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

export default function ConsultRegisteredTable({
  currentLimit,
  currentPage,
  setCurrentPage,
  searchResult,
  setSearchResult,
  checkItem,
  setCheckItem,
}) {
  const [searchStudentStateMutation] = useMutation(SEARCH_STUDENTSTATE_MUTATION)
  const [allCheck, setAllCheck] = useState(false)

  const rejectAllCheck = () => {
    const allId = searchResult?.studentState.map(item => item.id) || []

    if (!allCheck) {
      const set = new Set([...checkItem, ...allId])
      const newSelectedItems = Array.from(set)
      setCheckItem(newSelectedItems)
    } else {
      const newSelectedItems = checkItem.filter(x => !allId.includes(x))
      setCheckItem(newSelectedItems)
    }
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    searchStudentStateMutation({
      variables: {
        progress: 60,
        page: currentPage,
        limit: currentLimit,
      },
      onCompleted: resData => {
        if (resData.searchStudentState.ok) {
          const { studentState, totalCount } = resData.searchStudentState || {}
          setSearchResult({ studentState, totalCount })
          handleScrollTop()
        }
      },
    })
  }, [currentPage])

  useEffect(() => {
    const allId = searchResult?.studentState.map(item => item.id) || []
    const equalArray = allId?.filter(x => checkItem.includes(x))
    if (equalArray?.length === allId?.length) {
      setAllCheck(true)
    } else {
      setAllCheck(false)
    }
  }, [checkItem, searchResult, currentPage])

  return (
    searchResult !== null && (
      <>
        <TTopic>
          <TopBox>
            <Ttotal>
              총 <span>{searchResult?.totalCount}</span>건
            </Ttotal>
          </TopBox>
        </TTopic>
        <TableArea>
          <ScrollShadow orientation="horizontal" className="scrollbar">
            <TableWrap>
              <Theader>
                <TheaderBox>
                  <Tfavorite>
                    <Checkbox
                      classNames={{
                        base: 'opacity-[.8]',
                        wrapper: 'before:border-[#111] mr-0',
                      }}
                      isSelected={allCheck}
                      onValueChange={() => {
                        setAllCheck(!allCheck)
                        rejectAllCheck()
                      }}
                    ></Checkbox>
                  </Tfavorite>
                  <ClickBox>
                    <Tnum>No</Tnum>
                    <TcreatedAt>등록일시</TcreatedAt>
                    <TreceiptDiv>접수구분</TreceiptDiv>
                    <Tname>이름</Tname>
                    <Tphone>연락처</Tphone>
                    <TsubDiv>수강구분</TsubDiv>
                    <TadviceType>상담분야</TadviceType>
                    <Tprogress>진행상태</Tprogress>
                    <TstVisit>상담예정일</TstVisit>
                    <Tmanager>담당자</Tmanager>
                  </ClickBox>
                </TheaderBox>
              </Theader>

              {searchResult?.totalCount > 0 &&
                searchResult?.studentState?.map((item, index) => (
                  <ConsultItem
                    key={index}
                    tableData={item}
                    itemIndex={index}
                    currentPage={currentPage}
                    limit={currentLimit}
                    checkBtn={true}
                    checkItem={checkItem}
                    setCheckItem={setCheckItem}
                  />
                ))}
              {searchResult?.totalCount === 0 && (
                <Nolist>완료된 상담카드가 없습니다.</Nolist>
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
  )
}
