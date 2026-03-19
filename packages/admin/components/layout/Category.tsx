import { motion } from 'framer-motion'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import {
  activeCategoryState,
  consultFilterActiveState,
  consultFilterLimitState,
  consultFilterState,
  consultLimitState,
  consultPageState,
  consultSearchState,
  gradeState,
  parformanceFilterActiveState,
  parformanceFilterState,
  parformanceSearchState,
  paymentDetailFilterActiveState,
  paymentDetailFilterPageState,
  paymentDetailFilterState,
  paymentDetailPageState,
  paymentDetailSearchState,
  paymentFilterActiveState,
  paymentFilterState,
  paymentPageState,
  paymentSearchState,
  recruitmentFilterActiveState,
  recruitmentFilterState,
  recruitmentPageState,
  recruitmentSearchState,
  refundFilterActiveState,
  refundFilterState,
  refundPageState,
  refundSearchState,
  reqRefundFilterActiveState,
  reqRefundFilterState,
  reqRefundPageState,
  reqRefundSearchState,
  studentFilterActiveState,
  studentFilterState,
  studentPageState,
  studentSearchState,
  subjectFilterActiveState,
  subjectFilterState,
  subjectPageState,
  subjectSearchState,
} from '@/lib/recoilAtoms'
import CategoryItem from '@/components/items/CategoryItem'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import categories from '@/lib/category'
import useMmeQuery from '@/utils/mMe'

const CateWrap = styled(motion.ul)``

