import { styled } from 'styled-components'
import DropOutNameItem from '@/components/items/DropOutNameItem'

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

export default function DropOutList({ students }) {
  return (
    <>
      {students?.length > 0 ? (
        <>
          {students &&
            students.map((item, index) => (
              <DropOutNameItem key={index} item={item} />
            ))}
        </>
      ) : (
        <>
          <Nolist>등록된 중도 탈락 현황이 없습니다.</Nolist>
        </>
      )}
    </>
  )
}
