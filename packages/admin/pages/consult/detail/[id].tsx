import MainWrap from '@/components/wrappers/MainWrap'
import { useRouter } from 'next/router'
import useMmeQuery from '@/utils/mMe'
import Layout from '@/pages/consult/layout'
import SuspenseBox from '@/components/wrappers/SuspenseWrap'
import ConsultEdit from '@/components/layout/ConsultEdit'

export default function ConsultDetail() {
  const router = useRouter()
  const studentId = typeof router.query.id === 'string' ? router.query.id : null
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')

  return (
    <>
      <MainWrap>
        <SuspenseBox>
          <ConsultEdit mGrade={mGrade} mId={mId} studentId={studentId} />
        </SuspenseBox>
      </MainWrap>
    </>
  )
}
ConsultDetail.getLayout = page => <Layout>{page}</Layout>
