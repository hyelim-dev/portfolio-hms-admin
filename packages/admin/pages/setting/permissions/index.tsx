import { styled } from 'styled-components'
import Layout from '@/pages/setting/permissions/layout'
import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionTabs from '@/components/layout/tab/PermissionTabs'

const ConBox = styled.div`
  margin: 2rem 0;
  z-index: 0;
  position: relative;
`

export default function SettingPermissions() {
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
          <PermissionTabs />
        </ConBox>
      </MainWrap>
    </>
  )
}
SettingPermissions.getLayout = page => <Layout>{page}</Layout>
