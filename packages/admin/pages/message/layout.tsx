import MainWrap from '@/components/wrappers/MainWrap'
import { gradeState } from '@/lib/recoilAtoms'
import { IS_DEMO } from '@/utils/demo'
import useMmeQuery from '@/utils/mMe'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useRecoilValue } from 'recoil'

export default function MessageLayout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const isCheckingLogin = useAuthRedirect()

  if (isCheckingLogin) {
    return null
  }
  // if (mGrade === grade.dev) {
  //   return <main>{children}</main>
  // } else {
  //   return <MainWrap>미오픈 카테고리입니다.</MainWrap>
  // }

  if (IS_DEMO) {
    return (
      <MainWrap>
        🚧 데모 모드에서는 메시지(문자 발송) 기능이 비활성화되어 있습니다.
        <br />
        (실제 서비스에서는 메시지 즉시 발송 및 예약 발송, 개인/공통 문자함
        저장·수정·삭제·불러오기, 보낸 문자함 결과 확인 기능을 제공합니다.)
      </MainWrap>
    )
  }

  return <main>{children}</main>
}
