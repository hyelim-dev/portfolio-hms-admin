import { Chip } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import {
  EDIT_MANAGE_USER_MUTATION,
  EDIT_PERMISSIONMS_GRANTED_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { styled } from 'styled-components'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'

const ChipBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export default function PermissionMasterEditForm({ permission }) {
  // const { userLogs } = useUserLogsMutation()
  const [editPermissionGranted] = useMutation(
    EDIT_PERMISSIONMS_GRANTED_MUTATION,
  )
  const [editManager] = useMutation(EDIT_MANAGE_USER_MUTATION)

  const grantSubMasters = async id => {
    const result = await editManager({
      variables: {
        editManageUserId: id,
        mGrade: 9,
        lastModifiedTime: new Date(),
      },
    })
    // userLogs(
    //   `managerID : ${id} 부운영자해제`,
    //   `ok: ${result.data.editManageUser.ok}`,
    // )
    if (!result.data.editManageUser.ok) {
      throw new Error(`${permission.permissionName} 부운영자해제 실패`)
    }
  }

  const deletePermission = async (id, name) => {
    const isModify = confirm(`${name}의 권한을 해제하시겠습니까?`)
    if (isModify) {
      try {
        const { data: resultData } = await editPermissionGranted({
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
        //   `ok: ${resultData.editPermissionsGranted.ok} , manager: ${name}`,
        // )
        if (!resultData.editPermissionsGranted.ok) {
          throw new Error(`${permission.permissionName} 권한 수정 실패`)
        }

        try {
          await grantSubMasters(id)
          alert(`${name}의 ${permission.permissionName} 권한이 해제되었습니다.`)
        } catch (error) {
          console.error(`managerID: ${id} 부운영자 해제 중 에러 발생:`, error)
        }
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
