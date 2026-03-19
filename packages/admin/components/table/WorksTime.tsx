import { Input, ScrollShadow } from '@nextui-org/react'
import { styled } from 'styled-components'

const TableArea = styled.div`
  margin-top: 0.5rem;
`
const TableWrap = styled.div`
  width: 100%;
  display: table;
  min-width: 38rem;
`
const Theader = styled.div`
  width: 100%;
  min-width: fit-content;
  display: table;
  flex-wrap: nowrap;
  row-gap: 1rem;
  color: #111;
  font-size: 0.875rem;
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  text-align: center;
`

const TheaderBox = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`

const ClickBox = styled.div`
  display: flex;
  width: 100%;
`

const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 16.6666%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
`

const TableItem = styled.div`
  position: relative;
  width: 100%;
  min-width: fit-content;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border-radius: 0.5rem;
  background: #fff;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);
  }
  &:nth-child(odd) {
    background: ${({ theme }) => theme.colors.lightPrimary};
  }
`

const TableRow = styled.div`
  position: relative;
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
  z-index: 1;
  /* display: grid;
  width: 100%;
  grid-template-columns: 0.5rem 2% auto; */
`

export default function WorksTime({
  setValue,
  timeTotal,
  trainingTimes,
  setTrainingTimes,
  trainingTimesTotal,
  setTrainingTimesTotal,
}) {
  const handleInput = (e, index) => {
    const value =
      e.target.value !== '' && !isNaN(e.target.value)
        ? parseInt(e.target.value)
        : ''

    setTrainingTimes(prevState => {
      const newTrainingTimes = Array.isArray(prevState) ? [...prevState] : []

      if (value !== '') {
        newTrainingTimes[index] = value
      } else {
        newTrainingTimes[index] = 0
      }

      newTrainingTimes[4] = newTrainingTimes
        .slice(0, 4)
        .reduce((sum, num) => sum + (num || 0), 0)

      setValue('trainingTimeOneday', newTrainingTimes, {
        shouldDirty: true,
      })

      return newTrainingTimes
    })

    setTrainingTimesTotal(trainingTimesTotal => {
      const newTotal = Array.isArray(trainingTimesTotal)
        ? [...trainingTimesTotal]
        : []

      if (value !== '') {
        newTotal[index] = (timeTotal[index] ? timeTotal[index] : 0) + value
      } else {
        newTotal[index] = (timeTotal[index] ? timeTotal[index] : 0) + 0
      }

      newTotal[4] = newTotal
        .slice(0, 4)
        .reduce((sum, num) => sum + (num || 0), 0)

      setValue('trainingTimeTotal', newTotal, {
        shouldDirty: true,
      })
      return newTotal
    })
  }

  return (
    <>
      <TableArea>
        <ScrollShadow orientation="horizontal" className="scrollbar">
          <TableWrap>
            <Theader>
              <TheaderBox>
                <ClickBox>
                  <Tnum>구분</Tnum>
                  <Tnum>교양</Tnum>
                  <Tnum>전공</Tnum>
                  <Tnum>실습</Tnum>
                  <Tnum>기타</Tnum>
                  <Tnum>계</Tnum>
                </ClickBox>
              </TheaderBox>
            </Theader>

            <TableItem>
              <TableRow>
                <ClickBox>
                  <Tnum>
                    <Input
                      isReadOnly={true}
                      labelPlacement="outside"
                      variant="flat"
                      radius="sm"
                      size="sm"
                      type="text"
                      value={'일계'}
                      className="w-full"
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      onChange={e => handleInput(e, 0)}
                      defaultValue={
                        trainingTimes[0] === '' ? 0 : trainingTimes[0]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-default-300',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      onChange={e => handleInput(e, 1)}
                      defaultValue={
                        trainingTimes[1] === '' ? 0 : trainingTimes[1]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-default-300',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      onChange={e => handleInput(e, 2)}
                      defaultValue={
                        trainingTimes[2] === '' ? 0 : trainingTimes[2]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-default-300',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      onChange={e => handleInput(e, 3)}
                      defaultValue={
                        trainingTimes[3] === '' ? 0 : trainingTimes[3]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-default-300',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      isReadOnly={true}
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      // defaultValue={trainingTimes[4]}
                      value={trainingTimes[4] === '' ? 0 : trainingTimes[4]}
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-default-300',
                      }}
                    />
                  </Tnum>
                </ClickBox>
              </TableRow>
            </TableItem>

            <TableItem>
              <TableRow>
                <ClickBox>
                  <Tnum>
                    <Input
                      isReadOnly={true}
                      labelPlacement="outside"
                      variant="flat"
                      radius="sm"
                      size="sm"
                      type="text"
                      value={'누계'}
                      className="w-full"
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      readOnly={true}
                      // defaultValue={trainingTimesTotal[0]}
                      value={
                        trainingTimesTotal[0] === '' ? 0 : trainingTimesTotal[0]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-white',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      readOnly={true}
                      // defaultValue={trainingTimesTotal[1]}
                      value={
                        trainingTimesTotal[1] === '' ? 0 : trainingTimesTotal[1]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-white',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      readOnly={true}
                      // defaultValue={trainingTimesTotal[2]}
                      value={
                        trainingTimesTotal[2] === '' ? 0 : trainingTimesTotal[2]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-white',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      readOnly={true}
                      // defaultValue={trainingTimesTotal[3]}
                      value={
                        trainingTimesTotal[3] === '' ? 0 : trainingTimesTotal[3]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-white',
                      }}
                    />
                  </Tnum>
                  <Tnum>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      readOnly={true}
                      // defaultValue={trainingTimesTotal[4]}
                      value={
                        trainingTimesTotal[4] === '' ? 0 : trainingTimesTotal[4]
                      }
                      className="w-full"
                      classNames={{
                        inputWrapper: 'border-white',
                      }}
                    />
                  </Tnum>
                </ClickBox>
              </TableRow>
            </TableItem>
          </TableWrap>
        </ScrollShadow>
      </TableArea>
    </>
  )
}
