import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { Suspense, useState } from 'react'
import Layout from '@/pages/students/nonassigned/layout'
import NonassignedFilter from '@/components/filter/NonassignedFilter'
import NonassignedTable from '@/components/table/NonassignedTable'
import NonassignedFilterTable from '@/components/table/NonassignedFilterTable'

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
export default function Nonassigned() {
  const [filterActive, setFilterActive] = useState(false)
  const [filterSearch, setFilterSearch] = useState(false)
  const [studentFilter, setStudentFilter] = useState(null)

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={true}
        />
        <NonassignedFilter
          isActive={filterActive}
          onFilterSearch={setFilterSearch}
          setStudentFilter={setStudentFilter}
        />
        <ConBox>
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            {filterSearch ? (
              <NonassignedFilterTable studentFilter={studentFilter} />
            ) : (
              <NonassignedTable />
            )}
          </Suspense>
        </ConBox>
      </MainWrap>
    </>
  )
}
Nonassigned.getLayout = page => <Layout>{page}</Layout>
