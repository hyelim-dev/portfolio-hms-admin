import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from '@nextui-org/react'
import { styled } from 'styled-components'
import { SEE_MESSAGE_STORAGE_QUERY } from '@/graphql/queries'
import { useMutation } from '@apollo/client'
import { DELETE_MESSAGE_STORAGE_MUTATION } from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'

const ConLabel = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-size: 0.875rem;
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
`

const SendType = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-size: 0.875rem;

  span {
    color: ${({ theme }) => theme.colors.gray};
  }
`

const SendState = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 700;

  &.res {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &.succ {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.err {
    color: ${({ theme }) => theme.colors.accent};
  }
`

export default function SMSCardItem({
  item,
  setValue,
  setByteLength,
  setMessageCon,
}) {
  const [deleteMessageStorage] = useMutation(DELETE_MESSAGE_STORAGE_MUTATION)
  // const { userLogs } = useUserLogsMutation()

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

  const getHtmlByteSize = htmlString => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    const textContent = doc.body.innerHTML
      .replace(/&nbsp;/g, ' ')
      .replace(/<br\/?>/g, '\n')

    const encoder = new TextEncoder()
    return encoder.encode(textContent).length
  }

  const handleApply = message => {
    setMessageCon(message)
    setByteLength(getHtmlByteSize(message))
    setValue('message', message)
  }

  const handleDelete = id => {
    const isDelete = confirm('저장된 문자를 삭제하시겠습니까?')
    if (isDelete) {
      deleteMessageStorage({
        variables: {
          deleteMessageStorageId: id,
        },
        refetchQueries: [SEE_MESSAGE_STORAGE_QUERY],
        onCompleted: result => {
          // userLogs(
          //   `문자 보관함 ID : ${id} 삭제`,
          //   `ok: ${result.deleteMessageStorage.ok}`,
          // )
          if (result.deleteMessageStorage.ok) {
            alert('문자함에서 삭제 되었습니다.')
          }
        },
      })
    }
  }

  return (
    <Card
      shadow="none"
      classNames={{
        base: 'bg-white px-3 py-1 border-2 border-primary',
      }}
    >
      <CardHeader className="flex flex-col gap-3 p-2">
        <SendInfo className="first">
          <ConLabel>저장일</ConLabel>
          <ConText>{formatDate(item.createdAt)}</ConText>
        </SendInfo>
        <SendInfo>
          {getHtmlByteSize(item.message) > 90 ? (
            <SendState className="err">LMS</SendState>
          ) : (
            <SendState className="succ">SMS</SendState>
          )}

          <SendType>
            {getHtmlByteSize(item.message)}
            <span>byte</span>
          </SendType>
        </SendInfo>
      </CardHeader>
      <CardBody className="p-[0.5rem] bg-[#f4f4f6] rounded-[1rem] min-h-[13rem] max-h-[13rem]">
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <div
            style={{ whiteSpace: 'pre-wrap' }}
            className="pr-[0.5rem]"
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-center gap-[0.5rem] text-small">
        <Button
          size="sm"
          variant="solid"
          color="primary"
          className="text-white"
          onClick={() => handleApply(item.message)}
        >
          적용
        </Button>
        <Button
          size="sm"
          variant="solid"
          className="text-white bg-accent"
          onClick={() => handleDelete(item.id)}
        >
          삭제
        </Button>
      </CardFooter>
    </Card>
  )
}
