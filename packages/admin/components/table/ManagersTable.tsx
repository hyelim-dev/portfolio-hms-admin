import { useSuspenseQuery } from '@apollo/client'
import { Pagination, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import {
  SEARCH_PERMISSIONS_GRANTED_QUERY,
  SEE_MANAGEUSER_QUERY,
} from '@/graphql/queries'
import {
  ResultSearchPermissionsGranted,
  SeeManageUserResult,
} from '@/src/generated/graphql'
import ManagersItem from '@/components/items/ManagersItem'
import useMmeQuery from '@/utils/mMe'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'

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
const Tavatar = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 6%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.06}px;
`

const Tid = styled.div`
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
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.09}px;
  font-weight: 600;
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
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
`
const Tphone = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Temail = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
`
const TjoiningDate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Tdate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.07}px;
  font-weight: 600;
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
type seeManageUser = {
  seeManageUser: SeeManageUserResult
}
type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function ManagersTable({ mGrade, mId }) {
  const grade = useRecoilValue(gradeState)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit] = useState(10)
  const { error, data, refetch } = useSuspenseQuery<seeManageUser>(
    SEE_MANAGEUSER_QUERY,
    {
      variables: { page: currentPage, limit: currentLimit },
    },
  )

  const managerData = data?.seeManageUser?.data
  const totalCount = data?.seeManageUser?.totalCount

  const { error: permissionError, data: permissionData } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          permissionName: '직원관리',
        },
      },
    )
  const permissionManagers =
    permissionData.searchPermissionsGranted.data[0].ManageUser.map(
      manager => manager.id,
    )

  useEffect(() => {
    refetch()
  }, [])

  if (error) {
    console.log(error)
  }

  return (
    managerData && (
      <>
        <TTopic>
          <Ttotal>
            총 <span>{totalCount}</span>건
          </Ttotal>
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
                    <Tpart>부서</Tpart>
                    <Trank>직책/직위</Trank>
                    <Tphone>내선번호</Tphone>
                    <Tphone>연락처</Tphone>
                    <Temail>이메일</Temail>
                    <TjoiningDate>입사일</TjoiningDate>
                    <Tdate>근속일</Tdate>
                  </ClickBox>
                </TheaderBox>
              </Theader>
              {totalCount > 0 ? (
                <>
                  {managerData?.map((item, index) => (
                    <ManagersItem
                      forName="student"
                      key={index}
                      tableData={item}
                      itemIndex={index}
                      currentPage={currentPage}
                      limit={currentLimit}
                      clickable={
                        mGrade <= grade.subMaster ||
                        permissionManagers.includes(mId)
                      }
                    />
                  ))}
                </>
              ) : (
                <Nolist>등록된 직원이 없습니다.</Nolist>
              )}

              {totalCount === 0 && <Nolist>등록된 직원이 없습니다.</Nolist>}
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
  )
}
