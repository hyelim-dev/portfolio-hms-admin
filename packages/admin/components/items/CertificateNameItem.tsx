import { Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import ListInfo from '@/components/common/ListInfo'

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

  span {
    color: red;
  }
`

const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  button {
    width: 5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;

    button {
      width: 50%;
    }
  }
`

export default function CertificateNameItem({ item }) {
  const [studentName, setStudentName] = useState('')
  const [certificateDate, setCertificateDate] = useState('-')
  const [certificateName, setCertificateName] = useState('')
  const [certificateLevel, setCertificateLevel] = useState('-')
  const [certificateIssuer, setCertificateIssuer] = useState('')

  useEffect(() => {
    if (item.stName) {
      setStudentName(item.stName)
    }
    if (item.certificateName) {
      setCertificateName(item.certificateName)
    }
    if (item.certificateLevel) {
      setCertificateLevel(item.certificateLevel)
    }
    if (item.CertificateIssuer) {
      setCertificateIssuer(item.CertificateIssuer)
    }
    if (item.CAdate) {
      const timestamp = parseInt(item.CAdate)
      setCertificateDate(formatDate(timestamp))
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
    <>
      <DetailDiv>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>수강생명</FilterLabel>}
              type="text"
              placeholder=" "
              value={studentName}
              className="w-full"
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>취득일시</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={certificateDate}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>자격증명</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={certificateName}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>급수</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={certificateLevel}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>발행처</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={certificateIssuer}
            />
          </AreaBox>
        </FlexBox>
        <ListInfo item={item} />
      </DetailDiv>
    </>
  )
}
