import WishForm from '@/components/form/WishForm'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
import { ResultSearchSm } from '@/src/generated/graphql'
import WishEditForm from '@/components/form/WishEditForm'

type searchSMQuery = {
  searchSM: ResultSearchSm
}

export default function WishEmploymentList({ paymentId, subjectId }) {
  const { error, data, refetch } = useSuspenseQuery<searchSMQuery>(
    SEARCH_SM_QUERY,
    {
      variables: {
        modelType: 'HopeForEmployment',
        studentPaymentId: paymentId,
      },
    },
  )

  return (
    <>
      {data?.searchSM.data.length > 0 ? (
        <WishEditForm
          item={data?.searchSM.data.length > 0 ? data?.searchSM.data[0] : null}
          refetch={refetch}
        />
      ) : (
        <WishForm paymentId={paymentId} subjectId={subjectId} />
      )}
    </>
  )
}
