import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import Layout from '@/pages/students/layout'
import { styled } from 'styled-components'
import StudentsFilter from '@/components/filter/StudentsFilter'
import { useRecoilState } from 'recoil'
import {
  studentFilterActiveState,
  studentFilterState,
  studentSearchState,
} from '@/lib/recoilAtoms'
import { Suspense } from 'react'
import StudentsTable from '@/components/table/StudentsTable'
import StudentsFilterTable from '@/components/table/StudentsFilterTable'

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

export default function Students() {
  const [filterActive, setFilterActive] = useRecoilState(
    studentFilterActiveState,
  )
  const [filterSearch, setFilterSearch] = useRecoilState(studentFilterState)
  const [studentFilter, setStudentFilter] = useRecoilState(studentSearchState)

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
            link: '/students/write',
          }}
        />
        <StudentsFilter
          isActive={filterActive}
          onFilterSearch={setFilterSearch}
          setStudentFilter={setStudentFilter}
          studentFilter={studentFilter}
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
              <StudentsFilterTable studentFilter={studentFilter} />
            ) : (
              <StudentsTable />
            )}
          </Suspense>
        </ConBox>
      </MainWrap>
    </>
  )
}
Students.getLayout = page => <Layout>{page}</Layout>
