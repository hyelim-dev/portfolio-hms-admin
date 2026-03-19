import MainWrap from '@/components/wrappers/MainWrap'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { gradeState } from '@/lib/recoilAtoms'
import { IS_DEMO } from '@/utils/demo'
import useMmeQuery from '@/utils/mMe'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

export default function SubjectLayout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [permissionManagers, setPermissionManagers] = useState([])
  // const { error, data, loading, refetch } = useQuery(
  //   SEARCH_PERMISSIONS_GRANTED_QUERY,
  //   {
  //     variables: {
  //       permissionName: '과정관리접근',
  //     },
  //     onCompleted: result => {
  //       if (result.searchPermissionsGranted.ok) {
  //         setPermissionManagers(
  //           result.searchPermissionsGranted.data[0].ManageUser.map(
  //             manager => manager.id,
  //           ),
  //         )
  //       }
  //     },
  //   },
  // )

  const isCheckingLogin = useAuthRedirect()

  if (
    // loading ||
    isCheckingLogin
  ) {
    return null
  }

  if (IS_DEMO) {
    return (
      <MainWrap>
        🚧 데모 모드에서는 과정관리 기능이 비활성화되어 있습니다.
        <br />
        (실제 서비스에서는 과정 등록·수정·삭제가 가능합니다.)
      </MainWrap>
    )
  }

  if (
    mGrade <= grade.subMaster
    // || permissionManagers.includes(mId)
  ) {
    return <main>{children}</main>
  } else {
    return <MainWrap>접근 권한이 없습니다.</MainWrap>
  }
}
