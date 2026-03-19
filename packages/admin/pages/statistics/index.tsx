import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import Layout from '@/pages/statistics/layout'
import PerformanceFilter from '@/components/filter/PerformanceFilter'
import { Suspense, useState } from 'react'
import { Button } from '@nextui-org/react'
import StatisticsList from '@/components/list/StatisticsList'

const ConBox = styled.div`
  margin: 2rem 0;
  z-index: 0;
  position: relative;
`
const DeleteDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

export default function Statistics() {
  const [filterActive, setFilterActive] = useState(true)
  const [filterSearch, setFilterSearch] = useState(false)
  const [performanceFilter, setPerformanceFilter] = useState(null)
  const [clickReset, setClickReset] = useState(false)

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={false}
          addRender={
            <DeleteDiv>
              {performanceFilter !== null && (
                <Button
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  color="primary"
                  className="bg-white min-w-unit-1"
                  onClick={() => {
                    setFilterActive(true)
                    setFilterSearch(false)
                    setPerformanceFilter(null)
                    setClickReset(true)
                  }}
                  startContent={<i className="xi-redo" />}
                ></Button>
              )}
            </DeleteDiv>
          }
        />
        <Suspense
          fallback={
            <LodingDiv>
              <i className="xi-spinner-2" />
            </LodingDiv>
          }
        >
          <PerformanceFilter
            isActive={filterActive}
            onFilterSearch={setFilterSearch}
            setPerformanceFilter={setPerformanceFilter}
            performanceFilter={performanceFilter}
            clickReset={clickReset}
            setClickReset={setClickReset}
          />
        </Suspense>
        <ConBox>
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <StatisticsList
              performanceFilter={performanceFilter}
              filterSearch={filterSearch}
            />
          </Suspense>
        </ConBox>
      </MainWrap>
    </>
  )
}
Statistics.getLayout = page => <Layout>{page}</Layout>
