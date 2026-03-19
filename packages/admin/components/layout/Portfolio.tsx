import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_SM_QUERY } from '@/graphql/queries'

import PortfolioForm from '@/components/form/PortfolioForm'
import PortfolioEditForm from '@/components/form/PortfolioEditForm'
import { ResultSearchSm } from '@/src/generated/graphql'

type searchSMQuery = {
  searchSM: ResultSearchSm
}

export default function Portfolio({
  paymentId,
  subjectId,
  studentName,
  setIsCreate,
}) {
  
  const { error, data, refetch } = useSuspenseQuery<searchSMQuery>(
    SEARCH_SM_QUERY,
    {
      variables: {
        modelType: 'StudentPortfolio',
        studentPaymentId: paymentId,
      },
    },
  )
  if (error) {
    console.log(error)
  }

  return (
    <>
      {data?.searchSM.data.length > 0 ? (
        <PortfolioEditForm
          item={data?.searchSM.data.length > 0 ? data?.searchSM.data[0] : null}
          refetch={refetch}
          studentName={studentName}
        />
      ) : (
        <PortfolioForm
          paymentId={paymentId}
          subjectId={subjectId}
          setIsCreate={setIsCreate}
          studentName={studentName}
        />
      )}
    </>
  )
}
