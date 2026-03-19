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

export default function SMSAddrStudentItem(props) {
  const data = props.student
  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    return LocalDdate
  }

  return (
    <>
      <Tname>
        <EllipsisBox>{data.name}</EllipsisBox>
      </Tname>
      <Tpart>
        <EllipsisBox>{getDate(data.birthday)}</EllipsisBox>
      </Tpart>
      <Tphone>
        <EllipsisBox>{data.phoneNum1}</EllipsisBox>
      </Tphone>
    </>
  )
}
