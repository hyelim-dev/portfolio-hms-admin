import { styled } from 'styled-components'

const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const Noti = styled.p`
  font-size: 0.75rem;

  span {
    color: red;
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: right;
  }
`

export default function TabFormTopInfo({ title, noti }) {
  return (
    <AreaTitle>
      <h4>{title}</h4>
      {noti && (
        <Noti>
          <span>*</span> 는 필수입력입니다.
        </Noti>
      )}
    </AreaTitle>
  )
}
