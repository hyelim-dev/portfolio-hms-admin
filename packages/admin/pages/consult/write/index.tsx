import MainWrap from '@/components/wrappers/MainWrap'
import Layout from '@/pages/consult/layout'
import SuspenseBox from '@/components/wrappers/SuspenseWrap'
import ConsultCreate from '@/components/layout/ConsultCreate'
import useMmeQuery from '@/utils/mMe'

export default function ConsultWirte() {
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  return (
    <>
      <MainWrap>
        <SuspenseBox>
          <ConsultCreate mGrade={mGrade} mId={mId} />
        </SuspenseBox>
      </MainWrap>
    </>
  )
}
ConsultWirte.getLayout = page => <Layout>{page}</Layout>
