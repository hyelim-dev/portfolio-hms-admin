import { styled } from 'styled-components'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function PaymentInfoManager({ studentPaymentData }) {
  const route = useRouter()
  const {
    data: managerData,
    error,
    refetch,
  } = useSuspenseQuery<SearchPermissionsGrantedQeury>(
    SEARCH_PERMISSIONS_GRANTED_QUERY,
    {
      variables: {
        permissionName: '상담관리접근',
      },
    },
  )
  const managerList = managerData?.searchPermissionsGranted.data[0].ManageUser

  useEffect(() => {
    refetch({
      permissionName: '상담관리접근',
    })
  }, [route])

  return (
    <>
      <LineBox>
        {
          managerList.find(
            user => user.id === studentPaymentData?.processingManagerId,
          )?.mUsername
        }
      </LineBox>
    </>
  )
}
