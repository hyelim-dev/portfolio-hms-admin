import { styled } from 'styled-components'
import { Radio, RadioGroup } from '@nextui-org/react'

const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaSmallBox = styled.div`
  @media (max-width: 768px) {
    width: 100% !important;
  }
`
const RadioBox = styled.div`
  display: flex;
  width: 100%;
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  span {
    color: red;
  }
`
const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

export default function StudentInfo({ studentData, detailAll, record }) {
  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  return (
    <>
      {detailAll ? (
        <>
          <FlexBox>
            <AreaBox>
              <div>
                <FilterLabel>
                  이름<span>*</span>
                </FilterLabel>
                <LineBox>{studentData?.name}</LineBox>
              </div>
            </AreaBox>
            <AreaBox>
              <div>
                <FilterLabel>
                  연락처<span>*</span>
                </FilterLabel>
                <LineBox>{studentData?.phoneNum1}</LineBox>
              </div>
            </AreaBox>
            <AreaSmallBox>
              <RadioBox>
                <RadioGroup
                  label={
                    <FilterLabel>
                      SNS 수신 여부<span>*</span>
                    </FilterLabel>
                  }
                  isReadOnly
                  defaultValue={studentData?.smsAgreement}
                  orientation="horizontal"
                  className="gap-[0.65rem]"
                  classNames={{ wrapper: 'z-0' }}
                >
                  <Radio key={'동의'} value={'동의'}>
                    동의
                  </Radio>
                  <Radio key={'비동의'} value={'비동의'}>
                    비동의
                  </Radio>
                </RadioGroup>
              </RadioBox>
            </AreaSmallBox>
          </FlexBox>
          <FlexBox>
            <AreaBox>
              <div>
                <FilterLabel>
                  생년월일<span>*</span>
                </FilterLabel>
                <LineBox>{formatDate(studentData?.birthday, false)}</LineBox>
              </div>
            </AreaBox>
            <AreaBox>
              <div>
                <FilterLabel>기타 연락처</FilterLabel>
                <LineBox>{studentData?.phoneNum2}</LineBox>
              </div>
            </AreaBox>
          </FlexBox>
        </>
      ) : (
        <FlexBox>
          <AreaBox>
            <div>
              <FilterLabel>
                이름<span>*</span>
              </FilterLabel>
              <LineBox>{studentData?.name}</LineBox>
            </div>
          </AreaBox>
          <AreaBox>
            <div>
              <FilterLabel>
                생년월일<span>*</span>
              </FilterLabel>
              <LineBox>{formatDate(studentData?.birthday, false)}</LineBox>
            </div>
          </AreaBox>
          <AreaBox>
            <div>
              <FilterLabel>
                연락처<span>*</span>
              </FilterLabel>
              <LineBox>{studentData?.phoneNum1}</LineBox>
            </div>
          </AreaBox>
        </FlexBox>
      )}

      {!record && (
        <FlexBox>
          <AreaBox>
            <div>
              <FilterLabel>담당자</FilterLabel>
              <LineBox>{studentData?.writer}</LineBox>
            </div>
          </AreaBox>
          <AreaBox>
            <div>
              <FilterLabel>등록일시</FilterLabel>
              <LineBox>{formatDate(studentData?.createdAt, false)}</LineBox>
            </div>
          </AreaBox>
        </FlexBox>
      )}
    </>
  )
}
