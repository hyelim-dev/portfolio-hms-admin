import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import SubjectsFilter from '@/components/filter/SubjectsFilter'
import { useRecoilState } from 'recoil'
import {
  subjectFilterActiveState,
  subjectFilterState,
  subjectSearchState,
} from '@/lib/recoilAtoms'
import Layout from '@/pages/subjects/layout'
import SubjectsTable from '@/components/table/SubjectsTable'
import SubjectsFilterTable from '@/components/table/SubjectsFilterTable'

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

export default function Subjects() {
  const [filterActive, setFilterActive] = useRecoilState(
    subjectFilterActiveState,
  )
  const [filterSearch, setFilterSearch] = useRecoilState(subjectFilterState)
  const [subjectFilter, setSubjectFilter] = useRecoilState(subjectSearchState)

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={true}
          write={{
            permissionName: null,
            link: '/subjects/write',
          }}
          typeBtn={{
            typeLink: 'subDiv',
            permissionName: '수강구분',
          }}
          addRender={''}
        />
        <SubjectsFilter
          isActive={filterActive}
          onFilterSearch={setFilterSearch}
          setSubjectFilter={setSubjectFilter}
          subjectFilter={subjectFilter}
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
              <SubjectsFilterTable subjectFilter={subjectFilter} />
            ) : (
              <SubjectsTable />
            )}
          </Suspense>
        </ConBox>
      </MainWrap>
    </>
  )
}
Subjects.getLayout = page => <Layout>{page}</Layout>
