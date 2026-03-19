import { styled } from 'styled-components'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const TableItem = styled.div`
  position: relative;
  width: 100%;
  min-width: fit-content;
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
  position: relative;
  display: table;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
  /* display: grid;
  width: 100%;
  grid-template-columns: 0.5rem 2% auto; */
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
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function NonassignedItem(props) {
  const router = useRouter()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const student = props.tableData
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <Tflag
            style={{
              background: 'transparent',
            }}
          ></Tflag>
          <Link href={`/students/detail/course/${student.id}`}>
            <ClickBox>
              <Tnum>
                <EllipsisBox>
                  {(props.currentPage - 1) * conLimit + (conIndex + 1)}
                </EllipsisBox>
              </Tnum>
              <Tdate>
                <EllipsisBox>{formatDate(student?.createdAt)}</EllipsisBox>
              </Tdate>
              <Tname>
                <EllipsisBox>{student?.student?.name}</EllipsisBox>
              </Tname>
              <TsubDiv>
                <EllipsisBox>{student?.subDiv}</EllipsisBox>
              </TsubDiv>
              <TCode>{student?.subject?.subjectCode}</TCode>
              <TsubjectName>
                <EllipsisBox>
                  {`[${student?.subject?.round}회차] ${student?.subject?.subjectName}`}
                </EllipsisBox>
              </TsubjectName>
              <TManager>{student?.processingManager?.mUsername}</TManager>
            </ClickBox>
          </Link>
        </TableRow>
      </TableItem>
    </>
  )
}
