import PerformanceList from '@/components/table/PerformanceList'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { useSuspenseQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function StatisticsList({ performanceFilter, filterSearch }) {
  const router = useRouter()
  const { data, error } = useSuspenseQuery<SearchPermissionsGrantedQeury>(
    SEARCH_PERMISSIONS_GRANTED_QUERY,
    {
      variables: {
        permissionName: '영업실적대상자',
      },
    },
  )
  const managerList = data?.searchPermissionsGranted.data[0].ManageUser
  const [ids, setIds] = useState(null)
  const [names, setNames] = useState(null)
  const [dateRange, setDateRange] = useState(null)

  useEffect(() => {
    if (performanceFilter === null) {
      const allIds = managerList?.map(user => user.id)
      const currentDate = new Date()
      const sixMonthsAgoDate = new Date()
      sixMonthsAgoDate.setMonth(currentDate.getMonth() - 6)
      setIds(allIds)
      setDateRange([sixMonthsAgoDate, currentDate])
    } else {
      setIds(performanceFilter.processingManagerId)
      setDateRange(performanceFilter.period)
    }
  }, [router, performanceFilter])

  if (error) {
    console.log(error)
  }

  return (
    ids &&
    dateRange && (
      <PerformanceList
        ids={ids}
        dateRange={dateRange}
        filterSearch={filterSearch}
        managerList={managerList}
      />
    )
  )
}
