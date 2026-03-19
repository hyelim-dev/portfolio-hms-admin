import { styled } from 'styled-components'
import { Button } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { animate } from 'framer-motion'
import EmploymentStateTable from '@/components/table/EmploymentStateTable'

const TableItem = styled.div`
  position: relative;
  width: 100%;
  min-width: fit-content;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);
  }
`

const TableRow = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
`
const ClickBox = styled.div`
  width: 100%;
  display: table-cell;

  > div {
    display: flex;
    width: 100%;
    align-items: center;
  }
`
const Tflag = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 1%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.01}px;
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
const TlecturName = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.25}px;
`
const Tperiod = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 16%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.16}px;
`
const Ttimes = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.1}px;
`

const Tteacher = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.1}px;
`
const Tcheck = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const Tbtn = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const BtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`
const Tdiv = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.09}px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  background: ${({ theme }) => theme.colors.lightYellow};
`
const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function EmploymentItem(props) {
  const router = useRouter()
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const student = props.tableData
  const [isOpen, setIsOpen] = useState(props.itemIndex === 0 ? true : false)
  const arrowRef = useRef(null)

  useEffect(() => {
    if (arrowRef.current) {
      animate(arrowRef.current, { rotate: isOpen ? 180 : 0 }, { duration: 0.2 })
    }
  }, [isOpen])

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  const formatUsernames = data => {
    return data.map(item => item.mUsername).join(', ')
  }

  const addSixMonths = dateString => {
    const timestamp = parseInt(dateString, 10)
    const date = new Date(timestamp)
    date.setMonth(date.getMonth() + 6)

    return formatDate(date.getTime())
  }
  const handleClick = id => {
    router.push({
      pathname: `/lecture/employmentDetail/${id}`,
      query: { typeTab: 'employmentState' },
    })
  }
  return (
    <>
      <TableItem>
        <TableRow>
          <ClickBox onClick={() => setIsOpen(!isOpen)}>
            <div>
              <Tflag>
                <i ref={arrowRef} className="text-zinc-500 xi-angle-down-min" />
              </Tflag>
              <Tnum>
                <EllipsisBox>
                  {(props.currentPage - 1) * conLimit + (conIndex + 1)}
                </EllipsisBox>
              </Tnum>
              <TlecturName>
                <EllipsisBox>
                  {student?.subject?.lectures?.temporaryName}
                </EllipsisBox>
              </TlecturName>
              <Tnum>
                <EllipsisBox>
                  {student?.subject?.lectures?.sessionNum}
                </EllipsisBox>
              </Tnum>
              <Tperiod>
                <EllipsisBox>
                  {formatDate(student?.subject?.lectures?.lecturePeriodStart) +
                    ' - ' +
                    formatDate(student?.subject?.lectures?.lecturePeriodEnd)}
                </EllipsisBox>
              </Tperiod>
              <Ttimes>
                <EllipsisBox>
                  {addSixMonths(student?.subject?.lectures?.lecturePeriodEnd)}
                </EllipsisBox>
              </Ttimes>
              <Tteacher>
                <EllipsisBox>
                  {student?.subject?.lectures?.teachers
                    ? formatUsernames(student?.subject?.lectures?.teachers)
                    : '-'}
                </EllipsisBox>
              </Tteacher>
              <Tname>
                <EllipsisBox>{student?.student?.name}</EllipsisBox>
              </Tname>
              <Tcheck>
                <EllipsisBox>{student?.employment}</EllipsisBox>
              </Tcheck>
              <Tbtn>
                <BtnBox>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    className="w-full"
                    onClick={() => {
                      handleClick(student.id)
                    }}
                  >
                    수정
                  </Button>
                </BtnBox>
              </Tbtn>
            </div>
            <div>
              <Tdiv $isOpen={isOpen}>
                <EmploymentStateTable student={student} />
              </Tdiv>
            </div>
          </ClickBox>
        </TableRow>
      </TableItem>
    </>
  )
}
