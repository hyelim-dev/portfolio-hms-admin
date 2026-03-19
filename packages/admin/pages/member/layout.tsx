import { useRouter } from 'next/router'
import useMmeQuery from '@/utils/mMe'
import MainWrap from '@/components/wrappers/MainWrap'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import { useAuthRedirect } from '@/utils/useAuthRedirect'

export default function MemberLayout({ children }) {
  // const grade = useRecoilValue(gradeState)
  // const { useMme } = useMmeQuery()
  // const mGrade = useMme('mGrade')
  // useEffect(() => {
  //   if (mGrade !== grade.dev) {
  //     router.push('/')
  //   }
  // }, [mGrade])

  const isCheckingLogin = useAuthRedirect()
  if (isCheckingLogin) {
    return null
  }
  // if (mGrade === grade.dev) {
  //   return <main>{children}</main>
  // } else {
  //   return <MainWrap>준비중입니다.</MainWrap>
  // }
  return <main>{children}</main>
}
