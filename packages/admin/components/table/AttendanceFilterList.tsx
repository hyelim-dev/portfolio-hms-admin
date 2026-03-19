import { styled, useTheme as styledComponentsTheme } from 'styled-components'
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table'
import {
  CellSelect,
  HeaderCellSelect,
  SelectClickTypes,
  useRowSelect,
} from '@table-library/react-table-library/select'
import { useTheme as tableLibraryTheme } from '@table-library/react-table-library/theme'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  CREATE_ATTENDANCE_MUTATION,
  CREATE_WORKLOGS_MUTATION,
  EDIT_ATTENDANCE_MUTATION,
} from '@/graphql/mutations'
import { SEE_ATTENDANCE_ALL_QUERY } from '@/graphql/queries'
import { useRouter } from 'next/router'
// import useUserLogsMutation from '@/utils/userLogs'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  assignmentState,
  attendanceSelectedStudentState,
  attendanceSMSState,
  completionStatus,
} from '@/lib/recoilAtoms'
import WorksLogsBox from '@/components/modal/WorksLogsBox'

const PagerWrap = styled.div`
  display: flex;
  justify-content: center;
`

const BtnCell = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`

const BtnBox = styled.div`
  display: flex;
  width: 50%;
  margin: 0 auto;
  justify-content: space-between;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const TodayTag = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  margin-left: 0.4rem;
  padding: 0.1rem 0.5rem;
  vertical-align: middle;
