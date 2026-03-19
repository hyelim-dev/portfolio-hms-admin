import RedirectPage from '@/components/layout/RedirectPage'
import MainWrap from '@/components/wrappers/MainWrap'
import { gradeState } from '@/lib/recoilAtoms'
import useMmeQuery from '@/utils/mMe'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useRecoilValue } from 'recoil'

export default function Layout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const isCheckingLogin = useAuthRedirect()

  if (isCheckingLogin) {
    return null
  }

  if (mGrade === grade.dev) {
    return <main>{children}</main>
  } else {
    return <MainWrap>준비중입니다.</MainWrap>
  }
}
