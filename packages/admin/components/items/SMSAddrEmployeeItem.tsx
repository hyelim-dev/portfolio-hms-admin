import { styled } from 'styled-components'

const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 20%;
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
  width: 30%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Trank = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 20%;
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

export default function SMSAddrEmployeeItem(props) {
  const data = props.manager

  return (
    <>
      <Tname>{data.mUsername}</Tname>
      <Tpart>
        <EllipsisBox>{data.mPart.join(',')}</EllipsisBox>
      </Tpart>
      <Trank>
        <EllipsisBox>{data.mRank}</EllipsisBox>
      </Trank>
      <Tphone>{data.mPhoneNum}</Tphone>
    </>
  )
}
