import type { ManageUserMock } from '@/src/mocks/data/manageUser.mock'
import { MANAGE_USER_ALL } from '@/src/mocks/data/manageUser.mock'

export type PermissionsGrantedMock = {
  __typename: 'PermissionsGranted'
  id: number
  permissionName: string
  topic: string
  ManageUser: ManageUserMock[]
  smsPermitted: string
  readOnly: string
  allPermitted: string
  createdAt: string
  updatedAt: string
  branchId: number
  lastModifiedTime: string
}

export const getPermittedManagersByPermissionName = (
  permissionName: string,
): ManageUserMock[] => {
  // 상담관리접근: 영업 담당자용 → 직원(grade 9)만
  if (permissionName === '상담관리접근') {
    return MANAGE_USER_ALL.filter(u => u.mGrade === 9 && u.resign !== 'Y')
  }

  // 기본 권한 정책: 마스터(1) + 직원(9), 강사(99) 제외
  return MANAGE_USER_ALL.filter(
    u => (u.mGrade === 1 || u.mGrade === 9) && u.resign !== 'Y',
  )
}

export const buildPermissionsGrantedMock = (
  permissionName: string,
): PermissionsGrantedMock => {
  const ManageUser = getPermittedManagersByPermissionName(permissionName)
  const now = new Date().toISOString()

  return {
    __typename: 'PermissionsGranted',
    id: 1,
    permissionName,
    topic: 'MOCK',
    ManageUser,
    smsPermitted: 'N',
    readOnly: 'N',
    allPermitted: 'N',
    createdAt: now,
    updatedAt: now,
    branchId: 1,
    lastModifiedTime: now,
  }
}
