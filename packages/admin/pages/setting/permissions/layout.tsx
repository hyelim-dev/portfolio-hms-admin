import MainWrap from '@/components/wrappers/MainWrap'
import { gradeState } from '@/lib/recoilAtoms'
import { IS_DEMO } from '@/utils/demo'
import useMmeQuery from '@/utils/mMe'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useRecoilValue } from 'recoil'

export default function PermissionsLayout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const isCheckingLogin = useAuthRedirect()

  if (isCheckingLogin) {
    return null
  }

  if (IS_DEMO) {
    return (
      <MainWrap>
        🚧 데모 모드에서는 환경설정(권한 설정) 기능이 비활성화되어 있습니다.
        <br />
        (실제 서비스에서는 카테고리별 접근 권한과 세부 권한을 설정할 수
        있습니다.)
      </MainWrap>
    )
  }

  if (mGrade <= grade.subMaster) {
    return <main>{children}</main>
  } else {
    return <MainWrap>접근 권한이 없습니다.</MainWrap>
  }
}
