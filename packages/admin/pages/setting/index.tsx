import { styled } from 'styled-components'
import Layout from '@/pages/setting/layout'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ConBox = styled.div`
  margin: 2rem 0;
  z-index: 0;
  position: relative;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: none;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Setting() {
  const router = useRouter()
  useEffect(() => {
    router.push('/setting/types')
  }, [router])

  return <></>
}
Setting.getLayout = page => <Layout>{page}</Layout>
