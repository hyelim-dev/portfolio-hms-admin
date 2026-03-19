import { styled } from 'styled-components'

const FromID = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-weight: 700;
  width: inherit;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`
const ReqText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  width: inherit;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export default function ReqToast({ messageData }) {
  return (
    <>
      <FromID>{messageData?.alarmTitle}</FromID>
      <ReqText>{messageData?.alarmContent}</ReqText>
    </>
  )
}
