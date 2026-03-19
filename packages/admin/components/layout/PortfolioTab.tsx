import styled from 'styled-components'
import { Suspense, useState } from 'react'
import Portfolio from '@/components/layout/Portfolio'
import PortfolioStudentList from '@/components/list/PortfolioStudentList'

const DetailBox = styled.div`
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

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const Noti = styled.p`
  font-size: 0.75rem;

  span {
    color: red;
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: right;
  }
`
const LodingDiv = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  padding: 0.3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const FlexChipBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export default function PortfolioTab({ lectureId, subjectId, students }) {
  const [isCreate, setIsCreate] = useState(false)
  const [paymentId, setPaymentId] = useState(null)
  const [studentName, setStudentName] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  }

  const sortStudents = students.sort((a, b) => {
    return naturalCompare(a.student.name, b.student.name)
  })

  return (
    <>
      <DetailBox>
        <DetailDiv>
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <PortfolioStudentList
              lectureId={lectureId}
              sortStudents={sortStudents}
              setPaymentId={setPaymentId}
              setStudentName={setStudentName}
              setIsCreateOpen={setIsCreateOpen}
            />
          </Suspense>
        </DetailDiv>
      </DetailBox>
      {isCreateOpen && (
        <DetailBox>
          <DetailDiv>
            <Suspense
              fallback={
                <LodingDiv>
                  <i className="xi-spinner-2" />
                </LodingDiv>
              }
            >
              <Portfolio
                paymentId={paymentId}
                subjectId={subjectId}
                setIsCreate={setIsCreate}
                studentName={studentName}
              />
            </Suspense>
          </DetailDiv>
        </DetailBox>
      )}
    </>
  )
}
