import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import Layout from '@/pages/students/layout'
import {
  SEARCH_PAYMENT_MUTATION,
  SEARCH_SUBJECT_MUTATION,
} from '@/graphql/mutations'
import StudentPaymentEditForm from '@/components/form/StudentPaymentEditForm'
import FormTopInfo from '@/components/common/FormTopInfo'

const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: none;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
`
const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: red;
  }
`
const InputText = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  width: 2.5rem;
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`
const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

export default function StudentsWriteCourse() {
  const router = useRouter()
  const paymentId = typeof router.query.id === 'string' ? router.query.id : null
  const [searchStudentPayment] = useMutation(SEARCH_PAYMENT_MUTATION)
  const [searchSubject] = useMutation(SEARCH_SUBJECT_MUTATION)
  const [studentData, setStudentData] = useState(null)
  const [studentSubjectData, setStudentSubjectData] = useState(null)
  const [studentPaymentData, setStudentPaymentData] = useState(null)

  useEffect(() => {
    if (paymentId !== null) {
      searchStudentPayment({
        variables: {
          searchStudentPaymentId: parseInt(paymentId),
        },
        onCompleted: data => {
          if (data.searchStudentPayment.ok) {
            setStudentData(data.searchStudentPayment?.data[0]?.student)
            setStudentPaymentData(data.searchStudentPayment?.data[0])
          }
        },
      })
    }
  }, [router])

  useEffect(() => {
    searchSubject({
      variables: {
        searchSubjectId: studentPaymentData?.subjectId,
      },
      onCompleted: resData => {
        if (resData.searchSubject.ok) {
          const { result } = resData.searchSubject || {}
          setStudentSubjectData(result[0])
        }
      },
    })
  }, [studentPaymentData])

  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  return (
    <>
      <MainWrap>
        <ConArea>
          <Breadcrumb rightArea={false} isFilter={false} />
          <DetailBox>
            <FormTopInfo item={studentData} noti={true} time={true} />
            <DetailDiv>
              <AreaTitle>
                <h4>기본정보</h4>
              </AreaTitle>
              <FlexBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      이름<span>*</span>
                    </FilterLabel>
                    <LineBox>{studentData?.name}</LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      생년월일<span>*</span>
                    </FilterLabel>
                    <LineBox>
                      {formatDate(studentData?.birthday, false)}
                    </LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>
                      연락처<span>*</span>
                    </FilterLabel>
                    <LineBox>{studentData?.phoneNum1}</LineBox>
                  </div>
                </AreaBox>
              </FlexBox>
              <FlexBox>
                <AreaBox>
                  <div>
                    <FilterLabel>담당자</FilterLabel>
                    <LineBox>{studentData?.writer}</LineBox>
                  </div>
                </AreaBox>
                <AreaBox>
                  <div>
                    <FilterLabel>등록일시</FilterLabel>
                    <LineBox>
                      {formatDate(studentData?.createdAt, true)}
                    </LineBox>
                  </div>
                </AreaBox>
              </FlexBox>
            </DetailDiv>
          </DetailBox>

          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <StudentPaymentEditForm
              studentData={studentData}
              studentSubjectData={studentSubjectData}
              studentPaymentData={studentPaymentData}
            />
          </Suspense>
        </ConArea>
      </MainWrap>
    </>
  )
}
StudentsWriteCourse.getLayout = page => <Layout>{page}</Layout>
