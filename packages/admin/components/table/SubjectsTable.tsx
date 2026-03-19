import { useSuspenseQuery } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { SEE_SUBJECT_QUERY } from '@/graphql/queries'
import router from 'next/router'
import { useRecoilState } from 'recoil'
import { subjectPageState } from '@/lib/recoilAtoms'
import { SeeSubjectResult } from '@/src/generated/graphql'
import SubjectsItem from '@/components/items/SubjectsItem'

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
const ColorHelp = styled.div`
  display: flex;
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
`
const TableWrap = styled.div`
  width: 100%;
  display: block;
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
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
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
  vertical-align: middle;
`
const Tdiv = styled.div`
  display: table-cell;

  > div {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 53px;
  }
`
const Tname = styled.div`
  display: table-cell;
  text-align: center;
  width: 60%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 360px;
`
const TsubDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 17%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 102px;
`
const Tfee = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 23%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 132px;
  vertical-align: middle;
`
const Texposure = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
  vertical-align: middle;
  i {
    font-size: 1rem;
  }
`
const Tdate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
  vertical-align: middle;
`
const Troom = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.07}px;
  vertical-align: middle;
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
  vertical-align: middle;
`
const OnExposure = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`
const OffExposure = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  opacity: 0.5;
`
const TableItem = styled.div`
  display: table;
  position: relative;
  width: 100%;
  min-width: fit-content;
  flex-wrap: nowrap;
  row-gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);
  }
`
const TableRow = styled.div`
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
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

type seeSubjectQuery = {
  seeSubject: SeeSubjectResult
}

export default function SubjectsTable() {
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useRecoilState(subjectPageState)
  const [currentLimit] = useState(10)
  const { error, data, refetch } = useSuspenseQuery<seeSubjectQuery>(
    SEE_SUBJECT_QUERY,
    {
      variables: { page: currentPage, limit: currentLimit },
    },
  )
  const subjectTotal = data?.seeSubject.totalCount
  const subjectData = data?.seeSubject.subject

  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    return LocalDdate
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    handleScrollTop()
  }, [currentPage])

  useEffect(() => {
    const handleRouteChange = () => {
      refetch()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  if (error) {
    console.log(error)
  }

  return (
    <>
      <TTopic>
        <Ttotal>
          총 <span>{subjectTotal}</span>건
        </Ttotal>
        <ColorHelp>
          <ColorCip>
            <span style={{ background: theme.colors.primary }}></span> : 노출
          </ColorCip>
          <ColorCip>
            <span
              style={{ background: theme.colors.gray, opacity: '0.8' }}
            ></span>{' '}
            : 미노출
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
                <Tdiv>
                  <div>
                    <Tname>과정명</Tname>
                    <TsubDiv>수강구분</TsubDiv>
                    <Tfee>수강료</Tfee>
                  </div>
                </Tdiv>
                <Texposure>노출여부</Texposure>
                <Tdate>개강일</Tdate>
                <Tdate>종강일</Tdate>
                <Troom>강의실</Troom>
                <Tteacher>강사명</Tteacher>
              </TheaderBox>
            </Theader>
            {subjectTotal > 0 &&
              subjectData?.map((item, index) => (
                <TableItem
                  key={index}
                  onClick={() =>
                    router.push(
                      {
                        pathname: `/subjects/detail/${item.id}`,
                        query: { page: currentPage, limit: currentLimit },
                      },
                      `/subjects/detail/${item.id}`,
                    )
                  }
                >
                  <TableRow>
                    <Tflag
                      style={{
                        background: item.exposure
                          ? theme.colors.primary
                          : theme.colors.gray,
                        opacity: item.exposure ? '1' : '0.8',
                      }}
                    ></Tflag>

                    <Tnum>
                      {(currentPage - 1) * currentLimit + (index + 1)}
                    </Tnum>
                    <Tdiv>
                      <div>
                        <SubjectsItem tableData={item} />
                      </div>
                    </Tdiv>
                    <Texposure>
                      {item.exposure ? (
                        <OnExposure>
                          <i className="xi-check-circle" />
                        </OnExposure>
                      ) : (
                        <OffExposure>
                          <i className="xi-check-circle " />
                        </OffExposure>
                      )}
                    </Texposure>
                    <Tdate>
                      {item.startDate ? getDate(item.startDate) : '-'}
                    </Tdate>
                    <Tdate>{item.endDate ? getDate(item.endDate) : '-'}</Tdate>
                    <Troom>{item.roomNum ? item.roomNum : '-'}</Troom>
                    <Tteacher>{item.teacherName}</Tteacher>
                  </TableRow>
                </TableItem>
              ))}
            {subjectTotal === 0 && <Nolist>등록된 과정이 없습니다.</Nolist>}
          </TableWrap>
        </ScrollShadow>
        {subjectTotal > 0 && (
          <PagerWrap>
            <Pagination
              variant="light"
              showControls
              initialPage={currentPage}
              page={currentPage}
              total={Math.ceil(subjectTotal / currentLimit)}
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
