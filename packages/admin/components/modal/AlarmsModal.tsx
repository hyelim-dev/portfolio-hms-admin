import { Button, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { SEE_ALARMS_QUERY, SEE_ALARMS_TOTAL_QUERY } from '@/graphql/queries'
import { ResultSeeAlarms } from '@/src/generated/graphql'
// import useUserLogsMutation from '@/utils/userLogs'
import { READ_ALARMS_MUTATION } from '@/graphql/mutations'

const FlexBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  padding: 0.5rem;
  align-items: center;
`
const Noti = styled.p`
  font-size: 0.8rem;

  span {
    color: red;
  }
`
const ScrollBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .flexList {
    padding: 0.5rem;
    max-height: 25vh;
    height: 100%;
    @media screen and (max-width: 1024px) {
      max-height: 60vh !important;
    }
  }
`
const NotiItem = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 55px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.lightPrimary};
  padding-right: 0.5rem;

  &.read {
    background: ${({ theme }) => theme.colors.lightGray};
  }
`

const NotiFlag = styled.span`
  display: block;
  width: 0.5rem;
  height: 100%;
`
const ClickBox = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`
const ReqBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: calc(100% - 1rem);
  padding: 0.3rem 0;
`
const ReqTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`
const FromID = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.black};
  font-weight: 700;
  font-size: 0.875rem;
  flex: 1;
`
const AlarmsTime = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  flex: 1;
  text-align: end;
`
const ReqText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
`

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 2rem;
  color: ${({ theme }) => theme.colors.black};

  @media screen and (max-width: 1024px) {
    height: 20vh;
  }
`

// type seeAlarmsQuery = {
//   seeAlarms: ResultSeeAlarms
// }

export default function AlarmsModal({ isListOpen }) {
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(30)
  // const { userLogs } = useUserLogsMutation()
  const [readAlarms] = useMutation(READ_ALARMS_MUTATION)
  // const { error, data, fetchMore, refetch } = useSuspenseQuery<seeAlarmsQuery>(
  //   SEE_ALARMS_QUERY,
  //   {
  //     variables: {
  //       page: 1,
  //       limit: currentLimit,
  //     },
  //   },
  // )
  const [alarms, setAlarms] = useState([])

  const [isFetching, setIsFetching] = useState(false)

  // useEffect(() => {
  //   if (isListOpen) {
  //     setCurrentPage(1)
  //     refetch()
  //   }
  // }, [isListOpen])

  // useEffect(() => {
  //   if (data && data.seeAlarms) {
  //     setAlarms(data.seeAlarms.data)
  //   }
  // }, [data])

  // const fetchMoreData = async nextPage => {
  //   await fetchMore({
  //     variables: { page: nextPage },
  //     updateQuery: (prevResult, { fetchMoreResult }) => {
  //       if (!fetchMoreResult) return prevResult

  //       const newAlarms = [
  //         ...prevResult.seeAlarms.data,
  //         ...fetchMoreResult.seeAlarms.data,
  //       ]

  //       setAlarms(newAlarms)

  //       return {
  //         ...prevResult,
  //         seeAlarms: {
  //           ...prevResult.seeAlarms,
  //           data: newAlarms,
  //           totalCount: fetchMoreResult.seeAlarms.totalCount,
  //         },
  //       }
  //     },
  //   })
  //   setCurrentPage(nextPage)
  // }

  // useEffect(() => {
  //   if (isFetching) {
  //     const nextPage = currentPage + 1
  //     fetchMoreData(nextPage).finally(() => {
  //       setIsFetching(false)
  //     })
  //   }
  // }, [isFetching])

  const handleScroll = async e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetching) {
      if (
        currentPage < 30
        // Math.ceil(data.seeAlarms.totalCount / currentLimit)
      ) {
        setIsFetching(true)
      }
    }
  }

  const clickReadAll = () => {
    const readAll = confirm('모두 읽음 처리하시겠습니까?')
    if (readAll) {
      readAlarms({
        variables: {
          all: 'Y',
        },
        refetchQueries: [SEE_ALARMS_QUERY, SEE_ALARMS_TOTAL_QUERY],
        onCompleted: result => {
          // userLogs('알람 모두 읽음 처리', `ok: ${result.readAlarms.ok}`)
          if (result.readAlarms.ok) {
            alert('모두 읽음 처리 하였습니다.')
          }
        },
      })
    }
  }

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}`
    return formatted
  }
  return (
    <>
      <FlexBox>
        <Noti>
          <span>*</span> 알람은 30일간 보관 후 삭제처리 됩니다.
        </Noti>
        {alarms?.length > 0 && (
          <Button
            size="sm"
            variant="solid"
            className="text-white bg-accent"
            onClick={clickReadAll}
          >
            <p className="text-[1rem]">
              <i className="xi-trash"></i>
            </p>
            모두 읽음
          </Button>
        )}
      </FlexBox>
      <ScrollBox>
        <ScrollShadow
          onScroll={handleScroll}
          orientation="vertical"
          className="scrollbar_g flexList"
        >
          {alarms?.length > 0 && (
            <>
              {alarms?.map((alarm, index) => (
                <NotiItem key={index}>
                  <ClickBox>
                    <NotiFlag
                      style={{ background: theme.colors.primary }}
                    ></NotiFlag>
                    <ReqBox>
                      <ReqTop>
                        <FromID>{alarm.title}</FromID>
                        <AlarmsTime>{formatDate(alarm.createdAt)}</AlarmsTime>
                      </ReqTop>
                      <ReqText>{alarm.content}</ReqText>
                    </ReqBox>
                  </ClickBox>
                </NotiItem>
              ))}
            </>
          )}
          {(alarms?.length === 0 || alarms === null) && (
            <Nolist>알람이 없습니다.</Nolist>
          )}
        </ScrollShadow>
      </ScrollBox>
    </>
  )
}
