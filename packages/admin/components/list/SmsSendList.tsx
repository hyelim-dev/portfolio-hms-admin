import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Pagination,
  ScrollShadow,
  Tooltip,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_SMS_QUERY } from '@/graphql/queries'
import { ResultSearchSms } from '@/src/generated/graphql'

const TTopic = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding-top: 0;
  }
`
const Ttotal = styled.p`
  font-weight: 300;
  margin-right: 0.5rem;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`
const FlexBox = styled.div`
  margin-top: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  display: grid;

  @media (max-width: 1610px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 1450px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 540px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`

const ConLabel = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-size: 0.875rem;
`
const ConBox = styled.div`
  max-height: 5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-end;
`

const ConText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
`

const SendInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  &.first {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  }

  &.receiver {
    align-items: flex-start;
  }
`

const SendType = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-size: 0.875rem;
`

const SendState = styled.div`
  display: flex;
  gap: 0.1rem;
  font-size: 0.875rem;
  font-weight: 700;
  align-items: center;

  &.succ {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.err {
    color: ${({ theme }) => theme.colors.accent};
  }

  &.resSucc {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &.resErr {
    color: ${({ theme }) => theme.colors.gray};
  }

  i {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.gray};
  }
`

const PagerWrap = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: center;
`

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

type SearchSMSQuery = {
  searchSms: ResultSearchSms
}

export default function SmsSendList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(12)
  const [openTooltipIndex, setOpenTooltipIndex] = useState(null)

  const { error, data, refetch } = useSuspenseQuery<SearchSMSQuery>(
    SEARCH_SMS_QUERY,
    {
      variables: {
        branchId: 1,
        page: currentPage,
        limit: currentLimit,
      },
    },
  )

  useEffect(() => {
    refetch()
  }, [currentPage])

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

  const formatDateTime = (rDate, rTime) => {
    const year = rDate.substring(0, 4)
    const month = rDate.substring(4, 6)
    const day = rDate.substring(6, 8)
    const hour = rTime.substring(0, 2)
    const minute = rTime.substring(2, 4)

    return `${year}-${month}-${day} ${hour}:${minute}`
  }

  const getHtmlByteSize = htmlString => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    const textContent = doc.body.innerHTML
      .replace(/&nbsp;/g, ' ')
      .replace(/<br\/?>/g, '\n')

    const encoder = new TextEncoder()
    return encoder.encode(textContent).length
  }

  return (
    <>
      <TTopic>
        <Ttotal>
          총{' '}
          <span>
            {data?.searchSms?.totalCount === null
              ? '0'
              : data?.searchSms?.totalCount}
          </span>
          건
        </Ttotal>
      </TTopic>
      {data?.searchSms?.totalCount && data.searchSms.totalCount > 0 ? (
        <FlexBox>
          {data?.searchSms?.data?.map((item, index) => (
            <Card
              key={index}
              shadow="none"
              classNames={{
                base: `bg-white px-3 py-1 border-2 ${
                  item.rDate === null
                    ? item.successType === 'Y'
                      ? 'border-primary'
                      : 'border-accent'
                    : item.successType === 'Y'
                    ? 'border-secondary'
                    : 'border-gray'
                }`,
              }}
            >
              <CardHeader className="flex flex-col gap-3 p-2">
                {item.rDate === null ? (
                  <SendInfo className="first">
                    <ConLabel>발송일시</ConLabel>
                    <ConText>{formatDate(item.createdAt)}</ConText>
                  </SendInfo>
                ) : (
                  <SendInfo className="first">
                    <ConLabel>예약일시</ConLabel>
                    <ConText>{formatDateTime(item.rDate, item.rTime)}</ConText>
                  </SendInfo>
                )}
                <SendInfo>
                  {getHtmlByteSize(item.message) > 90 ? (
                    <SendType>LMS</SendType>
                  ) : (
                    <SendType>SMS</SendType>
                  )}
                  <SendState
                    className={`${
                      item.rDate === null
                        ? item.successType === 'Y'
                          ? 'succ'
                          : 'err'
                        : item.successType === 'Y'
                        ? 'resSucc'
                        : 'resErr'
                    } `}
                  >
                    <p>
                      {item.rDate === null ? '즉시전송' : '예약전송'} /{' '}
                      {item.successType === 'Y' ? '성공' : '실패'}
                    </p>
                    {item.successType === 'N' && (
                      <Tooltip
                        content={
                          <div className="px-1 py-2">
                            <p className="text-tiny">{item.failureReason}</p>
                          </div>
                        }
                        placement="bottom"
                        isOpen={openTooltipIndex === index}
                        onOpenChange={open => {
                          if (open) {
                            setOpenTooltipIndex(index)
                          } else {
                            setOpenTooltipIndex(null)
                          }
                        }}
                      >
                        <i
                          className="xi-help"
                          onClick={() => {
                            if (openTooltipIndex === index) {
                              setOpenTooltipIndex(null)
                            } else {
                              setOpenTooltipIndex(index)
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                  </SendState>
                </SendInfo>
              </CardHeader>
              <CardBody className="p-[0.5rem] bg-lightGray rounded-[1rem] min-h-[13rem] max-h-[13rem]">
                <ScrollShadow orientation="horizontal" className="scrollbar">
                  <div
                    style={{ whiteSpace: 'pre-wrap' }}
                    className="pr-[0.5rem]"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </ScrollShadow>
              </CardBody>
              <CardFooter className="flex flex-col gap-3 p-2">
                <SendInfo className="first">
                  <ConLabel>발신자</ConLabel>
                  <ConText>{item.manageUser.mUsername}</ConText>
                </SendInfo>
                <SendInfo className="first">
                  <ConLabel>발신번호</ConLabel>
                  <ConText>{item.sender}</ConText>
                </SendInfo>
                <SendInfo className="receiver">
                  <ConLabel>수신번호</ConLabel>
                  <ConBox className="scrollbar_g">
                    <ScrollShadow className="scrollbar">
                      {item.receiver.split(',').map((num, index) => (
                        <ConText key={index}>{num}</ConText>
                      ))}
                    </ScrollShadow>
                  </ConBox>
                </SendInfo>
              </CardFooter>
            </Card>
          ))}
        </FlexBox>
      ) : (
        <Nolist>발송된 문자가 없습니다.</Nolist>
      )}

      {data.searchSms.totalCount > 0 && (
        <PagerWrap>
          <Pagination
            variant="light"
            showControls
            initialPage={1}
            page={currentPage}
            total={Math.ceil(data.searchSms.totalCount / currentLimit)}
            onChange={newPage => {
              setCurrentPage(newPage)
            }}
          />
        </PagerWrap>
      )}
    </>
  )
}
