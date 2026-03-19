import { styled } from 'styled-components'

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    align-items: flex-end;
    flex-direction: column-reverse;
  }
`
const Noti = styled.p`
  span {
    color: red;
  }
`
const UpdateTime = styled.div`
  display: flex;
  gap: 0.3rem;

  @media (max-width: 768px) {
    align-items: flex-end;
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
export default function FormTopInfo({ noti, item, time }) {
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
    <TopInfo>
      <Noti>
        {noti && (
          <>
            <span>*</span> 는 필수입력입니다.
          </>
        )}
      </Noti>
      <UpdateTime>
        {time && (
          <>
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
              <span>-</span>
            ) : null}
            <UpdateCon>
              {item?.lastModifiedTime
                ? formatDate(item?.lastModifiedTime)
                : formatDate(item?.createdAt)}
            </UpdateCon>
          </>
        )}
      </UpdateTime>
    </TopInfo>
  )
}
