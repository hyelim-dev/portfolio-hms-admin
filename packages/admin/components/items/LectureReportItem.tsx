import { styled } from 'styled-components'

const TableRow = styled.div`
  position: relative;
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
`
const ClickBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Tlong = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function LectureReportItem(props) {
  return (
    props && (
      <>
        <TableRow>
          <ClickBox>
            <Tnum>
              <EllipsisBox>
                {props.approvedPersonnel ? props.approvedPersonnel : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.confirmedPersonnel ? props.confirmedPersonnel : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.enrollmentRate ? `${props.enrollmentRate}%` : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.courseDropout ? props.courseDropout : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.incomplete ? props.incomplete : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.dropoutRate ? `${props.dropoutRate}%` : '-'}
              </EllipsisBox>
            </Tnum>
            <Tlong>
              <EllipsisBox>
                {props.earlyEmployment ? props.earlyEmployment : '-'}
              </EllipsisBox>
            </Tlong>
            <Tnum>
              <EllipsisBox>
                {props.graduates ? props.graduates : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.graduationRate ? `${props.graduationRate}%` : '-'}
              </EllipsisBox>
            </Tnum>
            <Tnum>
              <EllipsisBox>
                {props.employedRate ? `${props.employedRate}%` : '-'}
              </EllipsisBox>
            </Tnum>
            <Tlong>
              <EllipsisBox>
                {props.expectedEmploymentProof
                  ? props.expectedEmploymentProof
                  : '-'}
              </EllipsisBox>
            </Tlong>
          </ClickBox>
        </TableRow>
      </>
    )
  )
}
