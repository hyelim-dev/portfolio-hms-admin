import Layout from '@/components/wrappers/MainWrap'
import styled from 'styled-components'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/router'

const HomeArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 15.75rem);
  justify-content: center;
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

export default function NotFound() {
  const isCheckingLogin = useAuthRedirect()
  const router = useRouter()
  if (isCheckingLogin) {
    return null
  }

  return (
    <>
      <Layout>
        <HomeArea>
          <Title>5&#x1F631;2</Title>
          <TextCon>앗! 뭔가 문제가 생겼어요...</TextCon>
          <SemiText>
            서버와의 연결이 끊겼거나,
            <br />
            문제를 해결하고 있으니,
            <br />
            새로고침 또는 다시 로그인 해주세요.
          </SemiText>
          <Btnbox>
            <Button color="primary" onClick={() => router.push('/login')}>
              로그인하러 가기
            </Button>
          </Btnbox>
        </HomeArea>
      </Layout>
    </>
  )
}
