import '@/styles/global.css'
import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'
import { RecoilRoot, RecoilEnv } from 'recoil'
import Head from 'next/head'
import { GlobalStyle } from '@/styles/GlobalStyle'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apolloClient'
import { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/styles/theme'
import ErrorBoundary from '@/components/wrappers/ErrorBoundary'
import MSWProvider from '@/src/mocks/handlers/MSWProvider'
// import { __DEV__ } from '@apollo/client/utilities/globals'
// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

// if (__DEV__) {
//   // Adds messages only in a dev environment
//   loadDevMessages()
//   loadErrorMessages()
// }

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => page)
  const [toastLimit, setToastLimit] = useState(5)

  useEffect(() => {
    const updateToastLimit = () => {
      const width = window.innerWidth
      setToastLimit(width < 768 ? 1 : 5)
    }

    window.addEventListener('resize', updateToastLimit)
    updateToastLimit()

    return () => {
      window.removeEventListener('resize', updateToastLimit)
    }
  }, [])

  return (
    <MSWProvider>
      <ApolloProvider client={apolloClient}>
        <RecoilRoot>
          <ThemeProvider theme={lightTheme}>
            <NextUIProvider>
              <ErrorBoundary>
                <Head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                  />
                  <title>HMS</title>
                </Head>
                <GlobalStyle />

                <ToastContainer limit={toastLimit} />
                {getLayout(<Component {...pageProps} />)}
              </ErrorBoundary>
            </NextUIProvider>
          </ThemeProvider>
        </RecoilRoot>
      </ApolloProvider>
    </MSWProvider>
  )
}
