import { resetStudentDb } from '@/src/mocks/storage/studentStorage'
import { Button } from '@nextui-org/react'
import styled from 'styled-components'

const FooterCon = styled.footer`
  display: flex;
  width: 100%;
  padding: 3rem 2rem;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  flex-direction: column;
  gap: 0.5rem;

  @media screen and (max-width: 1024px) {
    padding: 2rem 1rem;
  }
`
const Copyright = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray};

  @media screen and (max-width: 1024px) {
    font-size: 0.75rem;
  }
`
const WebBtn = styled.a`
  padding: 0.5rem 0;
  width: 100%;
  display: none;
  align-items: baseline;
  position: relative;
  font-size: 0.875rem;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  background: ${({ theme }) => theme.colors.primary};

  @media screen and (max-width: 650px) {
    display: flex;
  }
`

export default function FooterComponent() {
  const handleReset = () => {
    const ok = confirm('Mock 데이터를 초기화하시겠습니까?')

    if (!ok) return

    resetStudentDb()
    location.reload()
  }

  return (
    <>
      <FooterCon>
        <Copyright>
          <i className="xi-copyright" /> 2023. H ACADEMY Co. All rights
          reserved.
        </Copyright>
      </FooterCon>
      <WebBtn
        href="#"
        onClick={e => {
          e.preventDefault()
          handleReset()
        }}
      >
        mock 데이터 리셋
      </WebBtn>
    </>
  )
}
