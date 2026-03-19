import MainWrap from '@/components/wrappers/MainWrap'
import { IS_DEMO } from '@/utils/demo'
import { useAuthRedirect } from '@/utils/useAuthRedirect'

export default function SettingLayout({ children }) {
  const isCheckingLogin = useAuthRedirect()

  if (isCheckingLogin) {
    return null
  }

  if (IS_DEMO) {
    return (
      <MainWrap>
        🚧 데모 모드에서는 환경설정(분야관리) 기능이 비활성화되어 있습니다.
        <br />
        (실제 서비스에서는 상담분야, 접수구분, 수강구분 등의 설정을 추가·삭제 및
        순서 변경할 수 있습니다.)
      </MainWrap>
    )
  }

  return <main>{children}</main>
}