export default function Category() {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')

  const [activeCategory, setActiveCategory] =
    useRecoilState(activeCategoryState)
  const resetConsultPage = useResetRecoilState(consultPageState)
  const resetConsultLimit = useResetRecoilState(consultLimitState)
  const resetConsultFilterActive = useResetRecoilState(consultFilterActiveState)
  const resetConsultFilterSearch = useResetRecoilState(consultFilterState)
  const resetConsultFilter = useResetRecoilState(consultSearchState)
  const resetConsultFilterLimit = useResetRecoilState(consultFilterLimitState)
  const resetSubjectPage = useResetRecoilState(subjectPageState)
  const resetSubjectFilterActive = useResetRecoilState(subjectFilterActiveState)
  const resetSubjectFilterSearch = useResetRecoilState(subjectFilterState)
  const resetSubjectFilter = useResetRecoilState(subjectSearchState)
  const resetStudentPage = useResetRecoilState(studentPageState)
  const resetStudentFilterActive = useResetRecoilState(studentFilterActiveState)
  const resetStudentFilterSearch = useResetRecoilState(studentFilterState)
  const resetStudentFilter = useResetRecoilState(studentSearchState)
  const resetPaymentPage = useResetRecoilState(paymentPageState)
  const resetPaymentFilterActive = useResetRecoilState(paymentFilterActiveState)
  const resetPaymentFilterSearch = useResetRecoilState(paymentFilterState)
  const resetPaymentFilter = useResetRecoilState(paymentSearchState)
  const resetPaymentDetailPage = useResetRecoilState(paymentDetailPageState)
  const resetPaymentDetailFilterActive = useResetRecoilState(
    paymentDetailFilterActiveState,
  )
  const resetPaymentDetailFilterPage = useResetRecoilState(
    paymentDetailFilterPageState,
  )
  const resetPaymentDetailFilterSearch = useResetRecoilState(
    paymentDetailFilterState,
  )
  const resetPaymentDetailFilter = useResetRecoilState(paymentDetailSearchState)
  const resetRefundPage = useResetRecoilState(refundPageState)
  const resetRefundFilterActive = useResetRecoilState(refundFilterActiveState)
  const resetRefundFilterSearch = useResetRecoilState(refundFilterState)
  const resetRefundFilter = useResetRecoilState(refundSearchState)
  const resetReqRefundPage = useResetRecoilState(reqRefundPageState)
  const resetReqRefundFilterActive = useResetRecoilState(
    reqRefundFilterActiveState,
  )
  const resetReqRefundFilterSearch = useResetRecoilState(reqRefundFilterState)
  const resetReqRefundFilter = useResetRecoilState(reqRefundSearchState)
  const resetParformanceFilterActiveState = useResetRecoilState(
    parformanceFilterActiveState,
  )
  const resetParformanceFilterState = useResetRecoilState(
    parformanceFilterState,
  )
  const resetParformanceSearchState = useResetRecoilState(
    parformanceSearchState,
  )
  const resetRecruitmentFilterActiveState = useResetRecoilState(
    recruitmentFilterActiveState,
  )
  const resetRecruitmentPageState = useResetRecoilState(recruitmentPageState)
  const resetRecruitmentFilterState = useResetRecoilState(
    recruitmentFilterState,
  )
  const resetRecruitmentSearchState = useResetRecoilState(
    recruitmentSearchState,
  )

  const resetFunctions = {
    resetConsultPage,
    resetConsultLimit,
    resetConsultFilterActive,
    resetConsultFilterSearch,
    resetConsultFilter,
    resetConsultFilterLimit,
    resetSubjectPage,
    resetSubjectFilterActive,
    resetSubjectFilterSearch,
    resetSubjectFilter,
    resetStudentPage,
    resetStudentFilterActive,
    resetStudentFilterSearch,
    resetStudentFilter,
    resetPaymentPage,
    resetPaymentFilterActive,
    resetPaymentFilterSearch,
    resetPaymentFilter,
    resetPaymentDetailPage,
    resetPaymentDetailFilterActive,
    resetPaymentDetailFilterSearch,
    resetPaymentDetailFilterPage,
    resetPaymentDetailFilter,
    resetRefundPage,
    resetRefundFilterActive,
    resetRefundFilterSearch,
    resetRefundFilter,
    resetReqRefundPage,
    resetReqRefundFilterActive,
    resetReqRefundFilterSearch,
    resetReqRefundFilter,
    resetParformanceFilterActiveState,
    resetParformanceFilterState,
    resetParformanceSearchState,
    resetRecruitmentFilterActiveState,
    resetRecruitmentPageState,
    resetRecruitmentFilterState,
    resetRecruitmentSearchState,
  }

  const router = useRouter()
  const [breadcrumb, setBreadcrumb] = useState<string[]>([])
  const handleCategoryClick = (categoryId, resetItems) => {
    setActiveCategory(categoryId)

    resetItems?.forEach(item => {
      const resetFunction = resetFunctions[item]
      if (resetFunction) {
        resetFunction()
      }
    })
  }

  useEffect(() => {
    const pathnames = router.pathname.split('/').filter(x => x)
    if (pathnames === undefined) {
      setBreadcrumb([''])
    } else {
      setBreadcrumb(pathnames)
    }
  }, [router.pathname])
  const active = breadcrumb[0] === undefined ? '/' : `/${breadcrumb[0]}`

  return (
    <>
      {mGrade === grade.teacher ? (
        <CateWrap>
          {categories
            .filter(category => category.exposure && category.teacher)
            .map((category, index) => (
              <CategoryItem
                key={index}
                href={category.href}
                iconSrc={category.iconSrc}
                name={category.name}
                isActive={active === category.href}
                onClick={() => {
                  handleCategoryClick(category.id, category.resetItems)
                }}
                children={category.children.filter(
                  category => category.exposure && category.teacher,
                )}
              />
            ))}
        </CateWrap>
      ) : (
        <CateWrap>
          {categories
            .filter(category => category.exposure)
            .map((category, index) => (
              <CategoryItem
                key={index}
                href={category.href}
                iconSrc={category.iconSrc}
                name={category.name}
                isActive={active === category.href}
                onClick={() => {
                  handleCategoryClick(category.id, category.resetItems)
                }}
                children={category.children}
              />
            ))}
        </CateWrap>
      )}
    </>
  )
}
