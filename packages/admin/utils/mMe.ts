import { MME_QUERY } from '@/graphql/queries'
import { useQuery } from '@apollo/client'

const useMmeQuery = () => {
  const { loading, error, data } = useQuery(MME_QUERY)
  const { mMe } = data || {}
  const { id, mUserId, mUsername, mPart, mGrade, mRank, branchId } = mMe || {}

  const useMme = e => {
    switch (e) {
      case 'id':
        return id
      case 'mUserId':
        return mUserId
      case 'mUsername':
        return mUsername
      case 'mGrade':
        return mGrade
      case 'mPart':
        return mPart
      case 'mRank':
        return mRank
      case 'branchId':
        return branchId
    }
  }

  return { useMme }
}
export default useMmeQuery
