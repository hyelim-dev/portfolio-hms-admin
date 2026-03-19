import styled from 'styled-components'
import ChipCheckbox from '@/components/common/ChipCheckbox'

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

export default function AdviceTypeModalChip({ adviceList }) {
  return (
    <>
      {adviceList?.map((item, index) => (
        <ChipCheckbox key={item.id} value={item.id}>
          {item.type}
        </ChipCheckbox>
      ))}
      {adviceList === null && <Nolist>등록된 분야가 없습니다.</Nolist>}
    </>
  )
}
