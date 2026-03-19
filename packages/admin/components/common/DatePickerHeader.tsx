import { Select, SelectItem } from '@nextui-org/react'
import { getMonth, getYear } from 'date-fns'
import { useTheme } from 'styled-components'
const _ = require('lodash')

export default function DatePickerHeader({
  clickDate,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  rangeYears,
}) {
  const theme = useTheme()
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ]

  return (
    <div
      style={{
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
    >
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={getMonth(clickDate) === 0 ? true : false}
        style={{
          opacity: getMonth(clickDate) === 0 ? '0.2' : '1',
        }}
      >
        <i className="xi-angle-left" />
      </button>
      <Select
        label={
          <span
            style={{
              display: 'none',
            }}
          ></span>
        }
        labelPlacement="outside"
        selectedKeys={[String(getYear(clickDate))]}
        variant="underlined"
        onChange={({ target: { value } }) => {
          if (value !== '') {
            changeYear(Number(value))
          }
        }}
        style={{
          borderBottom: `1px solid ${theme.colors.gray}`,
        }}
      >
        {rangeYears?.map(option => (
          <SelectItem key={String(option)} value={String(option)}>
            {String(option)}
          </SelectItem>
        ))}
      </Select>

      <Select
        label={
          <span
            style={{
              display: 'none',
            }}
          ></span>
        }
        className="w-[95%]"
        labelPlacement="outside"
        selectedKeys={[months[getMonth(clickDate)]]}
        variant="underlined"
        onChange={({ target: { value } }) => {
          if (value !== '') {
            changeMonth(months.indexOf(value))
          }
        }}
        style={{
          borderBottom: `1px solid ${theme.colors.gray}`,
        }}
      >
        {months?.map(option => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={getMonth(clickDate) === 11 ? true : false}
        style={{
          opacity: getMonth(clickDate) === 11 ? '0.2' : '1',
        }}
      >
        <i className="xi-angle-right" />
      </button>
    </div>
  )
}
