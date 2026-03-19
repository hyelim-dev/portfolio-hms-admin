import { Suspense } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import Layout from '@/pages/hr/teacher/layout'
import TeacherEditForm from '@/components/form/TeacherEditForm'

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

export default function TeacherDetail() {
  const router = useRouter()
  const managerId = typeof router.query.id === 'string' ? router.query.id : null

  return (
    <>
      <Suspense
        fallback={
          <LodingDiv>
            <i className="xi-spinner-2" />
          </LodingDiv>
        }
      >
        <TeacherEditForm managerId={managerId} />
      </Suspense>
    </>
  )
}
TeacherDetail.getLayout = page => <Layout>{page}</Layout>
