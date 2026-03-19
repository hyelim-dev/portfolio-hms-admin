import MainWrap from '@/components/wrappers/MainWrap'
import styled from 'styled-components'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import useMmeQuery from '@/utils/mMe'
import { useRouter } from 'next/router'

export default function RedirectPage() {
  const router = useRouter()
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  useEffect(() => {
    if (mGrade === grade.teacher) {
      router.push('/lecture')
    }
  }, [mGrade])

  return (
    <>
      <MainWrap>
        <p></p>
      </MainWrap>
    </>
  )
}
