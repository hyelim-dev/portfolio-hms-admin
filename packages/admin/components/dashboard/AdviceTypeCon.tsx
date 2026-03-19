import { styled } from 'styled-components'
import { Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
// import { useSuspenseQuery } from '@apollo/client'
// import { DASHBOARD_AT_QUERY } from '@/graphql/queries'
// import { DashboardAtResult } from '@/src/generated/graphql'
import { useRouter } from 'next/router'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

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

  .apexcharts-legend {
    width: 87px;
    padding: 0;
    overflow-y: hidden;
    overflow-x: overlay;
    white-space: nowrap;

    &::-webkit-scrollbar {
      width: 0.5rem;
      height: 0.5rem;
    }

    &::-webkit-scrollbar-thumb {
      background: rgb(0, 125, 233);
      border-radius: 0.75rem;
    }

    &::-webkit-scrollbar-track {
      background: rgb(0, 125, 233, 0.1);
    }

    @media (max-width: 479px) {
      max-width: 100%;
      width: auto;
    }
  }
`
// type DashboardAT = {
//   dashboardAT: DashboardAtResult
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

export default function AdviceTypeCon() {
  const router = useRouter()

  // const { data, refetch } = useSuspenseQuery<DashboardAT>(DASHBOARD_AT_QUERY, {
  //   variables: {
  //     period: [threeMonthsAgo, todayStart],
  //   },
  // })
  // const adviceTypeData = data?.dashboardAT
  const adviceTypeData = [
    { count: 15, label: 'A' },
    { count: 23, label: 'B' },
    { count: 6, label: 'C' },
    { count: 26, label: 'D' },
    { count: 30, label: 'E' },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenClick, setIsOpenClick] = useState(false)

  // useEffect(() => {
  //   refetch()
  // }, [router])

  const donutData = {
    // series: adviceTypeData?.count || [],
    series: adviceTypeData.map(({ count }) => count) || [],
    options: {
      chart: { offsetX: -10 },
      labels: adviceTypeData.map(({ label }) => label) || [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { offsetX: 0 },
            legend: {
              position: 'bottom',
              offsetX: 0,
            },
          },
        },
      ],
      legend: {
        offsetX: -20,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              value: {
                offsetY: 0,
              },
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
    },
  }
  return (
    <ItemBox>
      {adviceTypeData !== null && (
        <>
          <Title>
            <p>
              {/* 상담분야 TOP{adviceTypeData?.topFiveName?.length}{' '} */}
              상담분야 TOP{adviceTypeData.length}{' '}
              <span>&#40;최근 3개월&#41;</span>
            </p>
            <ToolTipBox>
              <Tooltip
                closeDelay={0}
                content={
                  <DashTooltip className="px-1 py-2">
                    <DashTooltipTitle className="font-bold text-small">
                      {/* 상담분야 TOP{adviceTypeData?.topFiveName?.length} */}
                      상담분야 TOP{adviceTypeData.length}
                    </DashTooltipTitle>
                    <DashTooltipCon className="text-tiny">
                      {/* 상담 분야 중 상위 {adviceTypeData?.topFiveName?.length} */}
                      상담 분야 중 상위 {adviceTypeData.length}
                      분야 (중복 선택 포함)
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
            <ApexChart
              options={donutData.options}
              series={donutData.series}
              type="donut"
              width="310"
            />
          </Content>
        </>
      )}
    </ItemBox>
  )
}
