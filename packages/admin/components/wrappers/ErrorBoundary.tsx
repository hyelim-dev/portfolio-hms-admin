import React, { Component, ReactNode } from 'react'
import styled from 'styled-components'

const HomeArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.mainBG};
`
const Title = styled.div`
  text-align: center;
  font-size: 8rem;
  font-weight: 700;
`
const TextCon = styled.div`
  text-align: center;
  font-size: 1.8rem;
  margin-top: -1rem;
  font-weight: 700;
`
const SemiText = styled.div`
  text-align: center;
  margin-top: 1rem;
  display: block;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  margin-bottom: 2rem;
`

const Btnbox = styled.div`
  display: flex;
  gap: 1rem;
`

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // 에러 발생 시 실행되는 메서드
  static getDerivedStateFromError(error: Error) {
    // 에러 상태로 변경
    return { hasError: true }
  }

  // 에러 정보를 로깅할 수 있는 메서드
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo)
    // 이곳에 에러 로깅이나 에러 리포팅 로직 추가 가능
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 보여줄 커스텀 UI
      return (
        <HomeArea>
          {/* <Title>&#x1F631;</Title>
          <TextCon>앗! 뭔가 문제가 생겼어요...</TextCon>
          <SemiText>
            서버와의 연결이 끊겼거나,
            <br />
            문제를 해결하고 있으니,
            <br />
            새로고침해주세요.
          </SemiText> */}
        </HomeArea>
      )
    }

    // 에러가 없으면 자식 컴포넌트를 렌더링
    return this.props.children
  }
}
