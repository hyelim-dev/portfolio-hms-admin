import { styled } from 'styled-components'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import PermissionMasterAddForm from '@/components/form/PermissionMasterAddForm'
import PermissionMasterEditForm from '@/components/form/PermissionMasterEditForm'

const PermissionBox = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1em;
`
const NotiBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 0.5rem;

  p {
    position: relative;
    padding-left: 0.5rem;
  }

  span {
    position: absolute;
    top: 0.1rem;
    left: 0;
    color: red;
  }
`
const BoxArea = styled.div`
  display: flex;
  width: 100%;
  gap: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const BoxBtn = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
  max-width: 1400px;
`

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function PermissionMasterTabItem({ permissionName }) {
  const { error, data, refetch } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          permissionName: permissionName,
        },
      },
    )

  return (
    data && (
      <>
        <PermissionBox>
          <BoxArea>
            <NotiBox>
              <p>
                <span>*</span> 부운영자권한은 운영자권한과 동일합니다.
                <br />
                부운영자권한을 부여받는 경우, 현재 적용할 수 있는 모든 권한을
                운영자와 동일하게 부여받습니다. &#40;부운영자관리 제외&#41;
              </p>
            </NotiBox>
            <BoxBtn>
              <PermissionMasterAddForm
                permission={data.searchPermissionsGranted.data[0]}
              />
            </BoxBtn>
            <PermissionMasterEditForm
              permission={data.searchPermissionsGranted.data[0]}
            />
          </BoxArea>
        </PermissionBox>
      </>
    )
  )
}
