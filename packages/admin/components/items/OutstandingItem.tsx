import { styled } from 'styled-components'
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
const Tamount = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;

  &.fee {
    color: #7dce00;
  }
  &.discount {
    color: #f85294;
  }
  &.actual {
    color: #0eacab;
  }
  &.unpaid {
    color: ${({ theme }) => theme.colors.accent};
  }
  &.amount {
    color: #043999;
  }
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.08}px;
`
const Tsubject = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 21%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.21}px;
`
const TcreatedAt = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
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
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function OutstandingItem(props) {
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const payment = props.tableData

  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    return LocalDdate
  }

  const feeFormet = fee => {
    const result = String(fee).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <Link href={`/students/detail/course/${payment.id}`}>
            <ClickBox>
              <Tnum>{(props.currentPage - 1) * conLimit + (conIndex + 1)}</Tnum>
              <TcreatedAt>
                <EllipsisBox>
                  {payment?.createdAt ? getDate(payment?.createdAt) : '-'}
                </EllipsisBox>
              </TcreatedAt>
              <Tname>
                <EllipsisBox>{payment?.student?.name}</EllipsisBox>
              </Tname>
              <Tmanager>
                <EllipsisBox>
                  {payment?.processingManager.mUsername
                    ? payment?.processingManager.mUsername
                    : '-'}
                </EllipsisBox>
              </Tmanager>
              <Tsubject>
                <EllipsisBox>{`[${payment?.subject?.round}회차] ${payment?.subject?.subjectName}`}</EllipsisBox>
              </Tsubject>
              <Tamount className="fee">
                <EllipsisBox>
                  {payment?.tuitionFee === undefined ||
                  payment?.tuitionFee === null
                    ? '0'
                    : feeFormet(payment?.tuitionFee)}
                </EllipsisBox>
              </Tamount>
              <Tamount className="discount">
                <EllipsisBox>
                  {payment?.discountAmount === undefined ||
                  payment?.discountAmount === null ||
                  payment?.discountAmount === '0%' ||
                  payment?.discountAmount === '0원'
                    ? '0'
                    : feeFormet(payment?.discountAmount)}
                </EllipsisBox>
              </Tamount>
              <Tamount className="actual">
                <EllipsisBox>
                  {payment?.actualAmount === undefined ||
                  payment?.actualAmount === null
                    ? '0'
                    : feeFormet(payment?.actualAmount)}
                </EllipsisBox>
              </Tamount>
              <Tamount className="unpaid">
                <EllipsisBox>
                  {payment?.unCollectedAmount === undefined ||
                  payment?.unCollectedAmount === null
                    ? '0'
                    : feeFormet(payment?.unCollectedAmount)}
                </EllipsisBox>
              </Tamount>
              <Tamount className="amount">
                <EllipsisBox>
                  {payment?.amountReceived === undefined ||
                  payment?.amountReceived === null
                    ? '0'
                    : feeFormet(payment?.amountReceived)}
                </EllipsisBox>
              </Tamount>
            </ClickBox>
          </Link>
        </TableRow>
      </TableItem>
    </>
  )
}
