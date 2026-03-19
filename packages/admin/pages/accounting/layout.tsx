import useMmeQuery from '@/utils/mMe'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import MainWrap from '@/components/wrappers/MainWrap'

export default function AccountingLayout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [permissionManagers, setPermissionManagers] = useState([])
  // const { error, data, loading, refetch } = useQuery(
  //   SEARCH_PERMISSIONS_GRANTED_QUERY,
  //   {
  //     variables: {
  //       permissionName: '회계관리접근',
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
    //loading ||
    isCheckingLogin
  ) {
    return null
  }

  if (
    mGrade <= grade.subMaster
    //|| permissionManagers.includes(mId)
  ) {
    return <main>{children}</main>
  } else {
    return <MainWrap>접근 권한이 없습니다.</MainWrap>
  }
}
