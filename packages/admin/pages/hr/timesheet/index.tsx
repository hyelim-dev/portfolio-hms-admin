import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import Layout from '@/pages/hr/timesheet/layout'
import { Suspense, useEffect, useState } from 'react'
import TimesheetFilter from '@/components/filter/TimesheetFilter'
import TimesheetTable from '@/components/table/TimesheetTable'
import TimesheetFilterTable from '@/components/table/TimesheetFilterTable'
import { useRouter } from 'next/router'

const ConBox = styled.div`
  margin: 2rem 0;
  z-index: 0;
  position: relative;
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

export default function Timesheet() {
  const router = useRouter()
  const [filterActive, setFilterActive] = useState()
  const [filterSearch, setFilterSearch] = useState()
  const [managerFilter, setManagerFilter] = useState()
  const [todayTimes, setTodayTimes] = useState([])

  useEffect(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    setTodayTimes([startOfToday, endOfToday])
  }, [router])

  return (
    todayTimes.length > 0 && (
      <>
        <MainWrap>
          <Breadcrumb
            onFilterToggle={setFilterActive}
            isActive={filterActive}
            rightArea={true}
            isFilter={true}
            addRender={''}
          />
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TimesheetFilter
              isActive={filterActive}
              onFilterSearch={setFilterSearch}
              setManagerFilter={setManagerFilter}
            />
          </Suspense>
          <ConBox>
            {filterSearch ? (
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <TimesheetFilterTable managerFilter={managerFilter} />
              </Suspense>
            ) : (
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <TimesheetTable todayTimes={todayTimes} />
              </Suspense>
            )}
          </ConBox>
        </MainWrap>
      </>
    )
  )
}
Timesheet.getLayout = page => <Layout>{page}</Layout>
