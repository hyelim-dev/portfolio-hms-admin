import { styled } from 'styled-components'

const TableRow = styled.div`
  position: relative;
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
  /* display: grid;
  width: 100%;
  grid-template-columns: 0.5rem 2% auto; */
`
const ClickBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const Tphone = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 30%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.3}px;
`
const Tdate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function EmploymentStateItem({ student }) {
  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  const calculateAge = birthday => {
    const today = new Date()
    const timestamp = parseInt(birthday, 10)
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDifference = today.getMonth() - birthDate.getMonth()
    const dayDifference = today.getDate() - birthDate.getDate()

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--
    }

    return age
  }

  return (
    <>
      <TableRow>
        <ClickBox>
          <Tphone>{student?.subDiv}</Tphone>
          <Tphone>
            <EllipsisBox>{student?.student?.phoneNum1}</EllipsisBox>
          </Tphone>
          <Tnum>{calculateAge(student?.student?.birthday)}</Tnum>
          <Tphone>
            <EllipsisBox>
              {student?.supportType ? student?.supportType : '-'}
            </EllipsisBox>
          </Tphone>
          <Tdate>
            <EllipsisBox>
              {student?.StudentConsultation?.length > 0
                ? student?.StudentConsultation[
                    student?.StudentConsultation?.length - 1
                  ].typeOfConsultation
                : '-'}
            </EllipsisBox>
          </Tdate>
          <Tdate>
            <EllipsisBox>
              {student?.StudentConsultation?.length > 0
                ? formatDate(
                    student?.StudentConsultation[
                      student?.StudentConsultation?.length - 1
                    ].dateOfConsultation,
                  )
                : '-'}
            </EllipsisBox>
          </Tdate>
          <Tdate>
            <EllipsisBox>
              {student?.EmploymentStatus?.length > 0
                ? formatDate(student?.EmploymentStatus[0]?.dateOfEmployment)
                : '-'}
            </EllipsisBox>
          </Tdate>
          <Tname>
            <EllipsisBox>
              {student?.EmploymentStatus?.length > 0
                ? student?.EmploymentStatus[0]?.companyName
                : '-'}
            </EllipsisBox>
          </Tname>
        </ClickBox>
      </TableRow>
    </>
  )
}
