import { Tab, Tabs } from '@nextui-org/react'
import { styled } from 'styled-components'
import { Suspense, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { completionStatus } from '@/lib/recoilAtoms'
import DropOutList from '@/components/list/DropOutList'
import CertificateNameList from '@/components/list/CertificateNameList'
import EmploymentNameList from '@/components/list/EmploymentNameList'
import DropOutMemo from '@/components/layout/DropOutMemo'
import RegularEvaluation from '@/components/layout/RegularEvaluation'
import { useRouter } from 'next/router'
import PortfolioTab from '@/components/layout/PortfolioTab'
import TabFormTopInfo from '@/components/common/TabFormTopInfo'

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
  margin-bottom: 0.5rem;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
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

export default function AttendanceTabs({ lectureId, students, subjectId }) {
  const router = useRouter()
  const { typeTab } = router.query
  const completion = useRecoilValue(completionStatus)
  const [selected, setSelected] = useState('eduInfo')
  const dropOutStudents = students?.filter(
    student =>
      student.courseComplete === completion.dropout ||
      student.courseComplete === completion.notCompleted,
  )

  useEffect(() => {
    if (typeTab) {
      setSelected(String(typeTab))
    }
  }, [typeTab])

  return (
    <>
      <Tabs
        variant="underlined"
        aria-label="Options"
        color="primary"
        classNames={{
          tabList: 'flex-wrap',
          tab: 'w-auto',
          panel: 'flex flex-col gap-[2rem]',
        }}
        className="mt-[2rem]"
        selectedKey={selected}
        onSelectionChange={e => setSelected(String(e))}
      >
        <Tab key="dropoutList" title="중도탈락현황">
          <DetailBox>
            <DetailDiv>
              <TabFormTopInfo title={'중도 탈락 현황'} noti={false} />
              <DropOutList students={dropOutStudents} />
            </DetailDiv>
          </DetailBox>
        </Tab>
        <Tab key="dropoutMemo" title="중도탈락 사전점검">
          <DropOutMemo
            lectureId={lectureId}
            subjectId={subjectId}
            students={students}
          />
        </Tab>
        <Tab key="certificate" title="자격취득현황">
          <DetailBox>
            <DetailDiv>
              <TabFormTopInfo title={'자격 취득 현황'} noti={false} />
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <CertificateNameList lectureId={lectureId} />
              </Suspense>
            </DetailDiv>
          </DetailBox>
        </Tab>
        <Tab key="employmentState" title="취업현황">
          <DetailBox>
            <DetailDiv>
              <TabFormTopInfo title={'취업 현황'} noti={false} />
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <EmploymentNameList lectureId={lectureId} />
              </Suspense>
            </DetailDiv>
          </DetailBox>
        </Tab>
        <Tab key="wishEmployment" title="정기평가 내용설정">
          <RegularEvaluation lectureId={lectureId} subjectId={subjectId} />
        </Tab>
        <Tab key="portfolio" title="포트폴리오">
          <PortfolioTab
            students={students}
            lectureId={lectureId}
            subjectId={subjectId}
          />
        </Tab>
      </Tabs>
    </>
  )
}
