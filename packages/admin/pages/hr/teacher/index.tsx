import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import Layout from '@/pages/hr/teacher/layout'
import { Suspense, useState } from 'react'
import useMmeQuery from '@/utils/mMe'
import TeachersTable from '@/components/table/TeachersTable'
import TeachersFilterTable from '@/components/table/TeachersFilterTable'
import TeachersFilter from '@/components/filter/TeachersFilter'

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

export default function Teacher() {
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [filterActive, setFilterActive] = useState()
  const [filterSearch, setFilterSearch] = useState()
  const [teacherFilter, setTeacherFilter] = useState()

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={true}
          write={{
            permissionName: '강사관리',
            link: '/hr/teacherWrite',
          }}
          typeBtn={{
            typeLink: 'teacherType',
            permissionName: '강의분야',
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
          <TeachersFilter
            isActive={filterActive}
            onFilterSearch={setFilterSearch}
            setTeacherFilter={setTeacherFilter}
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
              <TeachersFilterTable
                teacherFilter={teacherFilter}
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
              <TeachersTable mGrade={mGrade} mId={mId} />
            </Suspense>
          )}
        </ConBox>
      </MainWrap>
    </>
  )
}
Teacher.getLayout = page => <Layout>{page}</Layout>
