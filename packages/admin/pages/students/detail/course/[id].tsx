import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { Button } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import Layout from '@/pages/students/layout'
import { useRecoilValue } from 'recoil'
import { assignmentState, gradeState } from '@/lib/recoilAtoms'
import { SEARCH_PAYMENT_MUTATION } from '@/graphql/mutations'
import StudentPaymentDetailItem from '@/components/items/PaymentDetailItem'
import PaymentInfo from '@/components/layout/infoCard/PaymentInfo'
import StudentInfo from '@/components/layout/infoCard/StudentInfo'
import FormTopInfo from '@/components/common/FormTopInfo'
import PermissionBtn from '@/components/common/PermissionBtn'
import AssignmentBtns from '@/components/layout/AssignmentBtns'
import SuspenseWrap from '@/components/wrappers/SuspenseWrap'
import { withDemoGuard } from '@/utils/demo'

const LodingDiv = styled.div`
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
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
const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

export default function StudentsWrite() {
  const router = useRouter()
  const paymentId = typeof router.query.id === 'string' ? router.query.id : null
  const assignment = useRecoilValue(assignmentState)
  const [searchStudentPayment] = useMutation(SEARCH_PAYMENT_MUTATION)
  const [studentData, setStudentData] = useState(null)
  const [studentSubjectData, setStudentSubjectData] = useState(null)
  const [studentPaymentData, setStudentPaymentData] = useState(null)
  const [studentPaymentDetailData, setStudentPaymentDetailData] = useState([])

  useEffect(() => {
    if (paymentId !== null) {
      searchStudentPayment({
        variables: {
          searchStudentPaymentId: parseInt(paymentId),
        },
        onCompleted: ({
          searchStudentPayment: {
            ok,
            data: [firstData],
          },
        }) => {
          if (ok) {
            const { student, subject, paymentDetail } = firstData
            setStudentPaymentData(firstData)
            setStudentData(student)
            setStudentSubjectData(subject)
            setStudentPaymentDetailData(paymentDetail)
          }
        },
      })
    }
  }, [router])

  return (
    <>
      {studentData !== null && (
        <MainWrap>
          <ConArea>
            <Breadcrumb rightArea={false} isFilter={false} />
            <DetailBox>
              <FormTopInfo item={studentData} noti={true} time={true} />
              <DetailDiv>
                <AreaTitle>
                  <h4>기본정보</h4>
                </AreaTitle>
                <StudentInfo
                  studentData={studentData}
                  detailAll={false}
                  record={false}
                />
              </DetailDiv>
            </DetailBox>
            {studentPaymentData !== undefined && (
              <>
                <DetailBox>
                  <FormTopInfo
                    item={studentPaymentData}
                    noti={true}
                    time={true}
                  />
                  <DetailDiv>
                    <AreaTitle>
                      <h4>수강 정보</h4>
                      <div className="flex gap-[0.5rem]">
                        {studentPaymentData?.lectureAssignment ==
                          assignment.assignment && (
                          <Suspense
                            fallback={
                              <LodingDiv>
                                <i className="xi-spinner-2" />
                              </LodingDiv>
                            }
                          >
                            <PermissionBtn
                              btnName={'학적부'}
                              style={{
                                size: 'sm',
                                variant: 'bordered',
                                css: null,
                              }}
                              permissionName={'학적부접근'}
                              handleClick={() => {
                                router.push(
                                  `/lecture/employmentDetail/${paymentId}`,
                                )
                              }}
                            />
                          </Suspense>
                        )}
                        <Suspense
                          fallback={
                            <LodingDiv>
                              <i className="xi-spinner-2" />
                            </LodingDiv>
                          }
                        >
                          <PermissionBtn
                            btnName={'수정'}
                            style={{
                              size: 'sm',
                              variant: 'solid',
                              css: 'text-white',
                            }}
                            isDisabled={
                              studentPaymentData?.lectureAssignment ===
                              assignment.withdrawal
                                ? true
                                : false
                            }
                            permissionName={'수강관리'}
                            handleClick={withDemoGuard(() => {
                              router.push(
                                `/students/edit/course/${studentPaymentData?.id}`,
                              )
                            })}
                          />
                        </Suspense>
                      </div>
                    </AreaTitle>
                    <PaymentInfo
                      studentSubjectData={studentSubjectData}
                      studentPaymentData={studentPaymentData}
                    />
                    <SuspenseWrap>
                      <AssignmentBtns
                        paymentId={paymentId}
                        studentData={studentData}
                        studentSubjectData={studentSubjectData}
                        studentPaymentData={studentPaymentData}
                        setStudentPaymentData={setStudentPaymentData}
                        studentPaymentDetailData={studentPaymentDetailData}
                      />
                    </SuspenseWrap>
                  </DetailDiv>
                </DetailBox>
              </>
            )}
            {studentPaymentDetailData?.length > 0 ? (
              <>
                <DetailBox>
                  <DetailDiv>
                    <AreaTitle>
                      <h4>결제 정보</h4>
                      <Suspense
                        fallback={
                          <LodingDiv>
                            <i className="xi-spinner-2" />
                          </LodingDiv>
                        }
                      >
                        <PermissionBtn
                          btnName={'미수금결제'}
                          style={{
                            size: 'sm',
                            variant: 'solid',
                            css: 'text-white bg-accent',
                          }}
                          isDisabled={
                            studentPaymentData?.unCollectedAmount === 0 ||
                            studentPaymentData?.lectureAssignment ===
                              assignment.withdrawal
                              ? true
                              : false
                          }
                          permissionName={'결제관리'}
                          handleClick={() => {
                            router.push(`/students/write/payment/${paymentId}`)
                          }}
                        />
                      </Suspense>
                    </AreaTitle>
                    {studentPaymentDetailData?.map((item, index) => (
                      <StudentPaymentDetailItem
                        key={index}
                        setStudentPaymentDetailData={
                          setStudentPaymentDetailData
                        }
                        detailtData={item}
                        paymentId={paymentId}
                      />
                    ))}
                  </DetailDiv>
                </DetailBox>
              </>
            ) : null}
            <DetailBox>
              <BtnBox>
                {!studentPaymentDetailData ||
                studentPaymentDetailData?.length === 0 ? (
                  <SuspenseWrap>
                    <PermissionBtn
                      btnName={'수강 결제'}
                      style={{
                        size: 'md',
                        variant: 'solid',
                        css: 'w-full mx-auto text-white bg-accent md:w-[50%]',
                      }}
                      permissionName={'결제관리'}
                      handleClick={() => {
                        router.push(`/students/write/payment/${paymentId}`)
                      }}
                    />
                  </SuspenseWrap>
                ) : null}

                <Button
                  size="md"
                  radius="md"
                  variant="bordered"
                  color="primary"
                  className="md:w-[50%] w-full"
                  onClick={() => {
                    router.back()
                  }}
                >
                  이전으로
                </Button>
              </BtnBox>
            </DetailBox>
          </ConArea>
        </MainWrap>
      )}
    </>
  )
}
StudentsWrite.getLayout = page => <Layout>{page}</Layout>
