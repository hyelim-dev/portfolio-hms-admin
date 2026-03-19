import { gql, ApolloClient } from '@apollo/client'

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      error
      newAccessToken
      ok
    }
  }
`

export const getNewToken = async (
  client: ApolloClient<any>, // Apollo Client 인스턴스를 받아서 사용합니다.
  refreshToken: string,
): Promise<string | null> => {
  try {
    // mutate 메서드를 호출하여 뮤테이션을 실행합니다.
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    })

    if (data?.refreshToken?.ok && data.refreshToken.newAccessToken) {
      return data.refreshToken.newAccessToken
    } else {
      console.error(
        '토큰 갱신 실패:',
        data?.refreshToken?.error || '알 수 없는 오류',
      )
      return null
    }
  } catch (error) {
    console.error('토큰 재발급 요청 중 에러 발생:', error)
    return null
  }
}
