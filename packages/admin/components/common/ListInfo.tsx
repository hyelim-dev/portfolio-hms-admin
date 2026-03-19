import { styled } from 'styled-components'

const UpdateTime = styled.div`
  display: flex;
  gap: 0.3rem;
  font-size: 0.75rem;
  padding-left: 0.5rem;
  color: ${({ theme }) => theme.colors.gray};

  @media (max-width: 768px) {
    align-items: flex-end;
    flex-wrap: wrap;
  }
`
const UpdateCon = styled.p`
  > span {
    color: #555;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    align-items: flex-end;
  }
`

export default function ListInfo({ item }) {
  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}:` +
      `${date.getSeconds().toString().padStart(2, '0')}`
    return formatted
  }

  return (
    <UpdateTime>
      <UpdateCon>
        <span>최근 업데이트 : </span>
        {item?.lastModifiedByName || item?.lastModifiedByUserId ? (
          <>
            {item?.lastModifiedByName && item?.lastModifiedByName}(
            {item?.lastModifiedByUserId && item?.lastModifiedByUserId})
          </>
        ) : null}
      </UpdateCon>
      {item?.lastModifiedByName || item?.lastModifiedByUserId ? (
        <span className="px-[0.2rem]">-</span>
      ) : null}
      <UpdateCon>
        {item?.lastModifiedTime
          ? formatDate(item?.lastModifiedTime)
          : formatDate(item?.createdAt)}
      </UpdateCon>
    </UpdateTime>
  )
}
