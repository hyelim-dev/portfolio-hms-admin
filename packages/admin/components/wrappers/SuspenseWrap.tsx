import styled from 'styled-components'
import { Suspense, useEffect, useState } from 'react'

const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function SuspenseBox({ children }) {
  return (
    <Suspense
      fallback={
        <LodingDiv>
          <i className="xi-spinner-2" />
        </LodingDiv>
      }
    >
      {children}
    </Suspense>
  )
}
