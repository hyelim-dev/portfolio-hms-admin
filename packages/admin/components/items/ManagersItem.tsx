import { styled, useTheme } from 'styled-components'
import Link from 'next/link'

const TableItem = styled.div<{ $resign: string }>`
  position: relative;
  width: 100%;
  min-width: fit-content;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${props =>
    props.$resign === 'Y' ? props.theme.colors.lightGray : '#fff'};

  &:hover {
    cursor: pointer;
    background: ${props =>
      props.$resign === 'Y'
        ? props.theme.colors.lightGray
        : 'rgba(255, 255, 255, 0.8)'};
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
  width: 6%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.06}px;
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
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
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
`
const Tphone = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Temail = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
`
const TjoiningDate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 9%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
`
const Tdate = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.07}px;
  font-weight: 600;
`
const ResignTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  vertical-align: middle;
`
const DateTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  vertical-align: middle;
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`
const Masking = styled.span`
  background: rgba(228, 228, 231, 0.8);
  -webkit-filter: blur(2.5px);
  -o-filter: blur(2.5px);
  backdrop-filter: blur(2.5px);
`

export default function ManagersItem(props) {
  const theme = useTheme()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const managerData = props.tableData
  const gradeStr = data => {
    if (data == null) {
      return 'A'
    } else {
      const idF = data?.charAt(0).toUpperCase()
      return idF
    }
  }

  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        const formatted =
          `${date.getFullYear()}-` +
          `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
          `${date.getDate().toString().padStart(2, '0')} ` +
          `미정`
        return formatted
      } else {
        const formatted =
          `${date.getFullYear()}-` +
          `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
          `${date.getDate().toString().padStart(2, '0')} ` +
          `${date.getHours().toString().padStart(2, '0')}:` +
          `${date.getMinutes().toString().padStart(2, '0')}`
        return formatted
      }
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  const calculateDday = date => {
    const timestamp = parseInt(date, 10)
    const joiningDate = new Date(timestamp)
    const today = new Date()
    const timeDiff = today.getTime() - joiningDate.getTime()
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    return daysDiff > 0 ? '+' + daysDiff : daysDiff
  }

  return (
    <>
      <TableItem $resign={managerData.resign}>
        <TableRow>
          <Link href={props.clickable ? `/hr/detail/${managerData.id}` : '#'}>
            <ClickBox>
              <Tnum>{(props.currentPage - 1) * conLimit + (conIndex + 1)}</Tnum>
              <Tavatar>
                <AvatarBox>
                  {managerData?.mAvatar ? (
                    <AvatarF
                      style={{
                        backgroundImage: `url('${managerData?.mAvatar}')`,
                      }}
                    ></AvatarF>
                  ) : (
                    <AvatarF
                      style={{
                        backgroundColor: theme.colors.tertiary,
                      }}
                    >
                      {gradeStr(managerData?.mUserId)}
                    </AvatarF>
                  )}
                </AvatarBox>
              </Tavatar>
              <Tid>
                <EllipsisBox>{managerData.mUserId}</EllipsisBox>
              </Tid>
              <Tname>
                <EllipsisBox>{managerData.mUsername}</EllipsisBox>
              </Tname>
              <Tpart>
                <EllipsisBox>{managerData.mPart.join(',')}</EllipsisBox>
              </Tpart>
              <Trank>
                <EllipsisBox>{managerData.mRank}</EllipsisBox>
              </Trank>
              <Tphone>
                <EllipsisBox>
                  {managerData.mPhoneNumCompany
                    ? managerData.mPhoneNumCompany
                    : '-'}
                </EllipsisBox>
              </Tphone>
              <Tphone>
                {managerData.resign === 'Y' ? (
                  <EllipsisBox>
                    <Masking>
                      {managerData.mPhoneNum ? managerData.mPhoneNum : '-'}
                    </Masking>
                  </EllipsisBox>
                ) : (
                  <EllipsisBox>
                    {managerData.mPhoneNum ? managerData.mPhoneNum : '-'}
                  </EllipsisBox>
                )}
              </Tphone>
              <Temail>
                {managerData.resign === 'Y' ? (
                  <EllipsisBox>
                    <Masking>
                      {managerData.email ? managerData.email : '-'}
                    </Masking>
                  </EllipsisBox>
                ) : (
                  <EllipsisBox>
                    {managerData.email ? managerData.email : '-'}
                  </EllipsisBox>
                )}
              </Temail>
              <TjoiningDate>
                <EllipsisBox>
                  {managerData.mJoiningDate
                    ? formatDate(managerData.mJoiningDate, false)
                    : '-'}
                </EllipsisBox>
              </TjoiningDate>
              {managerData.resign === 'Y' ? (
                <Tdate>
                  <ResignTag>퇴사</ResignTag>
                </Tdate>
              ) : (
                <Tdate>
                  <DateTag>
                    {managerData.mJoiningDate
                      ? calculateDday(managerData.mJoiningDate)
                      : '-'}
                  </DateTag>
                </Tdate>
              )}
            </ClickBox>
          </Link>
        </TableRow>
      </TableItem>
    </>
  )
}
