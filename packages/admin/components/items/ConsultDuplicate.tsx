import { Link } from '@nextui-org/react'
import { styled } from 'styled-components'
import Layout from '@/pages/students/layout'

const FlexCardBox = styled.div`
  display: flex;
  gap: 1rem;
  border: 2px solid hsl(240 6% 90%);
  border-radius: 0.5rem;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  text-align: center;

  &:hover {
    cursor: pointer;
    background: hsl(240 6% 97%);
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`
const AreaBox = styled.div`
  display: flex;
  width: 25%;
  min-width: 270px;

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.colors.offWhite};
    min-width: 100%;
  }
`
const Tdetail = styled.div`
  width: 75%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  font-weight: 700;
  text-align: left;
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    width: 100%;
    text-align: left;
  }
`
const Tnum = styled.div`
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 40px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const TreceiptDiv = styled.div`
  width: 35%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 110px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const TadviceType = styled.div`
  width: 55%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 140px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function ConsultDuplicate({ index, listData }) {
  const studentAdvice = listData?.adviceTypes?.map(item => item.type)
  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  return (
    <>
      <Link href={`/consult/detail/${listData.id}`} style={{ width: '100%' }}>
        <FlexCardBox>
          <FlexBox>
            <AreaBox>
              <Tnum>{index}</Tnum>
              <TreceiptDiv>{formatDate(listData.createdAt)}</TreceiptDiv>
              <TadviceType>
                <EllipsisBox>{studentAdvice}</EllipsisBox>
              </TadviceType>
            </AreaBox>
            <Tdetail>
              <EllipsisBox>
                {listData.detail === '' ? '상담 내용 없음' : listData.detail}
              </EllipsisBox>
            </Tdetail>
          </FlexBox>
        </FlexCardBox>
      </Link>
    </>
  )
}
