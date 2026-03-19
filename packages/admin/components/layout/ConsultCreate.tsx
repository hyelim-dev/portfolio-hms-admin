import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import FormTopInfo from '@/components/common/FormTopInfo'
import ConsultForm from '@/components/form/ConsultForm'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'

const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
`
type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function ConsultCreate({ mGrade, mId }) {
  const grade = useRecoilValue(gradeState)

  const { error: permissionError, data: permissionData } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          permissionName: '상담관리자',
        },
      },
    )
  const permissionManagers =
    permissionData.searchPermissionsGranted.data[0].ManageUser.map(
      manager => manager.id,
    )

  return (
    <>
      <Breadcrumb rightArea={false} isFilter={false} />
      <DetailBox>
        <FormTopInfo item={null} noti={true} time={false} />
        <ConsultForm
          supervisor={
            mGrade <= grade.subMaster || permissionManagers.includes(mId)
          }
        />
      </DetailBox>
    </>
  )
}
