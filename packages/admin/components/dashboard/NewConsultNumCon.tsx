import { styled } from 'styled-components'
import { Tooltip } from '@nextui-org/react'
// import { useSuspenseQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
// import { DASHBOARD_TODAY_QUERY } from '@/graphql/queries'
// import { DashboardTodayResult } from '@/src/generated/graphql'
import { useRouter } from 'next/router'

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
  align-items: baseline;
`
const Total = styled.div`
  letter-spacing: -0.025em;
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.25rem;
`
const MoM = styled.div<{ $isIncrease: boolean }>`
  align-items: baseline;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  margin-left: 0.5rem;
  color: ${props => (props.$isIncrease ? '#17c964' : '#f31260')};
`
const MoME = styled.div`
  align-items: baseline;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  margin-left: 0.5rem;
  color: #a1a1aa;
`
const MoMIcon = styled.p`
  height: 1.25rem;
`
// type DashboardToday = {
//   dashboardToday: DashboardTodayResult
// }

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)

const todayStart = new Date(today)
todayStart.setHours(0, 0, 0, 0)

const todayEnd = new Date(today)
todayEnd.setHours(23, 59, 59, 999)

const yesterdayStart = new Date(yesterday)
yesterdayStart.setHours(0, 0, 0, 0)

const yesterdayEnd = new Date(yesterday)
yesterdayEnd.setHours(23, 59, 59, 999)

export default function NewConsultNumCon() {
  const router = useRouter()
  // const { error, data, refetch } = useSuspenseQuery<DashboardToday>(
  //   DASHBOARD_TODAY_QUERY,
  //   {
  //     variables: {
  //       today: [todayStart, todayEnd],
  //       yesterday: [yesterdayStart, yesterdayEnd],
  //     },
  //   },
  // )
  // const dataToday = data?.dashboardToday.today || 0
  // const dataCompare = data?.dashboardToday.compareToday || 0
  const dataToday = 3
  const dataCompare = 5
  const [isIncrease, setIsIncrease] = useState<boolean>()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenClick, setIsOpenClick] = useState(false)
  const date = new Date().getDate()

  useEffect(() => {
    if (dataCompare > 0) {
      setIsIncrease(true)
    } else {
      setIsIncrease(false)
    }
  }, [])

  // useEffect(() => {
  //   refetch()
  // }, [router])

  const dateFormet = data => {
    if (parseInt(data) < 10000) {
      const result = data.toLocaleString()
      return result
    } else {
      return '9999+'
    }
  }

  // if (error) {
  //   console.log(error)
  // }

  return (
    <ItemBox>
      <Title>
        <span>오늘의 신규 상담</span>
        <ToolTipBox>
          <Tooltip
            closeDelay={0}
            content={
              <DashTooltip className="px-1 py-2">
                <DashTooltipTitle className="font-bold text-small">
                  {date}일의 신규 상담
                </DashTooltipTitle>
                <DashTooltipCon className="text-tiny">
                  전일의 신규 상담수 대비 오늘의 상담수
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
        <Total>{dateFormet(dataToday)}</Total>
        {/* {dataCompare !== 0 ? (
          <MoM $isIncrease={isIncrease}>
            <MoMIcon>
              {isIncrease ? (
                <i className="xi-arrow-up" />
              ) : (
                <i className="xi-arrow-down" />
              )}
            </MoMIcon>
            {Math.abs(dataCompare)}
          </MoM>
        ) : (
          <MoME>
            <MoMIcon>
              <i className="xi-minus-min" />
            </MoMIcon>
          </MoME>
        )} */}
        <MoM $isIncrease={isIncrease}>
          <MoMIcon>
            {isIncrease ? (
              <i className="xi-arrow-up" />
            ) : (
              <i className="xi-arrow-down" />
            )}
          </MoMIcon>
          {Math.abs(dataCompare)}
        </MoM>
      </Content>
    </ItemBox>
  )
}
