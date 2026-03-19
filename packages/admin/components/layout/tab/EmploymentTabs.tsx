import { Tab, Tabs } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import useMmeQuery from '@/utils/mMe'
import EducationalHistory from '@/components/layout/EducationalHistory'
import CareerHistory from '@/components/layout/CareerHistory'
import Certificate from '@/components/layout/Certificate'
import EmploymentMemo from '@/components/layout/EmploymentMemo'
import RecoEmployment from '@/components/layout/RecoEmployment'
import Employment from '@/components/layout/Employment'
import { useRouter } from 'next/router'
import WishEmployment from '@/components//layout/WishEmployment'

export default function EmploymentTabs({ paymentId, subjectId }) {
  const router = useRouter()
  const { typeTab } = router.query
  const { useMme } = useMmeQuery()
  const mId = useMme('mUserId')
  const [selected, setSelected] = useState('eduInfo')

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
        <Tab key="eduInfo" title="학력사항">
          <EducationalHistory
            paymentId={paymentId}
            subjectId={subjectId}
            mId={mId}
          />
        </Tab>
        <Tab key="career" title="경력사항">
          <CareerHistory
            paymentId={paymentId}
            subjectId={subjectId}
            mId={mId}
          />
        </Tab>
        <Tab key="certificate" title="자격취득현황">
          <Certificate paymentId={paymentId} subjectId={subjectId} mId={mId} />
        </Tab>
        <Tab key="consultation" title="상담현황">
          <EmploymentMemo
            paymentId={paymentId}
            subjectId={subjectId}
            mId={mId}
          />
        </Tab>
        <Tab key="wishEmployment" title="취업희망현황">
          <WishEmployment paymentId={paymentId} subjectId={subjectId} />
        </Tab>
        <Tab key="recoEmployment" title="취업추천현황">
          <RecoEmployment
            paymentId={paymentId}
            subjectId={subjectId}
            mId={mId}
          />
        </Tab>
        <Tab key="employmentState" title="취업현황">
          <Employment paymentId={paymentId} subjectId={subjectId} />
        </Tab>
      </Tabs>
    </>
  )
}
