import { styled } from 'styled-components'
import PermissionCate from '@/components/layout/PermissionCate'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'

const PermissionBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function PermissionTabItem({ topicName }) {
  const { error, data, refetch } =
    useSuspenseQuery<SearchPermissionsGrantedQeury>(
      SEARCH_PERMISSIONS_GRANTED_QUERY,
      {
        variables: {
          topic: topicName,
        },
      },
    )

  return (
    data && (
      <>
        <PermissionBox>
          {data.searchPermissionsGranted.data.map((permission, index) => (
            <PermissionCate key={index} permission={permission} />
          ))}
        </PermissionBox>
      </>
    )
  )
}
