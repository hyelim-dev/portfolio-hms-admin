import { styled } from 'styled-components'
import Layout from '@/pages/setting/layout'
import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import TypesTabs from '@/components/layout/tab/TypesTabs'

const ConBox = styled.div`
  margin: 2rem 0;
  z-index: 0;
  position: relative;
`

export default function SettingTypes() {
  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={false}
          isActive={false}
          rightArea={false}
          isFilter={false}
        />
        <ConBox>
          <TypesTabs />
        </ConBox>
      </MainWrap>
    </>
  )
}
SettingTypes.getLayout = page => <Layout>{page}</Layout>
