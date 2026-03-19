import { useSuspenseQuery } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { Fragment, useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import ConsultItem from '@/components/items/ConsultItem'
import {
  MME_FAVO_QUERY,
  SEE_FAVORITESTATE_QUERY,
  SEE_STUDENT_STATE_QUERY,
} from '@/graphql/queries'
import FavoItem from '@/components/items/FavoItem'
import router from 'next/router'
import { useRecoilState } from 'recoil'
import { consultLimitState, consultPageState } from '@/lib/recoilAtoms'
import {
  ManageUser,
  StudentState,
  StudentStateResponse,
} from '@/src/generated/graphql'
import TableTopInfo from '@/components/common/TableTopInfo'

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

type seeStudentState = {
  seeStudentState: StudentStateResponse
}
type mmeFavoQuery = {
  mMe: ManageUser
}
// type seeFavoriteState = {
//   seeFavorite: StudentState[]
// }

export default function ConsultationTable() {
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useRecoilState(consultPageState)
  const [currentLimit, setCurrentLimit] = useRecoilState(consultLimitState)
  const [totalCount, setTotalCount] = useState(0)
  const { error, data, refetch } = useSuspenseQuery<seeStudentState>(
    SEE_STUDENT_STATE_QUERY,
    {
      variables: { page: currentPage, limit: currentLimit },
    },
  )
  const { error: MMeFavoError, data: MMeFavoData } =
    useSuspenseQuery<mmeFavoQuery>(MME_FAVO_QUERY)
  const FavoList = MMeFavoData?.mMe.favoriteStudentState
  // const {
  //   error: seeFavoError,
  //   data: seeFavoData,
  //   refetch: favoRefetch,
  // } = useSuspenseQuery<seeFavoriteState>(SEE_FAVORITESTATE_QUERY)
  const studentsData = data?.seeStudentState
  const students = studentsData?.studentState
  // const favoData = seeFavoData?.seeFavorite
  // const favoTotal = favoData?.length

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    setTotalCount(studentsData.totalCount)
  }, [studentsData, totalCount])

  useEffect(() => {
    handleScrollTop()
  }, [currentPage])

  useEffect(() => {
    const handleRouteChange = () => {
      refetch()
      // favoRefetch()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  if (error) {
    console.log(error)
  }
  // if (seeFavoError) {
  //   console.log(seeFavoError)
  // }
  if (MMeFavoError) {
    console.log(MMeFavoError)
  }

  return (
    <>
      <TableTopInfo
        totalCount={studentsData?.totalCount}
        currentLimit={currentLimit}
        setCurrentLimit={setCurrentLimit}
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

            {/* {favoTotal > 0 &&
              favoData?.map((item, index) => (
                <Fragment key={index}>
                  <FavoItem
                    forName="favo"
                    tableData={item}
                    itemIndex={index}
                    favorite={FavoList?.includes(item.id)}
                  />
                </Fragment>
              ))}
            {favoTotal > 0 && <br />} */}
            {totalCount > 0 &&
              students?.map((item, index) => (
                <ConsultItem
                  forName="student"
                  key={index}
                  tableData={item}
                  itemIndex={index}
                  currentPage={currentPage}
                  limit={currentLimit}
                  // favorite={FavoList?.includes(item.id)}
                  // favoTotal={favoTotal}
                />
              ))}
            {totalCount === 0 && <Nolist>등록된 상담카드가 없습니다.</Nolist>}
          </TableWrap>
        </ScrollShadow>
        {totalCount > 0 && (
          <PagerWrap>
            <Pagination
              variant="light"
              showControls
              initialPage={currentPage}
              page={currentPage}
              total={Math.ceil(totalCount / currentLimit)}
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
