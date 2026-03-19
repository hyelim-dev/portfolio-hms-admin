import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  consultFilterActiveState,
  consultFilterState,
  consultSearchState,
  gradeState,
} from '@/lib/recoilAtoms'
import Layout from '@/pages/consult/layout'
import ConsultationTable from '@/components/table/ConsultationTable'
import ConsultationFilterTable from '@/components/table/ConsultationFilterTable'
import ConsultationFilter from '@/components/filter/ConsultationFilter'
import useMmeQuery from '@/utils/mMe'
// import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
// import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import ConsultBranch from './ConsultBranch'

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

// type SearchPermissionsGrantedQeury = {
//   searchPermissionsGranted: ResultSearchPermissionsGranted
// }
export default function Consult({
  filterActive,
  studentFilter,
  setFilterSearch,
  setStudentFilter,
  studentManagerFilter,
  setStudentManagerFilter,
  mGrade,
  grade,
  mId,
  mUsername,
  filterSearch,
}) {
  // const { error: permissionError, data: permissionData } =
  //   useSuspenseQuery<SearchPermissionsGrantedQeury>(
  //     SEARCH_PERMISSIONS_GRANTED_QUERY,
  //     {
  //       variables: {
  //         permissionName: '상담관리자',
  //       },
  //     },
  //   )
  // const permissionManagers =
  //   permissionData.searchPermissionsGranted.data[0].ManageUser.map(
  //     manager => manager.id,
  //   )

  return (
    <>
      <Suspense
        fallback={
          <LodingDiv>
            <i className="xi-spinner-2" />
          </LodingDiv>
        }
      >
        <ConsultationFilter
          isActive={filterActive}
          studentFilter={studentFilter}
          onFilterSearch={setFilterSearch}
          setStudentFilter={setStudentFilter}
          studentManagerFilter={studentManagerFilter}
          setStudentManagerFilter={setStudentManagerFilter}
          supervisor={
            mGrade <= grade.subMaster
            // || permissionManagers.includes(mId)
          }
        />
      </Suspense>
      <ConsultBranch
        studentManagerFilter={studentManagerFilter}
        studentFilter={studentFilter}
        filterSearch={filterSearch}
        mUsername={mUsername}
        supervisor={
          mGrade <= grade.subMaster
          // || permissionManagers.includes(mId)
        }
      />
    </>
  )
}
Consult.getLayout = page => <Layout>{page}</Layout>
