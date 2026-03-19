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

const ClickBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const TrequestAt = styled.div<{ $width: number }>`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${props => props.$width * 0.12}px;
`
const Tmanager = styled.div<{ $width: number }>`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${props => props.$width * 0.12}px;
`
const Tname = styled.div<{ $width: number }>`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${props => props.$width * 0.1}px;
  font-weight: 600;
`
const Tsubject = styled.div<{ $width: number }>`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 31%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${props => props.$width * 0.31}px;
`
const Tpayment = styled.div<{ $width: number }>`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${props => props.$width * 0.09}px;
`
const TpaymentName = styled.div<{ $width: number }>`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${props => props.$width * 0.12}px;
`
const Tamount = styled.div<{ $width: number }>`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 14%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${props => props.$width * 0.14}px;
  font-weight: 600;

  &.card {
    color: ${({ theme }) => theme.colors.accent};
  }
  &.cash {
    color: ${({ theme }) => theme.colors.primary};
  }
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function RefundItem(props) {
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const studentPayment = props.tableData
  const student = studentPayment.studentPayment || []

  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(DataDate).toLocaleDateString()
    return LocalDdate
  }
  const feeFormet = fee => {
    const result = String(fee).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  return (
    <>
      <ClickBox>
        <TrequestAt $width={props.width}>
          <EllipsisBox>
            {studentPayment?.reqRefundDate
              ? getDate(studentPayment?.reqRefundDate)
              : '-'}
          </EllipsisBox>
        </TrequestAt>
        <Tmanager $width={props.width}>
          <EllipsisBox>{studentPayment?.reqRefundManager}</EllipsisBox>
        </Tmanager>
        <Tname $width={props.width}>
          <EllipsisBox>{studentPayment?.stName}</EllipsisBox>
        </Tname>
        <Tsubject $width={props.width}>
          <EllipsisBox>{student?.subject?.subjectName}</EllipsisBox>
        </Tsubject>
        <Tpayment $width={props.width}>
          <EllipsisBox>{studentPayment?.cashOrCard}</EllipsisBox>
        </Tpayment>
        <TpaymentName $width={props.width}>
          <EllipsisBox>
            {studentPayment?.cashOrCard === '카드'
              ? studentPayment?.cardCompany
              : studentPayment?.bankName}
          </EllipsisBox>
        </TpaymentName>
        <Tamount
          $width={props.width}
          className={studentPayment.cashOrCard === '카드' ? 'card' : 'cash'}
        >
          <EllipsisBox>
            {studentPayment?.cashOrCard === '카드'
              ? feeFormet(studentPayment?.amountPayment)
              : feeFormet(studentPayment?.depositAmount)}
          </EllipsisBox>
        </Tamount>
      </ClickBox>
    </>
  )
}
