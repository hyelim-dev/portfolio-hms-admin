import { styled, useTheme } from 'styled-components'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import { Button } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import LectureReportTable from '@/components/table/LectureReportTable'
import { useRouter } from 'next/router'
import useMmeQuery from '@/utils/mMe'
import { animate } from 'framer-motion'
import { withDemoGuard } from '@/utils/demo'

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
const Tflag = styled.div`
  width: 0.5rem;
  min-width: 7px;
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
const TIcon = styled.div`
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
const Troom = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const TsubDiv = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 8%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.08}px;
`
const TlecturName = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 21%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.21}px;
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
const Tdates = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 7%;
  padding: 1rem;
  font-size: inherit;
  min-width: ${1200 * 0.07}px;
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
const Tbtn = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 13%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.13}px;
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

export default function LectureItem(props) {
  const grade = useRecoilValue(gradeState)
  const theme = useTheme()
  const router = useRouter()
  const { useMme } = useMmeQuery()
  const mGrade = useMme('mGrade')
  const conLimit = props.limit || 0
  const conIndex = props.itemIndex
  const lecture = props.tableData
  const [isOpen, setIsOpen] = useState(props.itemIndex === 0 ? true : false)
  const arrowRef = useRef(null)

  const isDisplayFlag = (date: string): string => {
    const currentDate = new Date()
    const registeredDate = new Date(parseInt(date))
    const differenceInDays = Math.floor(
      (currentDate.getTime() - registeredDate.getTime()) /
        (1000 * 60 * 60 * 24),
    )

    if (differenceInDays >= 0) {
      return theme.colors.accent
    } else {
      return 'transparent'
    }
  }

  const flagString = isDisplayFlag(lecture.lecturePeriodEnd)

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

  const formatTime = dateString => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const extractTimeRange = dates => {
    const startTime = formatTime(dates[0])
    const endTime = formatTime(dates[1])
    return `${startTime} - ${endTime}`
  }

  const formatUsernames = data => {
    return data.map(item => item.mUsername).join(', ')
  }

  return (
    <>
      <TableItem>
        <TableRow>
          <Tflag
            style={{
              background: flagString,
            }}
          ></Tflag>
          <ClickBox onClick={() => setIsOpen(!isOpen)}>
            <div>
              <TIcon>
                <i ref={arrowRef} className="text-zinc-500 xi-angle-down-min" />
              </TIcon>
              <Tnum>
                <EllipsisBox>
                  {(props.currentPage - 1) * conLimit + (conIndex + 1)}
                </EllipsisBox>
              </Tnum>
              <Troom>
                <EllipsisBox>{lecture.roomNum}</EllipsisBox>
              </Troom>
              <TsubDiv>
                <EllipsisBox>{lecture.subDiv}</EllipsisBox>
              </TsubDiv>
              <TlecturName>
                <EllipsisBox>{lecture.temporaryName}</EllipsisBox>
              </TlecturName>
              <Tperiod>
                <EllipsisBox>
                  {formatDate(lecture.lecturePeriodStart) +
                    ' - ' +
                    formatDate(lecture.lecturePeriodEnd)}
                </EllipsisBox>
              </Tperiod>
              <Ttimes>
                <EllipsisBox>
                  {extractTimeRange(lecture.lectureTime)}
                </EllipsisBox>
              </Ttimes>
              <Tdates>
                <EllipsisBox>{lecture.lectureDetails.length}일</EllipsisBox>
              </Tdates>
              <Tteacher>
                <EllipsisBox>{formatUsernames(lecture.teachers)}</EllipsisBox>
              </Tteacher>
              <Tbtn>
                <BtnBox>
                  {mGrade < grade.teacher && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="primary"
                      className="w-full text-white"
                      onClick={withDemoGuard(e => {
                        e.preventDefault()
                        router.push(`/lecture/detail/${lecture.id}`)
                      })}
                    >
                      강의 수정
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    className="w-full"
                    onClick={e => {
                      e.preventDefault()
                      router.push(`/lecture/attendance/${lecture.id}`)
                    }}
                  >
                    출석부
                  </Button>
                </BtnBox>
              </Tbtn>
            </div>
            <div>
              <Tdiv $isOpen={isOpen}>
                <LectureReportTable
                  lecture={lecture}
                  students={props.students}
                />
              </Tdiv>
            </div>
          </ClickBox>
        </TableRow>
      </TableItem>
    </>
  )
}
