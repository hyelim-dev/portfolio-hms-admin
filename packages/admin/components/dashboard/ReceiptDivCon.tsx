import { styled } from 'styled-components'
import { Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
// import { useSuspenseQuery } from '@apollo/client'
// import { DASHBOARD_RD_QUERY } from '@/graphql/queries'
// import { DashboardRdResult } from '@/src/generated/graphql'
import { useRouter } from 'next/router'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ItemBox = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray};

  span {
    font-size: 0.7rem;
  }
`
const ToolTipBox = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1.2rem;
`
const DashTooltip = styled.div`
  padding: 0.25rem 0.5rem;
`
const DashTooltipTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
`
const DashTooltipCon = styled.p`
  font-size: 0.75rem;

  span {
    display: block;
    font-size: 0.65rem;
    color: #777;
  }
`
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 190px;
`
// type DashboardRD = {
//   dashboardRD: DashboardRdResult[]
// }
const today = new Date()

const todayStart = new Date(today)
todayStart.setHours(23, 59, 59, 999)

const threeMonthsAgo = new Date(
  today.getFullYear(),
  today.getMonth() - 3,
  today.getDate(),
)
threeMonthsAgo.setHours(0, 0, 0, 0)

export default function ReceiptDivCon() {
  const router = useRouter()
  // const { error, data, refetch } = useSuspenseQuery<DashboardRD>(
  //   DASHBOARD_RD_QUERY,
  //   {
  //     variables: {
  //       period: [threeMonthsAgo, todayStart],
  //     },
  //   },
  // )
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenClick, setIsOpenClick] = useState(false)

  // const chartData = data?.dashboardRD
  const chartData = [
    { count: 12, receiptDiv: '인스타' },
    { count: 22, receiptDiv: '카카오톡' },
    { count: 4, receiptDiv: '네이버' },
    { count: 58, receiptDiv: '홈페이지' },
    { count: 40, receiptDiv: '전화상담' },
  ]
  const receiptDivValues = chartData
    ? chartData
        ?.filter(item => item.receiptDiv !== '')
        .map(item => item.receiptDiv)
    : []
  const countValues = chartData
    ? chartData?.filter(item => item.receiptDiv !== '').map(item => item.count)
    : []

  // useEffect(() => {
  //   refetch()
  // }, [router])

  const chartOption = {
    series: [{ name: '총 건수', data: countValues }],
    option: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: receiptDivValues,
      },
    },
  }

  // if (error) {
  //   console.log(error)
  // }

  return (
    <ItemBox>
      <Title>
        <p>
          상담 접수 구분 <span>&#40;최근 3개월&#41;</span>
        </p>
        <ToolTipBox>
          <Tooltip
            closeDelay={0}
            content={
              <DashTooltip className="px-1 py-2">
                <DashTooltipTitle className="font-bold text-small">
                  상담 접수 구분
                </DashTooltipTitle>
                <DashTooltipCon className="text-tiny">
                  상담 접수 구분에 따른 통계
                </DashTooltipCon>
              </DashTooltip>
            }
            placement="bottom"
            isOpen={isOpen}
            onOpenChange={open => setIsOpen(open)}
          >
            <i
              className="xi-help"
              onClick={() => {
                setIsOpenClick(!isOpenClick)
                setIsOpen(!isOpenClick)
              }}
            />
          </Tooltip>
        </ToolTipBox>
      </Title>
      <Content>
        <ReactApexChart
          options={chartOption.option}
          series={chartOption.series}
          type="bar"
          height={175}
        />
      </Content>
    </ItemBox>
  )
}
