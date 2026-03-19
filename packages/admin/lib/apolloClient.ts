// lib/apolloClient.ts
import { onError } from '@apollo/client/link/error'
import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  ApolloLink,
  from,
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { getNewToken } from '@/lib/getNewToken'

// console.log(process.env.NEXT_PUBLIC_GRAPHQL_URI, '환경변수')
const TOKEN = 'token'
const REFRESH_TOKEN = 'refreshToken'
export const isLoggedInVar = makeVar(
  typeof window !== 'undefined' ? Boolean(localStorage.getItem(TOKEN)) : false,
)
// const httpLink = createHttpLink({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
// })
const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(TOKEN)
  const headers = operation.getContext().headers || {} // 기본 헤더 객체 설정
  operation.setContext({
    headers: {
      ...headers,
      token: token,
    },
  })
  return forward(operation)
})

// const errorLink = onError(
//   ({ graphQLErrors, networkError, operation, forward }) => {
//     if (graphQLErrors) {
//       graphQLErrors.forEach(({ message, locations, path }) => {
//         console.error(
//           `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
//         )
//         if (
//           message === 'UNAUTHENTICATED' ||
//           message.includes('Cannot return null for non-nullable field')
//         ) {
//           console.log('토큰이 만료가 되었다.')
//           localStorage.removeItem('token')
//           localStorage.removeItem('refreshToken')
//           window.location.href = '/login'
//         }
//       })
//     }
//     if (networkError) console.error(`[Network error]: ${networkError}`)
//   },
// )

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const { message } of graphQLErrors) {
        if (
          message === 'UNAUTHENTICATED' ||
          message.includes('Cannot return null for non-nullable field')
        ) {
          window.location.reload()
          console.log('토큰이 만료되었습니다.')
          const refreshToken = localStorage.getItem('refreshToken')

          if (refreshToken) {
            // 비동기 작업을 IIFE로 처리
            ;(async function () {
              try {
                const newToken = await getNewToken(apolloClient, refreshToken)
                console.log('새로운 토큰:', newToken)

                if (newToken) {
                  localStorage.setItem('token', newToken)

                  // 기존 요청의 헤더를 업데이트합니다.
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      ...headers,
                      token: newToken,
                    },
                  }))

                  // 수정된 요청을 다시 서버로 전송합니다.
                  forward(operation).subscribe({
                    next: response => {
                      window.location.reload()
                      console.log('재시도 요청이 성공했습니다:', response)
                    },
                    error: err => {
                      console.error('재시도 중 에러 발생:', err)
                      // 여기서는 토큰을 지우지 않고 에러만 처리합니다.
                    },
                  })
                } else {
                  console.error('토큰 갱신에 실패했습니다. 새 토큰이 없습니다.')
                  // 토큰 갱신에 실패했을 때 로그아웃 처리
                  localStorage.removeItem('token')
                  localStorage.removeItem('refreshToken')
                  window.location.href = '/login' // 로그인 페이지로 리디렉션
                }
              } catch (error) {
                console.error('토큰 재발급 중 에러 발생:', error)
                // 토큰 갱신 도중 에러 발생 시 로그아웃 처리
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login' // 로그인 페이지로 리디렉션
              }
            })()
          } else {
            console.error(
              '리프레시 토큰이 없습니다. 로그아웃을 고려해야 할 수도 있습니다.',
            )
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login' // 로그인 페이지로 리디렉션
          }
        }
      }
    }

    if (networkError) console.error(`[Network error]: ${networkError}`)
  },
)

const link = ApolloLink.from([authLink, errorLink, uploadLink]) // 여기서 uploadLink를 추가합니다.
export const apolloClient = new ApolloClient({
  // link: authLink.concat(uploadLink),
  link,
  cache: new InMemoryCache(),
})

//로그인
export const LogUserIn = (token: string, refreshToken: string) => {
  localStorage.setItem(TOKEN, token)
  localStorage.setItem(REFRESH_TOKEN, refreshToken)
  isLoggedInVar(true)
}
export const LogUserOut = () => {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  sessionStorage.removeItem('newStudent')
  sessionStorage.removeItem('newStudentState')
  sessionStorage.removeItem('newConsult')
  sessionStorage.removeItem('todayStudentTotal')
  sessionStorage.removeItem('newAccounting')
  sessionStorage.removeItem('today')
  apolloClient.clearStore()
}
