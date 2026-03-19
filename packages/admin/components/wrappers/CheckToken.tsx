import { useEffect } from 'react'
import { isLoggedInVar } from '@/lib/apolloClient'

export default function CheckTokenValidity({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('token') // 로컬 스토리지에서 토큰 가져오기
    const isLoggedIn = !!token // 토큰이 존재하는지 여부 확인
    isLoggedInVar(isLoggedIn) // isLoggedInVar 업데이트

    // 선택적으로, 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      // 예: router.push('/login') 또는 window.location.href = '/login';
    }
  }, [])

  return <>{children}</> // 자식 컴포넌트 렌더링
}
