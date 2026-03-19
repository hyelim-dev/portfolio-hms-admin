import { styled, useTheme } from 'styled-components'
import dynamic from 'next/dynamic'
import { SEARCH_MANAGEUSER_QUERY } from '@/graphql/queries'
import { useSuspenseQuery } from '@apollo/client'
import { ScrollShadow } from '@nextui-org/react'
import { SearchManageUserResult } from '@/src/generated/graphql'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const Content = styled.div`
  flex: 1;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 1000px;
  }

  .apexcharts-series path {
    stroke-width: 0.3rem;
    @media (max-width: 768px) {
      stroke-width: 0.1rem;
    }
  }
`
const ChartWrap = styled.div`
  min-width: 700px;
`

export default function PerformanceChartCon({
  managerUsernames,
  totalAmount,
  totalCount,
  totalRefundAmount,
  chartHeight,
}) {
  const theme = useTheme()
  const countValue = Math.max(...totalCount)
  const maxCountValue = countValue <= 10 ? 10 : countValue
  const amountValue = Math.max(...totalAmount)
  const maxAmountValue = amountValue <= 10000000 ? 10000000 : amountValue

  const chartData = {
    series: [
      {
        name: '총 매출',
        type: 'column',
        data: totalAmount,
      },
      {
        name: '총 매출(라인)',
        type: 'line',
        data: totalAmount,
      },
      {
        name: '총 환불',
        type: 'column',
        data: totalRefundAmount,
      },
    ],
    options: {
      chart: {
        height: chartHeight,
        width: '100%',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
        },
      },
      stroke: {
        width: [0, 1, 0],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        formatter: function (val, { seriesIndex }) {
          if (seriesIndex > 0) {
            return val / 10000 + '만원'
          }
          return val
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          colors: undefined,
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
          opacity: 0.9,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: `${theme.colors.black}`,
            opacity: 0.45,
          },
        },
      },
      labels: managerUsernames,
      yaxis: [
        {
          title: {
            text: '총 금액 (1만원 단위)',
          },
          labels: {
            formatter: function (value) {
              return (value / 10000).toFixed(0).toLocaleString()
            },
          },
          max: maxAmountValue,
        },
        {
          show: false,
          max: maxAmountValue,
        },
        {
          labels: {
            formatter: function (value) {
              return (value / 10000).toFixed(0).toLocaleString()
            },
          },
          show: false,
          max: maxAmountValue,
        },
      ],
      colors: [
        'rgba(46,147,250,0.85)',
        'rgba(46,147,250,0.85)',
        'rgba(255,89,0,0.85)',
        ,
      ],
    },
  }

  return (
    chartData && (
      <Content>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <ChartWrap>
            <ApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={chartHeight}
            />
          </ChartWrap>
        </ScrollShadow>
      </Content>
    )
  )
}
