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
  width: 20%;
  padding: 0.5rem;
  font-size: inherit;
  color: inherit;
`
const Ttext = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 80%;
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
  attendanceState,
  setAttendanceState,
}) {
  const periods = ['결석', '지각', '조퇴', '외출', '기타사항']
  const keys = ['absentSt', 'tardySt', 'leaveEarlySt', 'outingSt', 'etc']
  const handleInput = (e, key) => {
    setAttendanceState(prevState => {
      const newAttendanceState = {
        ...prevState,
        [key]: [...prevState[key]],
      }
      newAttendanceState[key] = e.target.value
      setValue(key, newAttendanceState[key], { shouldDirty: true })
      return newAttendanceState
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
                  <Ttext>학생명</Ttext>
                </ClickBox>
              </TheaderBox>
            </Theader>
            {keys.map((item, index) => (
              <TableItem key={index}>
                <ClickBox>
                  <Tnum>
                    <Input
                      isReadOnly={true}
                      labelPlacement="outside"
                      variant="flat"
                      radius="sm"
                      size="sm"
                      type="text"
                      value={periods[index]}
                      className="w-full"
                    />
                  </Tnum>
                  <Ttext>
                    <Input
                      labelPlacement="outside"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      type="text"
                      placeholder=" "
                      onChange={e => handleInput(e, item)}
                      defaultValue={attendanceState[item]}
                      className="w-full"
                      classNames={{
                        inputWrapper: `${
                          index % 2 === 0 ? '' : 'border-white'
                        }  `,
                      }}
                    />
                  </Ttext>
                </ClickBox>
              </TableItem>
            ))}
          </TableWrap>
        </ScrollShadow>
      </TableArea>
    </>
  )
}
