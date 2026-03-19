import { Link } from '@nextui-org/react'
import { styled } from 'styled-components'

const FlexCardBox = styled.div`
  display: flex;
  gap: 1rem;
  border: 2px solid hsl(240 6% 90%);
  border-radius: 0.5rem;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  text-align: center;

  &:hover {
    cursor: pointer;
    background: hsl(240 6% 97%);
  }
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 0;
  }
`
const AreaBox = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`
const FlexItem = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 1200px) {
    border-top: 2px solid ${({ theme }) => theme.colors.offWhite};
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`
const Tdetail = styled.div`
  width: 90%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  font-weight: 700;
  text-align: left;
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    width: 100%;
    text-align: left;
  }
`
const TExposure = styled.div`
  width: 10%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  min-width: 50px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const TreceiptDiv = styled.div`
  width: 100%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const TadviceType = styled.div`
  width: 100%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  /* min-width: 200px; */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  @media (max-width: 640px) {
    border-top: 2px solid ${({ theme }) => theme.colors.offWhite};
  }
`
const OnExposure = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`
const OffExposure = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  opacity: 0.5;
`

const EllipsisBox = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default function SubjectCodeDuplicate({ listData }) {
  const getDate = (DataDate: string): string => {
    const LocalDdate = new Date(parseInt(DataDate)).toLocaleDateString()
    return LocalDdate
  }

  return (
    <>
      <Link href={`/subjects/detail/${listData.id}`} style={{ width: '100%' }}>
        <FlexCardBox>
          <FlexBox>
            <AreaBox>
              <Tdetail>
                <EllipsisBox>{`[${listData.round}회차] ${listData.subjectName}`}</EllipsisBox>
              </Tdetail>
              <TExposure>
                {listData.exposure ? (
                  <OnExposure>
                    <i className="xi-check-circle" />
                  </OnExposure>
                ) : (
                  <OffExposure>
                    <i className="xi-check-circle " />
                  </OffExposure>
                )}
              </TExposure>
            </AreaBox>
            <AreaBox>
              <FlexItem>
                <TreceiptDiv>
                  {`${
                    listData.startDate === null
                      ? '개강일'
                      : getDate(listData.startDate)
                  } - ${
                    listData.endDate === null
                      ? '종강일'
                      : getDate(listData.endDate)
                  }`}
                </TreceiptDiv>
                <TadviceType>
                  <EllipsisBox>
                    {listData.roomNum === null ? '강의실' : listData.roomNum}
                    &nbsp;/&nbsp;
                    {listData.teacherName}
                  </EllipsisBox>
                </TadviceType>
              </FlexItem>
            </AreaBox>
          </FlexBox>
        </FlexCardBox>
      </Link>
    </>
  )
}
