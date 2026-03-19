import { Chip } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { EDIT_PERMISSIONMS_GRANTED_MUTATION } from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { styled } from 'styled-components'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'

const ChipBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export default function PermissionEditForm({ permission }) {
  // const { userLogs } = useUserLogsMutation()
  const [editPermissionGranted] = useMutation(
    EDIT_PERMISSIONMS_GRANTED_MUTATION,
  )

  const deletePermission = async (id, name) => {
    const isModify = confirm(`${name}의 권한을 해제하시겠습니까?`)
    if (isModify) {
      try {
        const result = await editPermissionGranted({
          variables: {
            editPermissionsGrantedId: permission.id,
            permissionName: permission.permissionName,
            topic: permission.topic,
            manageUserIdsToDisconnect: [id],
            lastModifiedTime: new Date(),
          },
          refetchQueries: [SEARCH_PERMISSIONS_GRANTED_QUERY],
        })
        // userLogs(
        //   `${permission.permissionName} 권한 해제`,
        //   `ok: ${result.data.editPermissionsGranted.ok} , manager: ${name}`,
        // )
        if (!result.data.editPermissionsGranted.ok) {
          throw new Error(`${permission.permissionName} 권한 수정 실패`)
        }

        alert(`${name}의 ${permission.permissionName} 권한이 해제되었습니다.`)
      } catch (error) {
        console.error(
          `${permission.permissionName} 권한 수정 중 에러 발생:`,
          error,
        )
      }
    }
  }

  return (
    <>
      <ChipBox>
        {permission.ManageUser &&
          permission.ManageUser.map((item, index) => (
            <Chip
              key={index}
              variant="bordered"
              onClose={() => deletePermission(item.id, item.mUsername)}
              className={'hover:border-primary'}
            >
              {item.mUsername}
            </Chip>
          ))}
      </ChipBox>
    </>
  )
}
