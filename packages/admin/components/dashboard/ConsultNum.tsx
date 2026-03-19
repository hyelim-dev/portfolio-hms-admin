import { styled } from 'styled-components'
import { Suspense } from 'react'
import ConsultNumCon from '@/components/dashboard/ConsultNumCon'

const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function ConsultNum() {
  return (
    <Suspense
      fallback={
        <LodingDiv>
          <i className="xi-spinner-2" />
        </LodingDiv>
      }
    >
      <ConsultNumCon />
    </Suspense>
  )
}
