import { ScrollShadow } from '@nextui-org/react'
import { styled } from 'styled-components'
import AbsentItem from '@/components/table/AbsentItem'
import { Suspense } from 'react'

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

const Tbody = styled.div`
  max-height: 1100px;
`

const ClickBox = styled.div`
  display: flex;
  width: 100%;
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 0.5rem;
  font-size: inherit;
  min-width: ${1200 * 0.12}px;
`

const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function AbsentList({ lectureId, lectureDates, sortStudents }) {
  return (
    <>
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <ClickBox>
                  <Tname>이름</Tname>
                  <Tnum>훈련일수</Tnum>
                  <Tnum>출석</Tnum>
                  <Tnum>지각</Tnum>
                  <Tnum>외출</Tnum>
                  <Tnum>조퇴</Tnum>
                  <Tnum>결석</Tnum>
                  <Tnum>출석률</Tnum>
                  <Tnum>지각룰</Tnum>
                  <Tnum>외출률</Tnum>
                  <Tnum>조퇴율</Tnum>
                  <Tnum>결석률</Tnum>
                </ClickBox>
              </TheaderBox>
            </Theader>
            <Tbody>
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <AbsentItem
                  lectureId={lectureId}
                  lectureDates={lectureDates}
                  sortStudents={sortStudents}
                />
              </Suspense>
            </Tbody>
          </TableWrap>
        </ScrollShadow>
      </TableArea>
    </>
  )
}
