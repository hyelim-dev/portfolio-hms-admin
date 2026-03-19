import styled from 'styled-components'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Textarea,
} from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getYear } from 'date-fns'
import { useState } from 'react'
import DatePickerHeader from '@/components/common/DatePickerHeader'
registerLocale('ko', ko)
const _ = require('lodash')

const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`
const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: red;
  }
`
const DatePickerBox = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    display: inline;
    width: 100%;
  }
  .react-datepicker__input-container {
    display: inline;
  }
  .react-datepicker__close-icon {
    height: 2.5rem;
    top: auto;
    bottom: 0;
  }
  .react-datepicker__triangle {
    left: 1.5rem !important;
    transform: translate(0, 0) !important;
  }
`

export default function DropOutInput({
  isOpen,
  onClose,
  clickCompletion,
  dropOutType,
}) {
  const [dropOutDate, setDropOutDate] = useState(null)
  const years = _.range(1950, getYear(new Date()) + 1, 1)
  const {
    control,
    register,
    handleSubmit,
    formState,
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm()
  const { errors } = formState

  const onSubmit = data => {
    clickCompletion(
      dropOutType,
      true,
      data.dateOfDroppingOut,
      data.reasonFordroppingOut,
    )
    closePopup()
  }

  const closePopup = () => {
    reset()
    setDropOutDate(null)
    onClose()
  }

  return (
    <>
      <Modal
        size={'md'}
        isOpen={isOpen}
        onClose={closePopup}
        placement={'center'}
        classNames={{ base: 'overflow-visible' }}
      >
        <ModalContent>
          {closePopup => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  {dropOutType} 처리
                </ModalHeader>
                <ModalBody>
                  <ScrollShadow className="scrollbar min-h-[10rem] max-h-[25rem]">
                    <DetailDiv>
                      <FlexBox>
                        <AreaBox>
                          <DatePickerBox>
                            <Controller
                              control={control}
                              name="dateOfDroppingOut"
                              rules={{
                                required: {
                                  value: true,
                                  message: '날짜를 선택해주세요.',
                                },
                              }}
                              render={({ field }) => (
                                <DatePicker
                                  renderCustomHeader={({
                                    date,
                                    changeYear,
                                    changeMonth,
                                    decreaseMonth,
                                    increaseMonth,
                                  }) => (
                                    <DatePickerHeader
                                      rangeYears={years}
                                      clickDate={date}
                                      changeYear={changeYear}
                                      changeMonth={changeMonth}
                                      decreaseMonth={decreaseMonth}
                                      increaseMonth={increaseMonth}
                                    />
                                  )}
                                  locale="ko"
                                  showYearDropdown
                                  selected={
                                    dropOutDate === null
                                      ? null
                                      : new Date(dropOutDate)
                                  }
                                  placeholderText="날짜를 선택해주세요."
                                  isClearable
                                  onChange={date => {
                                    field.onChange(date)
                                    setDropOutDate(date)
                                  }}
                                  dateFormat="yyyy/MM/dd"
                                  onChangeRaw={e => e.preventDefault()}
                                  onFocus={e => e.target.blur()}
                                  customInput={
                                    <Input
                                      ref={field.ref}
                                      label={
                                        <FilterLabel>
                                          {dropOutType} 일자<span>*</span>
                                        </FilterLabel>
                                      }
                                      labelPlacement="outside"
                                      type="text"
                                      variant="bordered"
                                      id="date"
                                      classNames={{
                                        input: 'caret-transparent',
                                      }}
                                      isReadOnly={true}
                                      startContent={
                                        <i className="xi-calendar" />
                                      }
                                    />
                                  }
                                />
                              )}
                            />
                          </DatePickerBox>
                          {errors.dateOfDroppingOut && (
                            <p className="px-2 pt-2 text-xs text-red">
                              {String(errors.dateOfDroppingOut.message)}
                            </p>
                          )}
                        </AreaBox>
                        <AreaBox>
                          <Textarea
                            placeholder="사유를 작성해주세요."
                            label={
                              <FilterLabel>
                                {dropOutType} 사유<span>*</span>
                              </FilterLabel>
                            }
                            labelPlacement="outside"
                            className="max-w-full"
                            variant="bordered"
                            maxRows={5}
                            onChange={e => {
                              register('reasonFordroppingOut').onChange(e)
                            }}
                            {...register('reasonFordroppingOut', {
                              required: {
                                value: true,
                                message: '사유를 작성해주세요.',
                              },
                            })}
                          />
                        </AreaBox>
                      </FlexBox>
                    </DetailDiv>
                  </ScrollShadow>
                </ModalBody>
                <ModalFooter>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="text-accent border-accent"
                    onPress={closePopup}
                  >
                    Close
                  </Button>
                  <Button size="sm" color="primary" type="submit">
                    저장하기
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
