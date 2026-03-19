import { Input, Radio, RadioGroup } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import ListInfo from '@/components/common/ListInfo'

const DetailDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 2px solid hsl(240 6% 90%);
  padding: 1rem;
  border-radius: 0.5rem;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
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

export default function EmploymentNameItem({ item }) {
  const [studentName, setStudentName] = useState('')
  const [companyName, setCompanyName] = useState('-')
  const [businessNum, setBusinessNum] = useState('')
  const [responsibilities, setResponsibilities] = useState('-')
  const [phoneNum, setPhoneNum] = useState('')
  const [location, setLocation] = useState('')
  const [businessSize, setBusinessSize] = useState('')
  const [employmentDate, setEmploymentDate] = useState('-')
  const [employmentType, setEmploymentType] = useState('취업')
  const [imploymentInsurance, setImploymentInsurance] = useState('Y')
  const [proofOfImployment, setProofOfImployment] = useState('Y')
  const [relatedFields, setRelatedFields] = useState('동일')
  const [completionType, setCompletionType] = useState('수료취업')

  useEffect(() => {
    if (item.stName) {
      setStudentName(item.stName)
    }
    if (item.companyName) {
      setCompanyName(item.companyName)
    }
    if (item.businessNum) {
      setBusinessNum(item.businessNum)
    }
    if (item.responsibilities) {
      setResponsibilities(item.responsibilities)
    }
    if (item.phoneNum) {
      setPhoneNum(item.phoneNum)
    }
    if (item.location) {
      setLocation(item.location)
    }
    if (item.businessSize) {
      setBusinessSize(item.businessSize)
    }
    if (item.employmentType) {
      setEmploymentType(item.employmentType)
    }
    if (item.imploymentInsurance) {
      setImploymentInsurance(item.imploymentInsurance)
    }
    if (item.proofOfImployment) {
      setProofOfImployment(item.proofOfImployment)
    }
    if (item.relatedFields) {
      setRelatedFields(item.relatedFields)
    }
    if (item.completionType) {
      setCompletionType(item.completionType)
    }
    if (item.dateOfEmployment) {
      const timestamp = parseInt(item.dateOfEmployment)
      setEmploymentDate(formatDate(timestamp))
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
            <RadioGroup
              label={<FilterLabel>구분</FilterLabel>}
              orientation="horizontal"
              className="gap-[0.65rem]"
              classNames={{ wrapper: 'z-0' }}
              value={employmentType}
              isReadOnly={true}
            >
              <Radio key={'취업'} value={'취업'}>
                취업
              </Radio>
              <Radio key={'창업'} value={'창업'}>
                창업
              </Radio>
            </RadioGroup>
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>취업일자</FilterLabel>}
              type="text"
              placeholder=" "
              value={employmentDate}
              className="w-full"
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>회사명</FilterLabel>}
              type="text"
              placeholder=" "
              value={companyName}
              className="w-full"
            />
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>사업자번호</FilterLabel>}
              type="text"
              placeholder=" "
              value={businessNum}
              className="w-full"
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>담당업무</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={responsibilities}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>전화번호</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={phoneNum}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>소재지</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={location}
            />
          </AreaBox>
          <AreaBox>
            <Input
              labelPlacement="outside"
              readOnly={true}
              variant="flat"
              label={<FilterLabel>사업장규모</FilterLabel>}
              type="text"
              placeholder=" "
              className="w-full"
              value={businessSize}
            />
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <RadioGroup
              label={<FilterLabel>고용보험</FilterLabel>}
              orientation="horizontal"
              className="gap-[0.65rem]"
              classNames={{ wrapper: 'z-0' }}
              value={imploymentInsurance}
              isReadOnly={true}
            >
              <Radio key={'Y'} value={'Y'}>
                Y
              </Radio>
              <Radio key={'N'} value={'N'}>
                N
              </Radio>
            </RadioGroup>
          </AreaBox>
          <AreaBox>
            <RadioGroup
              label={<FilterLabel>재직증명</FilterLabel>}
              orientation="horizontal"
              className="gap-[0.65rem]"
              classNames={{ wrapper: 'z-0' }}
              value={proofOfImployment}
              isReadOnly={true}
            >
              <Radio key={'Y'} value={'Y'}>
                Y
              </Radio>
              <Radio key={'N'} value={'N'}>
                N
              </Radio>
            </RadioGroup>
          </AreaBox>
          <AreaBox>
            <RadioGroup
              label={<FilterLabel>관련분야</FilterLabel>}
              orientation="horizontal"
              className="gap-[0.65rem]"
              classNames={{ wrapper: 'z-0' }}
              value={relatedFields}
              isReadOnly={true}
            >
              <Radio key={'동일'} value={'동일'}>
                동일
              </Radio>
              <Radio key={'관련'} value={'관련'}>
                관련
              </Radio>
              <Radio key={'다른'} value={'다른'}>
                다른
              </Radio>
            </RadioGroup>
          </AreaBox>
          <AreaBox>
            <RadioGroup
              label={<FilterLabel>취업형태</FilterLabel>}
              orientation="horizontal"
              className="gap-[0.65rem]"
              classNames={{ wrapper: 'z-0' }}
              value={completionType}
              isReadOnly={true}
            >
              <Radio key={'조기취업'} value={'조기취업'}>
                조기취업
              </Radio>
              <Radio key={'수료취업'} value={'수료취업'}>
                수료취업
              </Radio>
            </RadioGroup>
          </AreaBox>
        </FlexBox>
        <ListInfo item={item} />
      </DetailDiv>
    </>
  )
}
