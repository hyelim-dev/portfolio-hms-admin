import { Input, ScrollShadow } from '@nextui-org/react'
import { useEffect, useState } from 'react'
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
  align-items: center;
`
const Ttext = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 33%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
`

const Ttitle = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 26%;
  padding: 0.5rem;
  font-size: inherit;
`

const Tname = styled.div`
  position: relative;
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 14%;
  padding: 0.5rem;
  font-size: inherit;
`

const Tnum = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 6%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
  min-width: ${1200 * 0.06}px;
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

export default function AbsentList({
  setValue,
  trainingData,
  setTrainingData,
}) {
  const keys = [
    'trainingInfoOne',
    'trainingInfoTwo',
    'trainingInfoThree',
    'trainingInfoFour',
    'trainingInfoFive',
    'trainingInfoSix',
    'trainingInfoSeven',
    'trainingInfoEight',
  ]

  const handleInput = (e, key, index) => {
    setTrainingData(prevState => {
      const newTrainingData = {
        ...prevState,
        [key]: [...prevState[key]],
      }
      newTrainingData[key][index] = e.target.value
      setValue(key, newTrainingData[key], { shouldDirty: true })
      return newTrainingData
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
                  <Tnum>교시</Tnum>
                  <Tname>담당교사</Tname>
                  <Ttitle>교과목명</Ttitle>
                  <Ttitle>능력단위명</Ttitle>
                  <Ttext>훈련내용(능력단위요소명)</Ttext>
                </ClickBox>
              </TheaderBox>
            </Theader>
            {keys.map((item, index) => (
              <TableItem key={index}>
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
                        defaultValue={trainingData[item][0]}
                        className="w-full"
                      />
                    </Tnum>
                    <Tname>
                      <Input
                        // name={`${trainingInfos[index]}.teacher`}
                        labelPlacement="outside"
                        variant="bordered"
                        radius="sm"
                        size="sm"
                        type="text"
                        placeholder=" "
                        onChange={e => handleInput(e, item, 1)}
                        defaultValue={trainingData[item][1]}
                        className="w-full"
                        classNames={{
                          inputWrapper: `${
                            index % 2 === 0 ? '' : 'border-white'
                          }  `,
                        }}
                      />
                    </Tname>
                    <Ttitle>
                      <Input
                        // name={`${trainingInfos[index]}.courseName`}
                        labelPlacement="outside"
                        variant="bordered"
                        radius="sm"
                        size="sm"
                        type="text"
                        placeholder=" "
                        onChange={e => handleInput(e, item, 2)}
                        defaultValue={trainingData[item][2]}
                        className="w-full"
                        classNames={{
                          inputWrapper: `${
                            index % 2 === 0 ? '' : 'border-white'
                          }  `,
                        }}
                      />
                    </Ttitle>
                    <Ttitle>
                      <Input
                        // name={`${trainingInfos[index]}.unitName`}
                        labelPlacement="outside"
                        variant="bordered"
                        radius="sm"
                        size="sm"
                        type="text"
                        placeholder=" "
                        onChange={e => handleInput(e, item, 3)}
                        defaultValue={trainingData[item][3]}
                        className="w-full"
                        classNames={{
                          inputWrapper: `${
                            index % 2 === 0 ? '' : 'border-white'
                          }  `,
                        }}
                      />
                    </Ttitle>
                    <Ttext>
                      <Input
                        // name={`${trainingInfos[index]}.content`}
                        // defaultValue={
                        //   // trainingData[trainingInfos[index]][fieldIndex]
                        // }
                        labelPlacement="outside"
                        variant="bordered"
                        radius="sm"
                        size="sm"
                        type="text"
                        placeholder=" "
                        onChange={e => handleInput(e, item, 4)}
                        defaultValue={trainingData[item][4]}
                        className="w-full"
                        classNames={{
                          inputWrapper: `${
                            index % 2 === 0 ? '' : 'border-white'
                          }  `,
                        }}
                      />
                    </Ttext>
                  </ClickBox>
                </TableRow>
              </TableItem>
            ))}
          </TableWrap>
        </ScrollShadow>
      </TableArea>
    </>
  )
}
