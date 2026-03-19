import { useRouter } from 'next/router'
import { styled } from 'styled-components'

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
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-bottom: 0;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;
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
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.07}px;
`
const Tamount = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
  color: #043999;

  &.refund {
    color: ${({ theme }) => theme.colors.accent};
  }
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
`
const Tsubject = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.5}px;
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
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function PerformanceItem(props) {
  const router = useRouter()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const payment = props.tableData

  const getDate = (DataDate: string, refund: boolean): string => {
    let LocalDdate
    if (refund) {
      LocalDdate = new Date(DataDate).toLocaleDateString()
    } else {
      LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    }
    return LocalDdate
  }
  const feeFormet = fee => {
    const result = String(fee).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  const clickLink = e => {
    if (payment?.refundApproval) {
      e.preventDefault()
    } else {
      router.push(`/students/edit/payment/${payment.id}`, undefined, {
        shallow: true,
      })
    }
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <ClickBox>
            <Tnum>{(props.currentPage - 1) * conLimit + (conIndex + 1)}</Tnum>
            <TcreatedAt>
              <EllipsisBox>
                {payment?.refundApproval
                  ? payment?.refundApprovalDate
                    ? getDate(
                        payment?.refundApprovalDate,
                        payment?.refundApproval,
                      )
                    : '-'
                  : payment?.paymentDate
                  ? getDate(payment?.paymentDate, payment?.refundApproval)
                  : '-'}
              </EllipsisBox>
            </TcreatedAt>
            <Tamount className={payment?.refundApproval ? 'refund' : ''}>
              <EllipsisBox>
                {payment?.amountPayment === undefined ||
                payment?.amountPayment === null ||
                payment?.amountPayment === 0
                  ? '0'
                  : payment?.refundApproval
                  ? `-${feeFormet(payment?.amountPayment)}`
                  : feeFormet(payment?.amountPayment)}
              </EllipsisBox>
            </Tamount>
            <Tamount className={payment?.refundApproval ? 'refund' : ''}>
              <EllipsisBox>
                {payment?.depositAmount === undefined ||
                payment?.depositAmount === null ||
                payment?.depositAmount === 0
                  ? '0'
                  : payment?.refundApproval
                  ? `-${feeFormet(payment?.depositAmount)}`
                  : feeFormet(payment?.depositAmount)}
              </EllipsisBox>
            </Tamount>
            <Tsubject>
              <EllipsisBox>{`[${payment?.studentPayment?.subject?.round}회차] ${payment?.studentPayment?.subject?.subjectName}`}</EllipsisBox>
            </Tsubject>
            <Tname>
              <EllipsisBox>{payment?.stName}</EllipsisBox>
            </Tname>
          </ClickBox>
        </TableRow>
      </TableItem>
    </>
  )
}
