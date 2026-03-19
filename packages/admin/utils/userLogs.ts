import { USER_LOGS_MUTATION } from '@/graphql/mutations'
import { useMutation } from '@apollo/client'

const useUserLogsMutation = () => {
  const [userLogsResult] = useMutation(USER_LOGS_MUTATION)
  const userLogs = (evt, description?) => {
    userLogsResult({
      variables: {
        eventName: evt,
        description: description,
      },
    })
  }

  return { userLogs }
}
export default useUserLogsMutation
