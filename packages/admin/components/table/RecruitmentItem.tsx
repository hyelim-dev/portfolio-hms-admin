import { styled, useTheme } from 'styled-components'
import Link from 'next/link'

type ConsultItemProps = {
  tableData: {
    adviceTypes: any
    id: number
    stName: string
    phoneNum1: string
    progress: number
    subDiv: string
    stVisit: string
    createdAt: string
    receiptDiv: string
    pic: string
  }
  forName?: string
  itemIndex: number
  currentPage: number
  limit?: number
  favorite?: boolean
  favoTotal?: number
  flagNum?: number
  checkBtn?: boolean
  checkItem?: number[]
  setCheckItem?: (newItems: number[]) => void
}

const TableItem = styled.div`
  position: relative;
  display: table;
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
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
  /* display: grid;
  width: 100%;
  grid-template-columns: 0.5rem auto; */
`
const ClickBox = styled.div`
  display: flex;
  width: 100%;
`
const Tflag = styled.div`
  display: table-cell;
  width: 0.5rem;
  height: 100%;
  min-width: 7px;
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
`
const Tname = styled.div`
  display: table-cell;
  text-align: center;
  width: 55%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.55}px;
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
`
const Tstudent = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
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
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function RecruitmentItem(props) {
  const theme = useTheme()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const subject = props.tableData

  const isDisplayFlag = (date: string): string => {
    const currentDate = new Date()
    const registeredDate = new Date(parseInt(date))
    const differenceInDays = Math.floor(
      (currentDate.getTime() - registeredDate.getTime()) /
        (1000 * 60 * 60 * 24),
    )

    if (differenceInDays >= 0) {
      return theme.colors.primary
    } else {
      return theme.colors.gray
    }
  }
  const flagString = isDisplayFlag(subject.startDate)

  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    return LocalDdate
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <Tflag
            style={{
              background: flagString,
            }}
          ></Tflag>
          <Link href={`/subjects/detail/${subject.id}`}>
            <ClickBox>
              <Tnum>
                <EllipsisBox>
                  {(props.currentPage - 1) * conLimit + (conIndex + 1)}
                </EllipsisBox>
              </Tnum>
              <Tname>
                <EllipsisBox>{`[${subject.round}회차] ${subject.subjectName}`}</EllipsisBox>
              </Tname>
              <Tstudent>
                <EllipsisBox>0</EllipsisBox>
              </Tstudent>
              <Tdate>
                <EllipsisBox>
                  {subject.startDate ? getDate(subject.startDate) : '-'}
                </EllipsisBox>
              </Tdate>
              <Tdate>
                <EllipsisBox>
                  {subject.endDate ? getDate(subject.endDate) : '-'}
                </EllipsisBox>
              </Tdate>
              <Tteacher>
                <EllipsisBox>
                  {subject.teacherName ? subject.teacherName : '-'}
                </EllipsisBox>
              </Tteacher>
            </ClickBox>
          </Link>
        </TableRow>
      </TableItem>
    </>
  )
}
