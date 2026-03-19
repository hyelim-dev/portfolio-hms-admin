import { styled } from 'styled-components'

const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 60%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
  min-width: 360px;
  font-size: 0.875rem;
  font-weight: 600;
  vertical-align: middle;
  text-align: left;
  color: ${({ theme }) => theme.colors.gray};
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const TsubDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 17%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 102px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
  vertical-align: middle;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Tfee = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 23%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 132px;
  vertical-align: middle;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

export default function SubjectsItem(props) {
  const subject = props.tableData
  const feeFormet = fee => {
    const result = fee
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  return (
    <>
      <Tname>{`[${subject.round}회차] ${subject.subjectName}`}</Tname>
      <TsubDiv>{subject.subDiv}</TsubDiv>
      <Tfee>{feeFormet(subject.fee)}</Tfee>
    </>
  )
}