`

export default function AttendanceFilterList({
  lectureData,
  students,
  filterAttandanceData,
  isTeacher,
}) {
  const router = useRouter()
  const themeColor = styledComponentsTheme()
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  // const { userLogs } = useUserLogsMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const today = new Date().toISOString().split('T')[0]
  const [page, setPage] = useState(1)
  const [periodArr, setPeriodArr] = useState([])
  const [periodArrIndex, setPeriodArrIndex] = useState(null)
  const [week, setWeek] = useState(null)
  const [todayIndex, setTodayIndex] = useState(null)
  const [attendanceAllData, setAttendanceAllData] = useState([])
  const [teachers, setTeachers] = useState(null)
  const [isEdit, setIsEdit] = useState(null)
  const tableRef = useRef(null)
  const [data, setData] = useState({ nodes: [] })
  const [selectedValues, setSelectedValues] = useState([])
  const [selectWrokLogDate, setSelectWrokLogDate] = useState(null)
  const [gridTemplateColumns, setGridTemplateColumns] = useState(
    '50px 50px 100px 100px repeat(4, 70px)',
  )

  const [gridTemplateColumnsMo, setGridTemplateColumnsMo] = useState('100px')
  const [createAttendance] = useMutation(CREATE_ATTENDANCE_MUTATION)
  const [createWorkLogs] = useMutation(CREATE_WORKLOGS_MUTATION)
  const [EditAttendance] = useMutation(EDIT_ATTENDANCE_MUTATION)
  const [seeAttendance, { refetch: seeAttendanceRefetch }] = useLazyQuery(
    SEE_ATTENDANCE_ALL_QUERY,
  )

  const [selectedStudent, setSelectedStudent] = useRecoilState(
    attendanceSelectedStudentState,
  )
  const [clickSms, setClickSms] = useRecoilState(attendanceSMSState)

  useEffect(() => {
    const storedScrollPosition = window.localStorage.getItem('scrollPosition')
    if (storedScrollPosition !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(storedScrollPosition, 10))
        window.localStorage.removeItem('scrollPosition') // 복원 후 삭제
      }, 500)
    }
  }, [])

  const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  }

  const fetchAttendanceForDate = async (date, id) => {
    const { data } = await seeAttendance({
      variables: {
        attendanceDate: date,
        lecturesId: id,
      },
    })
    const filterData = data?.seeAttendance?.enrollData
    const sortedEnrollData = [...(filterData || [])].sort((a, b) => {
      return naturalCompare(a.student.name, b.student.name)
    })

    return sortedEnrollData
  }
  const fetchAllAttendance = async () => {
    if (week.length > 0) {
      const fetchToday = new Date(today)
      const allData = await Promise.all(
        week.map(date => {
          const attendanceDate = new Date(date)
          if (attendanceDate <= fetchToday) {
            return fetchAttendanceForDate(date, lectureData.id)
          } else {
            return []
          }
        }),
      )
      setAttendanceAllData(allData)
    }
  }

  const splitArrayIntoChunks = (array, chunkSize) => {
    const chunks = []

    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize)
      if (chunk.length < chunkSize) {
        while (chunk.length < chunkSize) {
          chunk.push('')
        }
      }
      chunks.push(chunk)
    }

    return chunks
  }

  useEffect(() => {
    if (lectureData) {
      const chunks = splitArrayIntoChunks(filterAttandanceData, 5)
      setPeriodArr(chunks)
      setPeriodArrIndex(1)
      setPage(1)
      setWeek(chunks[0])
      const sortOrder = students.sort((a, b) => {
        return naturalCompare(a.student.name, b.student.name)
      })
      setData({ nodes: sortOrder })
      const teachersId = lectureData.teachers.map(teacher => teacher.id)
      setTeachers(teachersId)
    }
  }, [lectureData, filterAttandanceData])

  useEffect(() => {
    if (week) {
      const dataIndex = week.indexOf(today)
      setTodayIndex(dataIndex)
      setIsEdit(new Array(week.length).fill(false))
      fetchAllAttendance()
    }
  }, [week, today])

  useEffect(() => {
    if (periodArr.length > 0 && page !== null) {
      setWeek(periodArr[page - 1])
    }
  }, [page, periodArr])

  useEffect(() => {
    if (week) {
      const initialValues = week.map((day, dayIndex) =>
        data.nodes.map((item, index) =>
          attendanceAllData[dayIndex] && attendanceAllData[dayIndex][index]
            ? attendanceAllData[dayIndex][index].attendanceState
            : item.courseComplete === completion.dropout
              ? '중도탈락'
              : '-',
        ),
      )
      setSelectedValues(initialValues)
    }
  }, [attendanceAllData, week])

  useEffect(() => {
    if (todayIndex > 2 && tableRef.current) {
      setTimeout(() => {
        const scrollWidth = tableRef.current.scrollWidth
        tableRef.current.scrollLeft = scrollWidth
      }, 100)
    }
  }, [todayIndex])

  const onSelectChange = (action, state) => {
    let selectedIds = state.ids ? state.ids : []

    if (action.type === 'ADD_ALL') {
      selectedIds = selectedIds.filter(id => {
        const item = data.nodes.find(node => node.id === id)
        return item && item.courseComplete !== completion.dropout
      })
    }

    const selectedAaaData = selectedIds.map(id => {
      const student = data.nodes.find(node => node.id === id)
      return student ? student.student : null
    })
    setSelectedStudent(selectedAaaData)
    setClickSms(true)
  }

  const handleSelectChange = (value, itemIndex, dayIndex) => {
    const updatedValues = [...selectedValues]
    const updatedIsEdit = [...isEdit]

    if (selectedValues[dayIndex][itemIndex] === value) {
      updatedIsEdit[dayIndex] = false
    } else {
      updatedValues[dayIndex][itemIndex] = value
      setSelectedValues(updatedValues)
      updatedIsEdit[dayIndex] = true
    }
    setIsEdit(updatedIsEdit)
  }

  const select = useRowSelect(
    data,
    {
      onChange: onSelectChange,
    },
    {
      clickType: SelectClickTypes.ButtonClick,
    },
  )

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  useEffect(() => {
    if (week) {
      let newGridTemplateColumns = '50px 50px 100px 100px'
      let newGridTemplateColumnsMo = '100px'

      if (todayIndex < 0) {
        for (let i = 0; i < 5; i++) {
          newGridTemplateColumns += ' repeat(1, minmax(min-content, 1fr))'
          newGridTemplateColumnsMo += ' repeat(1, minmax(min-content, 1fr))'
        }
      } else {
        if (todayIndex !== 0) {
          for (let i = 0; i < todayIndex; i++) {
            newGridTemplateColumns += ' repeat(1, minmax(min-content, 1fr))'
            newGridTemplateColumnsMo += ' repeat(1, minmax(min-content, 1fr))'
          }
        }
        newGridTemplateColumns += ' repeat(1, minmax(min-content, 2fr))'
        newGridTemplateColumnsMo += ' repeat(1, minmax(min-content, 2fr))'
        for (let i = 0; i < 4 - todayIndex; i++) {
          newGridTemplateColumns += ' repeat(1, minmax(min-content, 1fr))'
          newGridTemplateColumnsMo += ' repeat(1, minmax(min-content, 1fr))'
        }
      }

      setGridTemplateColumns(newGridTemplateColumns)
      setGridTemplateColumnsMo(newGridTemplateColumnsMo)
    }
  }, [week, todayIndex])

  const theme = tableLibraryTheme([
    // getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns:${gridTemplateColumns};
        text-align:center;
        font-size: 0.875rem;
        color: ${themeColor.colors.gray};
        max-height:1200px;

        @media (max-width: 768px) {
        --data-table-library_grid-template-columns:${gridTemplateColumnsMo};
          }
      `,
      BaseCell: `
        padding: 1rem;

        &:nth-of-type(${todayIndex >= 0 ? 5 + todayIndex : -1}) {
          border-left: 0.2rem solid ${themeColor.colors.secondary};
          border-right: 0.2rem solid ${themeColor.colors.secondary};
        }
        &:nth-of-type(1) {
          position: sticky;
          left: 0;
          z-index: 2;
          @media (max-width: 768px) {
            display:none;
          }
        }

        &:nth-of-type(2) {
          left: 50px;
          @media (max-width: 768px) {
            display:none;
          }
        }
        &:nth-of-type(3) {
          left: 100px;
          @media (max-width: 768px) {
            left: 0;
          }

        }
        &:nth-of-type(4) {
          left: 200px;
            @media (max-width: 768px) {
            display:none;
          }
        }


        > div {
          overflow:unset;
          white-space:unset;
          text-overflow:unset;

      
        }
        select {
          cursor:pointer;
        }
      `,
      HeaderRow: `
        background:#fff;
      `,
      HeaderCell: `
        text-align:center;
        padding: 1rem;
        font-weight: 600;
        color:#111;
        border-bottom: 1px solid ${themeColor.colors.lightGray};
        
        &:nth-of-type(1) {
          z-index: 3 !important;
        }
          
        &:nth-of-type(${todayIndex >= 0 && 5 + todayIndex}) {
          border-radius: 0.5rem 0.5rem  0 0;
          border-top: 0.2rem solid ${themeColor.colors.secondary};
        }

        span {
          display: inline-block;
          vertical-align:middle;
        }
      `,
      Row: `
        background:#fff;
        &:nth-of-type(odd){
          background:#fff;
        }
        &:nth-of-type(even){
          background:${themeColor.colors.lightPrimary};
          
          &.drop {
            background-color: ${themeColor.colors.lightPrimary} !important; 
          }
        }

        &:last-of-type{
          > td:nth-of-type(${todayIndex >= 0 && 5 + todayIndex}) {
            border-radius: 0 0 0.5rem 0.5rem;
            border-bottom: 0.2rem solid ${themeColor.colors.secondary};
          }
        }

        &:hover {
          cursor: default;
        }

        &.drop {
          font-weight: normal !important;
          background-color: #fff !important; 
        }
      `,
    },
  ])

  const extractProperty = (data, property) => {
    return data.nodes.map(item => {
      const keys = property.split('.')
      let value = item
      for (const key of keys) {
        if (value && key in value) {
          value = value[key]
        } else {
          return null
        }
      }
      return value
    })
  }

  const openWorkLog = date => {
    setSelectWrokLogDate(date)
    onOpen()
  }

  const onSubmit = index => {
    const attendanceDate = String(week[index])
    const id = extractProperty(data, `student.id`)
    const payMentID = extractProperty(data, `id`)
    const state = selectedValues[index]

    createAttendance({
      variables: {
        lecturesId: lectureData.id,
        studentPaymentId: payMentID,
        attendanceDate: attendanceDate,
        studentId: id,
        attendanceState: state,
      },
      onCompleted: resData => {
        // userLogs(
        //   `강의ID:${lectureData.id}의 ${attendanceDate} 출석 체크`,
        //   `ok: ${resData.createAttendance.ok}`,
        // )
        if (resData.createAttendance.ok) {
          createWorkLogs({
            variables: {
              lecturesId: lectureData.id,
              workLogsDate: attendanceDate,
            },
            onCompleted: result => {
              if (result.createWorkLogs.ok) {
                alert(`${attendanceDate} 출석체크 완료`)
                window.localStorage.setItem(
                  'scrollPosition',
                  window.scrollY.toString(),
                )
                // window.location.reload()
              }
            },
          })
        }
      },
    })
  }

  const onEdit = index => {
    const attendanceDate = String(week[index])
    const attendanceId = attendanceAllData[index].map(i => i.id)
    const state = selectedValues[index]

    EditAttendance({
      variables: {
        editAttendanceId: attendanceId,
        attendanceState: state,
        lastModifiedTime: new Date(),
      },
      onCompleted: resData => {
        // userLogs(
        //   `강의ID:${lectureData.id}의 ${attendanceDate} 출석 수정`,
        //   `ok: ${resData.editAttendance.ok}`,
        // )
        if (resData.editAttendance.ok) {
          alert(`${attendanceDate} 출석수정 완료`)
          window.localStorage.setItem(
            'scrollPosition',
            window.scrollY.toString(),
          )
          // window.location.reload()
        }
      },
    })
  }
  return (
    week && (
      <>
        <div>
          <Table
            ref={tableRef}
            data={data}
            theme={theme}
            layout={{
              custom: true,
              horizontalScroll: true,
              fixedHeader: true,
            }}
            select={select}
            className="pb-2 scrollbar"
          >
            {tableList => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCellSelect pinLeft />
                    <HeaderCell pinLeft>No</HeaderCell>
                    <HeaderCell pinLeft>이름</HeaderCell>
                    <HeaderCell pinLeft>수강구분</HeaderCell>
                    {week.map((item, index) => (
                      <HeaderCell key={index}>
                        <span>{item}</span>
                        {index === todayIndex && <TodayTag>Today</TodayTag>}
                      </HeaderCell>
                    ))}
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList
                    .filter(
                      student =>
                        student.lectureAssignment === assignment.assignment,
                    )
                    .map((item, index) => (
                      <Row
                        key={item.id}
                        item={item}
                        className={
                          item.courseComplete === completion.dropout && 'drop'
                        }
                      >
                        {item.courseComplete === completion.dropout ? (
                          <Cell pinLeft>
                            <input type="checkbox" disabled />
                          </Cell>
                        ) : (
                          <CellSelect item={item} />
                        )}

                        <Cell pinLeft>
                          {item.courseComplete === completion.dropout
                            ? 'X'
                            : `${index + 1}`}
                        </Cell>
                        <Cell pinLeft>{item.student.name}</Cell>
                        <Cell pinLeft>{item.subDiv}</Cell>
                        {attendanceAllData.map((dayValue, dayIndex) => (
                          <Cell key={dayIndex}>
                            {item.courseComplete === completion.dropout ? (
                              <Select
                                size="sm"
                                labelPlacement="outside"
                                label={<span className="hidden">출석표</span>}
                                placeholder={' '}
                                className="w-full"
                                classNames={{
                                  value: 'text-black opacity-1 text-center',
                                  trigger: `${
                                    index % 2 === 1 && 'border-white'
                                  }`,
                                  label: 'hidden',
                                }}
                                isDisabled={true}
                                variant="bordered"
                                selectedKeys={[selectedValues[dayIndex][index]]}
                                onChange={e => {
                                  handleSelectChange(
                                    e.target.value,
                                    index,
                                    dayIndex,
                                  )
                                }}
                              >
                                <SelectItem
                                  isReadOnly
                                  key={'출석'}
                                  value={'출석'}
                                >
                                  출석
                                </SelectItem>
                                <SelectItem
                                  isReadOnly
                                  key={'지각'}
                                  value={'지각'}
                                >
                                  지각
                                </SelectItem>
                                <SelectItem
                                  isReadOnly
                                  key={'조퇴'}
                                  value={'조퇴'}
                                >
                                  조퇴
                                </SelectItem>
                                <SelectItem
                                  isReadOnly
                                  key={'결석'}
                                  value={'결석'}
                                >
                                  결석
                                </SelectItem>
                                <SelectItem
                                  isReadOnly
                                  key={'외출'}
                                  value={'외출'}
                                >
                                  외출
                                </SelectItem>
                                <SelectItem
                                  isReadOnly
                                  key={'중도탈락'}
                                  value={'중도탈락'}
                                >
                                  중도탈락
                                </SelectItem>
                              </Select>
                            ) : (
                              <Select
                                size="sm"
                                labelPlacement="outside"
                                label={<span className="hidden">출석표</span>}
                                placeholder={' '}
                                className="w-full"
                                classNames={{
                                  value: 'text-black opacity-1 text-center',
                                  trigger: `${
                                    index % 2 === 1 && 'border-white'
                                  }`,
                                  label: 'hidden',
                                }}
                                isDisabled={
                                  attendanceAllData[dayIndex]?.length === 0
                                    ? week[dayIndex] === ''
                                      ? true
                                      : todayIndex >= 0 && dayIndex > todayIndex
                                        ? true
                                        : false
                                    : false
                                }
                                variant="bordered"
                                selectedKeys={[selectedValues[dayIndex][index]]}
                                onChange={e => {
                                  handleSelectChange(
                                    e.target.value,
                                    index,
                                    dayIndex,
                                  )
                                }}
                              >
                                <SelectItem key={'-'} value={'-'}>
                                  -
                                </SelectItem>
                                <SelectItem key={'출석'} value={'출석'}>
                                  출석
                                </SelectItem>
                                <SelectItem key={'지각'} value={'지각'}>
                                  지각
                                </SelectItem>
                                <SelectItem key={'조퇴'} value={'조퇴'}>
                                  조퇴
                                </SelectItem>
                                <SelectItem key={'결석'} value={'결석'}>
                                  결석
                                </SelectItem>
                                <SelectItem key={'외출'} value={'외출'}>
                                  외출
                                </SelectItem>
                              </Select>
                            )}
                          </Cell>
                        ))}
                      </Row>
                    ))}
                  <Row
                    item={{
                      id: '1',
                      nodes: [],
                    }}
                  >
                    <Cell pinLeft></Cell>
                    <Cell pinLeft></Cell>
                    <Cell pinLeft></Cell>
                    <Cell pinLeft></Cell>
                    <>
                      {week.map((item, index) => (
                        <Cell key={index}>
                          <BtnCell>
                            <Button
                              isDisabled={
                                attendanceAllData[index]?.length === 0
                                  ? true
                                  : false
                              }
                              size="sm"
                              radius="sm"
                              variant="solid"
                              color="primary"
                              onClick={() => openWorkLog(item)}
                            >
                              일지
                            </Button>
                            {index >= todayIndex && todayIndex >= 0 ? (
                              <>
                                {index === todayIndex &&
                                attendanceAllData[todayIndex]?.length !== 0 ? (
                                  <Button
                                    isDisabled={
                                      index > todayIndex || !isEdit[index]
                                        ? true
                                        : false
                                    }
                                    size="sm"
                                    radius="sm"
                                    variant="solid"
                                    className="text-white bg-secondary"
                                    onClick={() => onEdit(index)}
                                  >
                                    수정
                                  </Button>
                                ) : (
                                  <Button
                                    isDisabled={
                                      index !== todayIndex &&
                                      attendanceAllData[index]?.length === 0
                                    }
                                    size="sm"
                                    radius="sm"
                                    variant="solid"
                                    className="text-white bg-secondary"
                                    onClick={() => onSubmit(index)}
                                  >
                                    저장
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                {attendanceAllData[index]?.length === 0 ? (
                                  <Button
                                    isDisabled={
                                      selectedValues[todayIndex] &&
                                      selectedValues[todayIndex].includes('-')
                                    }
                                    size="sm"
                                    radius="sm"
                                    variant="solid"
                                    className="text-white bg-secondary"
                                    onClick={() => onSubmit(index)}
                                  >
                                    저장
                                  </Button>
                                ) : (
                                  <Button
                                    isDisabled={!isEdit[index] ? true : false}
                                    size="sm"
                                    radius="sm"
                                    variant="solid"
                                    className="text-white bg-secondary"
                                    onClick={() => onEdit(index)}
                                  >
                                    수정
                                  </Button>
                                )}
                              </>
                            )}
                          </BtnCell>
                        </Cell>
                      ))}
                    </>
                  </Row>
                </Body>
              </>
            )}
          </Table>
        </div>
        {!isTeacher && (
          <BtnBox>
            <Button
              size="md"
              variant="solid"
              className="w-full text-black bg-[#FEE500]"
              onClick={() => alert('준비중입니다. SMS발송을 이용해주세요.')}
            >
              <i className="xi-kakaotalk text-[1.5rem]" />
              카카오톡발송
            </Button>
            <Button
              size="md"
              variant="bordered"
              color="primary"
              className="w-full"
              onClick={() => router.push('/message/sms')}
            >
              SMS발송
            </Button>
          </BtnBox>
        )}
        <PagerWrap>
          <Pagination
            variant="light"
            showControls
            initialPage={page}
            page={page}
            total={periodArr.length}
            onChange={newPage => {
              handlePageChange(newPage)
            }}
          />
        </PagerWrap>
        {isOpen && (
          <WorksLogsBox
            isOpen={isOpen}
            onClose={onClose}
            teachers={teachers}
            lectureId={lectureData.id}
            workLogeDate={selectWrokLogDate}
            key={selectWrokLogDate}
            dates={lectureData.lectureDetails}
          />
        )}
      </>
    )
  )
}
