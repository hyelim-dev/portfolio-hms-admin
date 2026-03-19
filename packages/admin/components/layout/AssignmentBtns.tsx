import { useEffect, useState } from 'react'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { useSuspenseQuery } from '@apollo/client'
import useMmeQuery from '@/utils/mMe'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import AssignmentForm from '@/components/form/AssignmentForm'

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function AssignmentBtns({
  paymentId,
  studentData,
  studentSubjectData,
  studentPaymentData,
  setStudentPaymentData,
  studentPaymentDetailData,
}) {
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const mId = useMme('id')
  const [permissionManagers, setPermissionManagers] = useState([])
  const { error, data, refetch } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          permissionName: '수강관리',
        },
      },
    )

  useEffect(() => {
    if (data) {
      setPermissionManagers(
        data.searchPermissionsGranted.data[0].ManageUser.map(
          manager => manager.id,
        ),
      )
    }
  }, [data])

  return (
    <>
      <AssignmentForm
        paymentId={paymentId}
        studentData={studentData}
        studentSubjectData={studentSubjectData}
        studentPaymentData={studentPaymentData}
        setStudentPaymentData={setStudentPaymentData}
        studentPaymentDetailData={studentPaymentDetailData}
        editable={mGrade <= grade.subMaster || permissionManagers.includes(mId)}
      />
    </>
  )
}
