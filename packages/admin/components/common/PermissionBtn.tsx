// import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { gradeState } from '@/lib/recoilAtoms'
// import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import useMmeQuery from '@/utils/mMe'
import { useSuspenseQuery } from '@apollo/client'
import { Button, Link } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

// type SearchPermissionsGrantedQeury = {
//   searchPermissionsGranted: ResultSearchPermissionsGranted
// }

export default function PermissionBtn({
  btnName,
  isDisabled = null,
  style,
  permissionName,
  handleClick,
}) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  // const mId = useMme('id')
  const [permissionManagers, setPermissionManagers] = useState([])
  // const { error, data, refetch } =
  //   useSuspenseQuery<SearchPermissionsGrantedQeury>(
  //     SEARCH_PERMISSIONS_GRANTED_QUERY,
  //     {
  //       variables: {
  //         permissionName: permissionName,
  //       },
  //     },
  //   )

  // useEffect(() => {
  //   if (data) {
  //     setPermissionManagers(
  //       data.searchPermissionsGranted.data[0].ManageUser.map(
  //         manager => manager.id,
  //       ),
  //     )
  //   }
  // }, [data])

  return (
    <>
      {mGrade <= grade.subMaster ? (
        // || permissionManagers.includes(mId)
        <Button
          isDisabled={isDisabled}
          size={style.size}
          radius={style.size}
          variant={style.variant}
          color="primary"
          className={style.css}
          onClick={handleClick}
        >
          {btnName}
        </Button>
      ) : null}
    </>
  )
}
