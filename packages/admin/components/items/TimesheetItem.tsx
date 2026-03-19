import { styled, useTheme } from 'styled-components'
import Link from 'next/link'

const TableItem = styled.div`
  position: relative;
  width: 100%;
  min-width: fit-content;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;

  &:hover {
    cursor: pointer;
    background: 'rgba(255, 255, 255, 0.8)';
  }
`
const TableRow = styled.div`
  position: relative;
  display: table;
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
const AvatarBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`
const AvatarF = styled.div`
  position: relative;
  border-radius: 100%;
  overflow: hidden;
  width: 2rem;
  height: 2rem;
  background-color: #fff;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 1rem;
  text-align: center;
  color: #fff;
  font-weight: 700;
  line-height: 2rem;
`
const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 5%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.05}px;

  @media (max-width: 1024px) {
    width: 10%;
    min-width: ${800 * 0.1}px;
  }
`
const Tavatar = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 6%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.06}px;

  @media (max-width: 1024px) {
    width: 11%;
    min-width: ${800 * 0.11}px;
  }
`
const Tid = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: ${({ theme }) => theme.colors.secondary};
  min-width: ${1200 * 0.1}px;
  font-weight: 600;

  @media (max-width: 1024px) {
    width: 15%;
    min-width: ${800 * 0.15}px;
  }
`
const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: ${({ theme }) => theme.colors.primary};
  min-width: ${1200 * 0.09}px;
  font-weight: 600;

  @media (max-width: 1024px) {
    width: 14%;
    min-width: ${800 * 0.14}px;
  }
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 12%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.12}px;

  @media (max-width: 1024px) {
    width: 17%;
    min-width: ${800 * 0.17}px;
  }
`
const Trank = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;

  @media (max-width: 1024px) {
    width: 13%;
    min-width: ${800 * 0.13}px;
  }
`
const TjoiningDate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 15%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.15}px;

  @media (max-width: 1024px) {
    width: 20%;
    min-width: ${800 * 0.2}px;
  }
`
const EmptyBox = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 35%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.35}px;

  @media (max-width: 1024px) {
    display: none;
  }
`
const EllipsisBox = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default function TimesheetItem(props) {
  const theme = useTheme()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const managerAttendanceData = props.tableData
  const gradeStr = data => {
    if (data == null) {
      return 'A'
    } else {
      const idF = data?.charAt(0).toUpperCase()
      return idF
    }
  }

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}:` +
      `${date.getSeconds().toString().padStart(2, '0')}`
    return formatted
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <Link href={`/hr/detail/${managerAttendanceData.ManageUser.id}`}>
            <ClickBox>
              <Tnum>{(props.currentPage - 1) * conLimit + (conIndex + 1)}</Tnum>
              <Tavatar>
                <AvatarBox>
                  {managerAttendanceData.ManageUser?.mAvatar ? (
                    <AvatarF
                      style={{
                        backgroundImage: `url('${managerAttendanceData.ManageUser?.mAvatar}')`,
                      }}
                    ></AvatarF>
                  ) : (
                    <AvatarF
                      style={{
                        backgroundColor: theme.colors.tertiary,
                      }}
                    >
                      {gradeStr(managerAttendanceData.ManageUser?.mUserId)}
                    </AvatarF>
                  )}
                </AvatarBox>
              </Tavatar>
              <Tid>
                <EllipsisBox>
                  {managerAttendanceData.ManageUser.mUserId}
                </EllipsisBox>
              </Tid>
              <Tname>
                <EllipsisBox>
                  {managerAttendanceData.ManageUser.mUsername}
                </EllipsisBox>
              </Tname>
              <TjoiningDate>
                <EllipsisBox>
                  {managerAttendanceData.clockIn
                    ? formatDate(managerAttendanceData.clockIn)
                    : '-'}
                </EllipsisBox>
              </TjoiningDate>
              <Tpart>
                <EllipsisBox>
                  {managerAttendanceData.ManageUser.mPart.join(',')}
                </EllipsisBox>
              </Tpart>
              <Trank>
                <EllipsisBox>
                  {managerAttendanceData.ManageUser.mRank}
                </EllipsisBox>
              </Trank>
              <EmptyBox></EmptyBox>
            </ClickBox>
          </Link>
        </TableRow>
      </TableItem>
    </>
  )
}
