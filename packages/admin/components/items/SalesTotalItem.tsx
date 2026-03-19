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
  background: rgba(226, 226, 229, 0.5);
`
const TcreatedAt = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.12}px;
`
const Tamount = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 11%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.11}px;
  font-weight: 600;

  &.payment {
    background: rgba(0, 125, 233, 0.15);
  }

  &.refund {
    background: rgba(255, 89, 0, 0.15);
  }
  &.total {
    background: rgba(226, 226, 229, 0.5);
  }
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function SalesTotalItem(props) {
  const salesData = props.tableData

  const feeFormet = fee => {
    const result = String(fee).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  return (
    salesData !== null && (
      <>
        <TableItem>
          <TableRow>
            <TcreatedAt>
              <EllipsisBox>합계</EllipsisBox>
            </TcreatedAt>
            <Tamount className="payment">
              <EllipsisBox>{feeFormet(salesData.hourlyTotalCard)}</EllipsisBox>
            </Tamount>
            <Tamount className="payment">
              <EllipsisBox>{feeFormet(salesData.hourlyTotalCash)}</EllipsisBox>
            </Tamount>
            <Tamount className="payment">
              <EllipsisBox>
                {feeFormet(salesData.thisTimeAmountTotal)}
              </EllipsisBox>
            </Tamount>
            <Tamount className="refund">
              {feeFormet(salesData.hourlyTotalCardRefund)}
            </Tamount>
            <Tamount className="refund">
              <EllipsisBox>
                {feeFormet(salesData.hourlyTotalCashRefund)}
              </EllipsisBox>
            </Tamount>
            <Tamount className="refund">
              <EllipsisBox>
                {feeFormet(salesData.thisTimeRefundTotal)}
              </EllipsisBox>
            </Tamount>
            <Tamount className="total">
              <EllipsisBox>
                <b>{feeFormet(salesData.thisTimeRealTotal)}</b>
              </EllipsisBox>
            </Tamount>
          </TableRow>
        </TableItem>
      </>
    )
  )
}
