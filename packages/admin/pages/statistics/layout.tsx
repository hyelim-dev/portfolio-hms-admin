import MainWrap from '@/components/wrappers/MainWrap'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { gradeState } from '@/lib/recoilAtoms'
import { IS_DEMO } from '@/utils/demo'
import useMmeQuery from '@/utils/mMe'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

export default function StatisticsLayout({ children }) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [viewer, setViewer] = useState(false)
  const [permissionManagers, setPermissionManagers] = useState([])
  // const { error, data, refetch, loading } = useQuery(
  //   SEARCH_PERMISSIONS_GRANTED_QUERY,
  //   {
  //     variables: {
  //       permissionName: '영업성과접근',
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

  if (IS_DEMO) {
    return (
      <MainWrap>
        🚧 데모 모드에서는 통계(영업성과) 기능이 비활성화되어 있습니다.
        <br />
        (실제 서비스에서는 영업 담당자의 총 결제금액, 총 환불금액, 총 영업
        횟수를 그래프로 확인할 수 있으며, 영업 담당자별·기간별 필터링을 통해
        내역을 조회할 수 있습니다.)
      </MainWrap>
    )
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
