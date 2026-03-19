import MainWrap from '@/components/wrappers/MainWrap'
import styled from 'styled-components'
import NewConsultMonthNum from '@/components/dashboard/NewConsultMonthNum'
import NewConsultNum from '@/components/dashboard/NewConsultNum'
import ConsultNum from '@/components/dashboard/ConsultNum'
import AdviceType from '@/components/dashboard/AdviceType'
import ReceiptDiv from '@/components/dashboard/ReceiptDiv'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import {
  SEARCH_PAYMENT_FILTER_MUTATION,
  SEARCH_STUDENTSTATE_MUTATION,
  SEARCH_STUDENT_FILTER_MUTATION,
} from '@/graphql/mutations'
import Layout from '@/pages/layout'

const HomeArea = styled.div`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 1fr));
  gap: 1rem;

  @media screen and (max-width: 1140px) {
    grid-template-columns: repeat(2, minmax(320px, 1fr));
    grid-template-areas:
      'dash1 dash2'
      'dash3 dash4 '
      'dash5 dash4 '
      'dash5 dash6';

    div {
      grid-row-end: span 5;
    }

    > div {
      &:nth-child(1) {
        grid-area: dash1;
      }
      &:nth-child(2) {
        grid-area: dash2;
      }
      &:nth-child(3) {
        grid-area: dash3;
      }
      &:nth-child(4) {
        grid-area: dash4;
      }
      &:nth-child(5) {
        grid-area: dash5;
      }
    }
  }
  @media screen and (max-width: 720px) {
    grid-template-columns: repeat(1, minmax(100%, 1fr));
    grid-template-areas: unset;

    div {
      grid-row-end: unset;
    }

    > div {
      &:nth-child(1) {
        grid-area: unset;
      }
      &:nth-child(2) {
        grid-area: unset;
      }
      &:nth-child(3) {
        grid-area: unset;
      }
      &:nth-child(4) {
        grid-area: unset;
      }
      &:nth-child(5) {
        grid-area: unset;
      }
    }
  }
`

export default function Home() {
  const [searchStudentStateMutation] = useMutation(SEARCH_STUDENTSTATE_MUTATION)
  const [searchStudentFilterMutation] = useMutation(
    SEARCH_STUDENT_FILTER_MUTATION,
  )
  const [searchPaymentFilterMutation] = useMutation(
    SEARCH_PAYMENT_FILTER_MUTATION,
  )
  const isCheckingLogin = useAuthRedirect()
  const nowDate = new Date()
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1
  const day = nowDate.getDate()
  const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`
  const startOfDay = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0,
  )

  // useEffect(() => {
  //   sessionStorage.setItem('today', formattedDate)
  //   searchStudentStateMutation({
  //     variables: {
  //       createdAt: [startOfDay, nowDate],
  //     },
  //     onCompleted: resData => {
  //       if (resData.searchStudentState.ok) {
  //         const { totalCount } = resData.searchStudentState || {}
  //         sessionStorage.setItem('newConsult', totalCount)
  //       }
  //     },
  //   })
  //   searchStudentFilterMutation({
  //     variables: {
  //       createdAt: [startOfDay, nowDate],
  //     },
  //     onCompleted: resData => {
  //       if (resData.searchStudent.ok) {
  //         const { totalCount } = resData.searchStudent || {}
  //         sessionStorage.setItem('todayStudentTotal', totalCount)
  //       }
  //     },
  //   })
  //   searchPaymentFilterMutation({
  //     variables: {
  //       createdPeriod: [startOfDay, nowDate],
  //     },
  //     onCompleted: resData => {
  //       if (resData.searchStudentPayment.ok) {
  //         const { totalCount } = resData.searchStudentPayment || {}
  //         sessionStorage.setItem('newAccounting', totalCount)
  //       }
  //     },
  //   })
  // }, [])

  if (isCheckingLogin) {
    return null
  }

  return (
    <>
      <MainWrap>
        <HomeArea>
          <div>
            <NewConsultNum />
          </div>
          <div>
            <NewConsultMonthNum />
          </div>
          <div>
            <ConsultNum />
          </div>
          <div>
            <AdviceType />
          </div>
          <div>
            <ReceiptDiv />
          </div>
        </HomeArea>
      </MainWrap>
    </>
  )
}
Home.getLayout = page => <Layout>{page}</Layout>
