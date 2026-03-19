import { styled } from 'styled-components'

const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 40%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Tphone = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

const EllipsisBox = styled.p`
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default function SMSAddrTeacherItem(props) {
  const data = props.teacher

  return (
    <>
      <Tname>
        <EllipsisBox>{data.mUsername}</EllipsisBox>
      </Tname>
      <Tpart>
        <EllipsisBox>{data.mPart.join(',')}</EllipsisBox>
      </Tpart>
      <Tphone>
        <EllipsisBox>{data.mPhoneNum}</EllipsisBox>
      </Tphone>
    </>
  )
}
