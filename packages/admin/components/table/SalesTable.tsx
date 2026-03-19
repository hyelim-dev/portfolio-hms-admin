import { useMutation } from '@apollo/client'
import { ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import SalesItem from '@/components/items/SalesItem'
import SalesTotalItem from '@/components/items/SalesTotalItem'
import { GET_HOURLY_SALES_MUTATION } from '@/graphql/mutations'

interface HourData {
  cardTotal: number
  cashTotal: number
  paymentTotal: number
  cardRefundTotal: number
  cashRefundTotal: number
  refundTotal: number
  totalAmount: number
  date: Date
}

interface HourlyData {
  [key: number]: HourData
}

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
  display: table;
  width: 100%;
`
const TcreatedAt = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.12}px;
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

export default function SalesTable({ salesFilter, days }) {
  const router = useRouter()
  const now = new Date()
  const [houralySales] = useMutation(GET_HOURLY_SALES_MUTATION)

  const [searchResult, setSearchResult] = useState(null)
  const [searchResultTotal, setSearchResultTotal] = useState(null)

  const tformatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  async function fetchData(salesFilter) {
    let result
    if (Object.keys(salesFilter).length !== 0) {
      result = await houralySales({
        variables: {
          date: [salesFilter[0], salesFilter[1]],
        },
      })
    } else {
      result = await houralySales({
        variables: {
          date: [
            new Date(new Date().setHours(0, 0, 0, 0)),
            new Date(new Date().setHours(23, 59, 59, 999)),
          ],
        },
      })
    }
    return result
  }

  const calculateHourlyData = (data: any[], days: number, startDate?: Date) => {
    const startDateCopy = startDate ? new Date(startDate) : new Date()
    let hourlyData: HourlyData = Object.fromEntries(
      Array.from({ length: days === 0 ? 24 : days + 1 }, (_, i) => {
        const currentDate = new Date(startDateCopy)
        currentDate.setDate(startDateCopy.getDate() + i)
        const key = days === 0 ? `${i}시` : `${currentDate.getDate()}시`
        return [
          key,
          {
            cardTotal: 0,
            cashTotal: 0,
            paymentTotal: 0,
            cardRefundTotal: 0,
            cashRefundTotal: 0,
            refundTotal: 0,
            totalAmount: 0,
            date: days === 0 ? startDateCopy : currentDate,
          },
        ]
      }),
    )
    data.forEach(item => {
      const itemDate = new Date(parseInt(item.nowDate))
      const col = days === 0 ? itemDate.getHours() : itemDate.getDate()
      const { currentState, cashOrCard, amount } = item
      const isPayment = currentState === '결제'
      const isCard = cashOrCard === '카드'

      if (!hourlyData[`${col}시`]) {
        hourlyData[`${col}시`] = {
          cardTotal: 0,
          cashTotal: 0,
          paymentTotal: 0,
          cardRefundTotal: 0,
          cashRefundTotal: 0,
          refundTotal: 0,
          totalAmount: 0,
          date: itemDate,
        }
      }

      if (isPayment) {
        hourlyData[`${col}시`][isCard ? 'cardTotal' : 'cashTotal'] += amount
      } else {
        hourlyData[`${col}시`][
          isCard ? 'cardRefundTotal' : 'cashRefundTotal'
        ] += amount
      }
      hourlyData[`${col}시`]['date'] = itemDate
    })

    Object.values(hourlyData).forEach(hourData => {
      const { cardTotal, cashTotal, cardRefundTotal, cashRefundTotal } =
        hourData
      hourData['paymentTotal'] = cardTotal + cashTotal
      hourData['refundTotal'] =
        Math.abs(cardRefundTotal) + Math.abs(cashRefundTotal)
      hourData['totalAmount'] =
        hourData['paymentTotal'] - hourData['refundTotal']
    })

    return hourlyData
  }

  useEffect(() => {
    fetchData(salesFilter)
      .then(result => {
        const {
          hourlyDetails,
          thisTimeRefundTotal,
          thisTimeRealTotal,
          thisTimeAmountTotal,
          hourlyTotalCashRefund,
          hourlyTotalCash,
          hourlyTotalCardRefund,
          hourlyTotalCard,
        } = result.data.getHourlySalesData
        const resData = calculateHourlyData(
          hourlyDetails,
          days,
          salesFilter?.[0],
        )
        setSearchResult(resData)
        setSearchResultTotal({
          thisTimeRefundTotal: thisTimeRefundTotal,
          thisTimeRealTotal: thisTimeRealTotal,
          thisTimeAmountTotal: thisTimeAmountTotal,
          hourlyTotalCashRefund: hourlyTotalCashRefund,
          hourlyTotalCash: hourlyTotalCash,
          hourlyTotalCardRefund: hourlyTotalCardRefund,
          hourlyTotalCard: hourlyTotalCard,
        })
      })
      .catch(error => {
        console.error('Error occurred during data fetching:', error)
      })
  }, [salesFilter])

  const formatDate = data => {
    const date = new Date(data)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  return (
    searchResult !== null && (
      <>
        <TTopic>
          <Ttotal>
            검색 기간&nbsp;:&nbsp;
            {Object.keys(salesFilter).length === 0 ? (
              <>
                <span>{formatDate(new Date())}</span> -
                <span>{formatDate(new Date())}</span>
              </>
            ) : (
              <>
                <span>{formatDate(salesFilter[0])}</span> -
                <span>{formatDate(salesFilter[1])}</span>
              </>
            )}
          </Ttotal>
        </TTopic>
        <TableArea>
          <ScrollShadow orientation="horizontal" className="scrollbar">
            <TableWrap>
              <Theader>
                <TheaderBox>
                  <TcreatedAt>결제일시</TcreatedAt>
                  <Tamount>카드 결제금액</Tamount>
                  <Tamount>현금 결제금액</Tamount>
                  <Tamount>결제 합계</Tamount>
                  <Tamount>카드 환불금액</Tamount>
                  <Tamount>현금 환불금액</Tamount>
                  <Tamount>환불 홥계</Tamount>
                  <Tamount>총 매출액</Tamount>
                </TheaderBox>
              </Theader>
              {Object.entries(searchResult).map(([col, hourData]) => (
                <SalesItem
                  key={col}
                  col={col}
                  daily={days === 0 ? true : false}
                  tableData={hourData}
                />
              ))}
              <SalesTotalItem tableData={searchResultTotal} />
            </TableWrap>
          </ScrollShadow>
        </TableArea>
      </>
    )
  )
}
