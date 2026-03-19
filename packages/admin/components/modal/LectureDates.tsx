import styled from 'styled-components'
import {
  Button,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { useEffect, useState } from 'react'
import ChipCheckbox from '@/components/common/ChipCheckbox'
registerLocale('ko', ko)
const _ = require('lodash')

const DatePickerBox = styled.div`
  .react-datepicker {
    width: 100%;
  }
  .react-datepicker__month-container {
    width: 100%;
  }
  .react-datepicker__day--selected {
    background: none;
    color: ${({ theme }) => theme.colors.black};

    &.react-datepicker__day--disabled {
      color: ${({ theme }) => theme.colors.lightGray};
    }
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: 1rem;
  }
  .react-datepicker__navigation {
    display: none;
  }
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    width: 100%;
    max-width: 2.7rem;

    @media (max-width: 768px) {
      max-width: 2rem;
    }
  }
  .react-datepicker__day--keyboard-selected {
    background-color: transparent;
  }
  .react-datepicker__day--highlighted {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`

const DayCheck = styled.div`
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
`
export default function LectureDates({
  isOpen,
  onClose,
  setValue,
  datesSelected = null,
  startDate,
  endDate,
  isDate,
  changeDate,
  setChangeDate,
}) {
  const [disabledDays, setDisabledDays] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [groupSelected, setGroupSelected] = useState([])
  const selectDateAuto = (startDate, endDate) => {
    let currentDate =
      startDate instanceof Date ? new Date(startDate) : new Date(startDate)
    let validEndDate =
      endDate instanceof Date ? new Date(endDate) : new Date(endDate)
    let updatedSelectedDates = []
    while (currentDate <= validEndDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      updatedSelectedDates.push(dateString)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDates(updatedSelectedDates)
  }

  useEffect(() => {
    if (isDate) {
      if (changeDate) {
        setDisabledDays([])
        setGroupSelected([])
        setSelectedDates([])
        selectDateAuto(startDate, endDate)
      } else {
        setSelectedDates(datesSelected)
      }
    } else {
      setDisabledDays([])
      setGroupSelected([])
      setSelectedDates([])
      selectDateAuto(startDate, endDate)
    }
  }, [startDate, endDate, datesSelected, isDate])

  const calculateMonthsShown = (startDate, endDate) => {
    const validStartDate =
      startDate instanceof Date ? startDate : new Date(startDate)
    const validEndDate = endDate instanceof Date ? endDate : new Date(endDate)

    const startYear = validStartDate.getFullYear()
    const endYear = validEndDate.getFullYear()
    const startMonth = validStartDate.getMonth()
    const endMonth = validEndDate.getMonth()

    // 두 날짜 사이의 총 월 수 계산
    const months = (endYear - startYear) * 12 + endMonth - startMonth + 1
    return months
  }

  const monthsShown = calculateMonthsShown(startDate, endDate)

  const isDayDisabled = date => {
    const day = date.getDay()
    return disabledDays.includes(day)
  }

  const updateSelectedDates = (isDayDisabled, day) => {
    if (isDayDisabled) {
      let newDatesToAdd = []
      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        if (currentDate.getDay() === day) {
          const dateString = currentDate.toISOString().split('T')[0]
          if (!selectedDates.includes(dateString)) {
            newDatesToAdd.push(dateString)
          }
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setSelectedDates(prevSelectedDates => [
        ...prevSelectedDates,
        ...newDatesToAdd,
      ])
    } else {
      setSelectedDates(prevSelectedDates => {
        return prevSelectedDates.filter(dateString => {
          const date = new Date(dateString)
          return date.getDay() !== day
        })
      })
    }
  }

  // 요일 선택 핸들러
  const toggleDay = day => {
    setGroupSelected(prev => {
      if (prev.includes(day)) {
        // 배열에 해당 번호가 있으면 제거
        return prev.filter(n => n !== day)
      } else {
        // 배열에 없으면 추가
        return [...prev, day]
      }
    })
    setDisabledDays(prev => {
      const isDayDisabled = prev.includes(day)
      const newDisabledDays = isDayDisabled
        ? prev.filter(d => d !== day)
        : [...prev, day]

      updateSelectedDates(isDayDisabled, day)

      return newDisabledDays
    })
  }

  const formatDate = date => {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const handleDateSelect = date => {
    const dateString = formatDate(date)

    setSelectedDates(currentSelectedDates => {
      const isSelected = currentSelectedDates.some(
        selectedDate => selectedDate === dateString,
      )

      if (isSelected) {
        return currentSelectedDates.filter(
          selectedDate => selectedDate !== dateString,
        )
      } else {
        return [...currentSelectedDates, dateString]
      }
    })
  }

  const clickAdviceSubmit = () => {
    const sortedDates = selectedDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )
    setChangeDate(false)
    setValue('lectureDetails', sortedDates, { shouldDirty: true })
    onClose()
  }

  return (
    <>
      <Modal size={'md'} isOpen={isOpen} onClose={onClose} placement={'center'}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                기간선택
                <DayCheck>
                  {['일', '월', '화', '수', '목', '금', '토'].map(
                    (day, index) => (
                      <ChipCheckbox
                        key={index}
                        isSelected={groupSelected.includes(index)}
                        onChange={e => toggleDay(index)}
                      >
                        <p>{day}</p>
                      </ChipCheckbox>
                    ),
                  )}
                </DayCheck>
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="scrollbar min-h-[10rem] max-h-[25rem]">
                  <DatePickerBox>
                    <DatePicker
                      inline
                      locale="ko"
                      highlightDates={selectedDates.map(
                        dateString => new Date(dateString),
                      )}
                      onChange={handleDateSelect}
                      filterDate={date => !isDayDisabled(date)}
                      selected={startDate}
                      // minDate={startDate > today ? startDate : today}
                      minDate={startDate}
                      maxDate={endDate}
                      monthsShown={monthsShown}
                    />
                  </DatePickerBox>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  variant="bordered"
                  className="text-accent border-accent"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => {
                    clickAdviceSubmit()
                    // field.onChange(adviceTypeSelected)
                  }}
                >
                  선택
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
