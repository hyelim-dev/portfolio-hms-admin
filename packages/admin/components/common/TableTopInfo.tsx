import { Button } from '@nextui-org/react'
import { styled } from 'styled-components'
import ListLimit from '@/components/common/ListLimit'
import ColorInfo from '@/components/common/ColorInfo'

const TTopic = styled.div<{ $colorInfo: boolean; $resetList: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    align-items: ${props =>
      props.$colorInfo
        ? props.$resetList
          ? 'flex-start'
          : 'flex-start'
        : props.$resetList
        ? 'flex-end'
        : 'center'};
  }
`

const RightBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const LeftBox = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
    align-items: flex-end;
    flex-direction: column;
  }
`
const Ttotal = styled.p`
  font-weight: 300;
  margin-right: 0.5rem;
  height: 1.3rem;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`

export default function TableTopInfo({
  totalCount,
  resetList = null,
  currentLimit,
  setCurrentLimit,
  colorInfo = null,
}) {
  return (
    <>
      <TTopic
        $colorInfo={colorInfo ? true : false}
        $resetList={resetList ? true : false}
      >
        {resetList ? (
          <RightBox>
            <Ttotal>
              총 <span>{totalCount === null ? 0 : totalCount}</span>
              건이 검색되었습니다.
            </Ttotal>
            <Button size="sm" radius="sm" color="primary" onClick={resetList}>
              전체보기
            </Button>
          </RightBox>
        ) : (
          <RightBox>
            <Ttotal>
              총 <span>{totalCount === null ? 0 : totalCount}</span>건
            </Ttotal>
          </RightBox>
        )}
        <LeftBox>{colorInfo && <ColorInfo ColorData={colorInfo} />}</LeftBox>
      </TTopic>
      <ListLimit
        currentLimit={currentLimit}
        setCurrentLimit={setCurrentLimit}
      />
    </>
  )
}
