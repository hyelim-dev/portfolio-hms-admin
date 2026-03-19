import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { Button } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import Layout from '@/pages/students/layout'
import { SEARCH_STUDENT_MUTATION } from '@/graphql/mutations'
import StudentMemoForm from '@/components/form/StudentMemoForm'
import StudentMemoEditForm from '@/components/form/StudentMemoEditForm'
import StudentPaymentItem from '@/components/items/StudentPaymentItem'
import StudentInfo from '@/components/layout/infoCard/StudentInfo'
import FormTopInfo from '@/components/common/FormTopInfo'
import PermissionBtn from '@/components/common/PermissionBtn'
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
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

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
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`
const PaymentList = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  > a {
    display: block;
    width: 100%;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`
const MemoList = styled.ul`
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`
const MemoItem = styled.li`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
  textarea {
    width: 100%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`
export default function StudentsWrite() {
  const router = useRouter()
  const studentId = typeof router.query.id === 'string' ? router.query.id : null
  const [searchStudentMutation] = useMutation(SEARCH_STUDENT_MUTATION)
  const [studentData, setStudentData] = useState(null)
  const [studentPaymentData, setStudentPaymentData] = useState([])
  const [memoList, setMemoList] = useState([])

  useEffect(() => {
    searchStudentMutation({
      variables: {
        searchStudentId: parseInt(studentId),
      },
      onCompleted: data => {
        if (data.searchStudent.ok) {
          setStudentData(data.searchStudent?.student[0])
          setStudentPaymentData(data.searchStudent?.student[0].studentPayment)
          setMemoList(data.searchStudent?.student[0].studentMemo)
        }
      },
    })
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
                  <Button
                    size="sm"
                    radius="sm"
                    variant="solid"
                    color="primary"
                    className="text-white"
                    onClick={withDemoGuard(() => {
                      {
                        router.push(`/students/edit/${studentData?.id}`)
                      }
                    })}
                  >
                    수정
                  </Button>
                </AreaTitle>
                <StudentInfo
                  studentData={studentData}
                  detailAll={true}
                  record={false}
                />
                {(studentPaymentData === null ||
                  studentPaymentData?.length === 0) && (
                  <BtnBox>
                    <SuspenseWrap>
                      <PermissionBtn
                        btnName={'수강신청'}
                        style={{
                          size: 'md',
                          variant: 'solid',
                          css: 'md:w-[50%] w-full text-white',
                        }}
                        permissionName={'수강관리'}
                        handleClick={() => {
                          router.push(
                            `/students/write/course/${studentData.id}`,
                          )
                        }}
                      />
                    </SuspenseWrap>
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
                )}
              </DetailDiv>
            </DetailBox>
            {studentPaymentData?.length > 0 && (
              <DetailBox>
                <DetailDiv>
                  <AreaTitle>
                    <h4>수강 목록</h4>
                    <Suspense
                      fallback={
                        <LodingDiv>
                          <i className="xi-spinner-2" />
                        </LodingDiv>
                      }
                    >
                      <PermissionBtn
                        btnName={'과정 추가'}
                        style={{
                          size: 'sm',
                          variant: 'solid',
                          css: 'text-white bg-accent',
                        }}
                        permissionName={'수강관리'}
                        handleClick={() => {
                          router.push(
                            `/students/write/course/${studentData.id}`,
                          )
                        }}
                      />
                    </Suspense>
                  </AreaTitle>
                  <FlexBox>
                    <PaymentList>
                      {studentPaymentData?.map((item, index) => (
                        <StudentPaymentItem
                          key={index}
                          index={index}
                          detailtData={item}
                          studentId={studentData?.id}
                        />
                      ))}
                    </PaymentList>
                  </FlexBox>
                </DetailDiv>
              </DetailBox>
            )}
            {studentPaymentData?.length > 0 && (
              <DetailBox>
                <BtnBox>
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
            )}

            <DetailBox>
              <DetailDiv>
                <StudentMemoForm
                  setMemoList={setMemoList}
                  studentId={studentData?.id}
                />
                {memoList && (
                  <MemoList>
                    {memoList?.map((item, index) => (
                      <MemoItem key={index}>
                        <StudentMemoEditForm
                          item={item}
                          setMemoList={setMemoList}
                          studentId={studentData?.id}
                        />
                      </MemoItem>
                    ))}
                  </MemoList>
                )}
              </DetailDiv>
            </DetailBox>
          </ConArea>
        </MainWrap>
      )}
    </>
  )
}
StudentsWrite.getLayout = page => <Layout>{page}</Layout>
