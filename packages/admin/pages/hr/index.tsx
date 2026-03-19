import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import Layout from '@/pages/hr/layout'
import { Suspense, useState } from 'react'
import ManagersFilter from '@/components/filter/ManagersFilter'
import useMmeQuery from '@/utils/mMe'
import ManagersTable from '@/components/table/ManagersTable'
import ManagersFilterTable from '@/components/table/ManagersFilterTable'

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

export default function Manager() {
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [filterActive, setFilterActive] = useState()
  const [filterSearch, setFilterSearch] = useState()
  const [managerFilter, setManagerFilter] = useState()

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={true}
          write={{
            permissionName: '직원관리',
            link: '/hr/write',
          }}
          typeBtn={{
            typeLink: 'mPartType',
            permissionName: '부서',
          }}
          addRender={''}
        />
        <Suspense
          fallback={
            <LodingDiv>
              <i className="xi-spinner-2" />
            </LodingDiv>
          }
        >
          <ManagersFilter
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
              <ManagersFilterTable
                managerFilter={managerFilter}
                mGrade={mGrade}
                mId={mId}
              />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <LodingDiv>
                  <i className="xi-spinner-2" />
                </LodingDiv>
              }
            >
              <ManagersTable mGrade={mGrade} mId={mId} />
            </Suspense>
          )}
        </ConBox>
      </MainWrap>
    </>
  )
}
Manager.getLayout = page => <Layout>{page}</Layout>
