import { styled } from 'styled-components'

const ColorCipBox = styled.div`
  display: flex;
  height: 1.3rem;
`

const ColorCip = styled.p`
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.7rem;

  span {
    display: inline-block;
    margin-right: 0.5rem;
    width: 1rem;
    height: 2px;
  }

  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0.5rem;

    &:last-child {
      padding-right: 0;
    }
  }
`

export default function ColorInfo({ ColorData }) {
  return (
    <ColorCipBox>
      {ColorData.map((item, index) => (
        <ColorCip key={index}>
          <span style={{ background: item.background }}></span> : {item.text}
        </ColorCip>
      ))}
    </ColorCipBox>
  )
}
