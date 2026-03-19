import { useMutation, useSuspenseQuery } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'

import { SEARCH_STUDENTSTATE_MUTATION } from '@/graphql/mutations'
import { MME_QUERY, SEE_FAVORITESTATE_QUERY } from '@/graphql/queries'
import { consultFilterLimitState, consultPageState } from '@/lib/recoilAtoms'
import { useRecoilState } from 'recoil'
import { ManageUser, StudentState } from '@/src/generated/graphql'
import TableTopInfo from '@/components/common/TableTopInfo'
import ConsultItem from '@/components/items/ConsultItem'
import { useRouter } from 'next/router'

const TableArea = styled.div`
  margin-top: 0.5rem;
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

type mmeFavoQuery = {
  mMe: ManageUser
}
type seeFavoriteState = {
  seeFavorite: StudentState[]
}
export default function ConsultationFilterTable({
  studentManagerFilter,
  mUsername,
  filterSearch,
}) {
  const router = useRouter()
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useRecoilState(consultPageState)
  const [currentLimit, setCurrentLimit] = useRecoilState(
    consultFilterLimitState,
  )
  const [searchStudentStateMutation] = useMutation(SEARCH_STUDENTSTATE_MUTATION)
  const [searchResult, setSearchResult] = useState(null)
  const { error: MMeError, data: MMeData } =
    useSuspenseQuery<mmeFavoQuery>(MME_QUERY)
  const FavoList = MMeData?.mMe.favoriteStudentState
  // const { error, data: seeFavoData } = useSuspenseQuery<seeFavoriteState>(
  //   SEE_FAVORITESTATE_QUERY,
  // )
  // const favoData = seeFavoData?.seeFavorite || []
  // const favoTotal = favoData?.length || 0

  useEffect(() => {
    searchStudentStateMutation({
      variables: {
        ...studentManagerFilter,
        pic: mUsername,
        page: currentPage,
        perPage: currentLimit,
      },
      onCompleted: resData => {
        if (resData.searchStudentState.ok) {
          const { studentState, totalCount } = resData.searchStudentState || {}
          setSearchResult({ studentState, totalCount })
        }
      },
    })
  }, [router, studentManagerFilter, currentPage, currentLimit])

  const resetList = () => {
    window.location.href = '/consult'
  }

  // if (error) {
  //   console.log(error)
  // }
  if (MMeError) {
    console.log(MMeError)
  }

  return (
    <>
      <TableTopInfo
        totalCount={searchResult?.totalCount}
        currentLimit={currentLimit}
        setCurrentLimit={setCurrentLimit}
        resetList={filterSearch ? resetList : null}
        colorInfo={[
          {
            background: theme.colors.primary,
            text: '신규',
          },
          { background: theme.colors.accent, text: '접수대기' },
        ]}
      />
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <Tfavorite>
                  <i className="xi-star"></i>
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

            {searchResult?.studentState?.map((item, index) => (
              <ConsultItem
                key={index}
                tableData={item}
                itemIndex={index}
                currentPage={currentPage}
                limit={currentLimit}
                // favorite={FavoList?.includes(item.id)}
                // favoTotal={favoTotal}
              />
            ))}
            {searchResult?.totalCount === 0 && (
              <Nolist>
                {filterSearch
                  ? '검색결과가 없습니다.'
                  : '배정된 상담이 없습니다.'}
              </Nolist>
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
