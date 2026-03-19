import { Input, Radio, RadioGroup, Textarea } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import ListInfo from '@/components/common/ListInfo'
import { useRecoilValue } from 'recoil'
import { assignmentState, completionStatus } from '@/lib/recoilAtoms'

const DetailDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  border: 2px solid hsl(240 6% 90%);
  padding: 1rem;
  border-radius: 0.5rem;
`

const FlexBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1 3;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  &.textBox {
    align-items: center;
  }
`

const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;
`

export default function DropOutNameItem({ item }) {
  const completion = useRecoilValue(completionStatus)
  const [dropOutType, setDropOutType] = useState('중도포기')
  const [studentName, setStudentName] = useState('')
  const [dropOutDate, setDropOutDate] = useState('-')
  const [dropOutReason, setDropOutReason] = useState('')

  useEffect(() => {
    if (
      item.courseComplete === completion.dropout ||
      item.courseComplete === completion.notCompleted
    ) {
      setDropOutType(item.courseComplete)
    }
    if (item.student.name) {
      setStudentName(item.student.name)
    }
    if (item.reasonFordroppingOut) {
      setDropOutReason(item.reasonFordroppingOut)
    }

    if (item.dateOfDroppingOut) {
      const timestamp = parseInt(item.dateOfDroppingOut)
      setDropOutDate(formatDate(timestamp))
    }
  }, [item])

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  return (
    <DetailDiv>
      <FlexBox>
        <AreaBox>
          <Input
            isReadOnly={true}
            labelPlacement="outside"
            variant="flat"
            value={studentName}
            label={<FilterLabel>수강생명</FilterLabel>}
            type="text"
            placeholder=" "
            className="w-full"
          />
        </AreaBox>
        <AreaBox>
          <RadioGroup
            label={<FilterLabel>중도탈락 구분</FilterLabel>}
            orientation="horizontal"
            className="gap-[0.65rem]"
            classNames={{ wrapper: 'z-0' }}
            value={dropOutType}
            isReadOnly={true}
          >
            <Radio key={'중도포기'} value={'중도포기'}>
              중도포기
            </Radio>
            <Radio key={'미수료'} value={'미수료'}>
              미수료
            </Radio>
          </RadioGroup>
        </AreaBox>
        <AreaBox>
          <Input
            isReadOnly={true}
            labelPlacement="outside"
            variant="flat"
            value={dropOutDate}
            label={<FilterLabel>중도탈락일자</FilterLabel>}
            type="text"
            placeholder=" "
            className="w-full"
          />
        </AreaBox>
      </FlexBox>
      <FlexBox className="textBox">
        <AreaBox>
          <Textarea
            isReadOnly={true}
            label={<FilterLabel>중도탈락 사유</FilterLabel>}
            labelPlacement="outside"
            className="max-w-full"
            variant="flat"
            value={dropOutReason}
            minRows={3}
          />
        </AreaBox>
      </FlexBox>
      <ListInfo item={item} />
    </DetailDiv>
  )
}
