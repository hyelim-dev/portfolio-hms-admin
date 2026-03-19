import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  SEARCH_TIME_TOTAL_QUERY,
  SEARCH_WORKLOGS_QUERY,
  SEE_ATTENDANCE_QUERY,
} from '@/graphql/queries'
import WorksLogs from '@/components/modal/WorksLogs'

export default function WorksLogsModal({
  isOpen,
  onClose,
  lectureId,
  workLogeDate,
  teachers,
  dates,
}) {
  const [seeAttendance] = useLazyQuery(SEE_ATTENDANCE_QUERY)
  const [searchWorkLog] = useLazyQuery(SEARCH_WORKLOGS_QUERY)
  const [searchTimeTotal] = useLazyQuery(SEARCH_TIME_TOTAL_QUERY)
  const [workLogData, setWorkLogData] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [timeTotal, setTimeTotal] = useState(null)

  const fetchWorkLogData = async (date, id) => {
    const { data } = await searchWorkLog({
      variables: {
        workLogsDate: date,
        lecturesId: id,
      },
    })
    return data?.searchWorkLogs?.data[0] || []
  }

  const fetchWorkLog = async (date, id) => {
    try {
      const data = await fetchWorkLogData(date, id)
      setWorkLogData(data)
    } catch (error) {
      console.error('작업 로그 데이터를 가져오는 중 오류 발생:', error)
    }
  }

  const fetchAttendanceForDate = async (date, id) => {
    const { data } = await seeAttendance({
      variables: {
        attendanceDate: date,
        lecturesId: id,
      },
    })
    return data?.seeAttendance || []
  }

  const fetchAttendance = async (date, id) => {
    try {
      const data = await fetchAttendanceForDate(date, id)
      setAttendanceData(data)
    } catch (error) {
      console.error('작업 로그 데이터를 가져오는 중 오류 발생:', error)
    }
  }

  const fetchTimeTotalForDate = async (date, id) => {
    const { data } = await searchTimeTotal({
      variables: {
        workLogsDate: date,
        lecturesId: id,
      },
    })
    return data?.searchWorkLogs?.data[0] || []
  }

  const fetchTimeTotal = async (date, id) => {
    try {
      if (date === 'N') {
        setTimeTotal([])
      } else {
        const data = await fetchTimeTotalForDate(date, id)
        if (data.length === 0) {
          setTimeTotal([])
        } else {
          setTimeTotal(data.trainingTimeTotal)
        }
      }
    } catch (error) {
      console.error('작업 로그 데이터를 가져오는 중 오류 발생:', error)
    }
  }

  const getPreviousDate = (dates, selectedDate) => {
    const index = dates.indexOf(selectedDate)
    if (index > 0) {
      return dates[index - 1]
    } else {
      return 'N'
    }
  }

  useEffect(() => {
    if (isOpen && lectureId && workLogeDate) {
      fetchWorkLog(workLogeDate, lectureId)
      fetchTimeTotal(getPreviousDate(dates, workLogeDate), lectureId)
      fetchAttendance(workLogeDate, lectureId)
    }
  }, [workLogeDate, lectureId, isOpen])

  return (
    isOpen && (
      <>
        <WorksLogs
          isOpen={isOpen}
          onClose={onClose}
          lectureId={lectureId}
          workLogeDate={workLogeDate}
          workLogData={workLogData}
          attendanceData={attendanceData}
          timeTotal={timeTotal}
          setWorkLogData={setWorkLogData}
          setTimeTotal={setTimeTotal}
          setAttendanceData={setAttendanceData}
        />
      </>
    )
  )
}
