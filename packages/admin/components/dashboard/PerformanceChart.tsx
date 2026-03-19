import { styled } from 'styled-components'
import PerformanceChartCon from '@/components/dashboard/PerformanceChartCon'

const ConArea = styled.div`
  width: 100%;
`
const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
`
const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export default function PerformanceChart({
  managerUsernames,
  totalAmount,
  totalCount,
  totalRefundAmount,
  chartHeight,
}) {
  return (
    <ConArea>
      <DetailBox>
        <DetailDiv>
          <PerformanceChartCon
            managerUsernames={managerUsernames}
            totalAmount={totalAmount}
            totalCount={totalCount}
            totalRefundAmount={totalRefundAmount}
            chartHeight={chartHeight}
          />
        </DetailDiv>
      </DetailBox>
    </ConArea>
  )
}
