import { useState, useEffect } from 'react'
import { useReactiveVar } from '@apollo/client'
import { useRouter } from 'next/router'
import { isLoggedInVar } from '@/lib/apolloClient'

export function useAuthRedirect() {
  const router = useRouter()
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  const [isChecking, setIsChecking] = useState(true)

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token')
    const isLoggedInUpdate = !!token
    isLoggedInVar(isLoggedInUpdate)
  }

  useEffect(() => {
    checkTokenValidity()
    if (!isLoggedIn && router.pathname !== '/login') {
      alert('로그인 해주세요. 😃')
      router.replace('/login')
    } else {
      setIsChecking(false)
    }
  }, [isLoggedIn, router.pathname])

  return isChecking
}
