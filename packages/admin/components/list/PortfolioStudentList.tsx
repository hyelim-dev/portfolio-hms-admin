import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { completionStatus } from '@/lib/recoilAtoms'
import { useSuspenseQuery } from '@apollo/client'
import { SEARCH_PORTFLIO_STUDDENTS_QUERY } from '@/graphql/queries'
import { Chip } from '@nextui-org/react'
import { ResultSearchSm } from '@/src/generated/graphql'
import { useEffect, useState } from 'react'
import TabFormTopInfo from '@/components/common/TabFormTopInfo'

const FlexChipBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

type searchSMQuery = {
  searchSM: ResultSearchSm
}

export default function PortfolioStudentList({
  lectureId,
  sortStudents,
  setPaymentId,
  setStudentName,
  setIsCreateOpen,
}) {
  const completion = useRecoilValue(completionStatus)
  const [portfolioStudentId, setPortfolioStudentId] = useState([])
  const {
    error,
    data: portfolioData,
    refetch,
  } = useSuspenseQuery<searchSMQuery>(SEARCH_PORTFLIO_STUDDENTS_QUERY, {
    variables: {
      modelType: 'StudentPortfolio',
      lectureId: lectureId,
    },
  })

  useEffect(() => {
    if (portfolioData) {
      const sort = portfolioData.searchSM.data.map(student => student.studentId)
      setPortfolioStudentId(sort)
    }
  }, [portfolioData])

  if (error) {
    console.log(error)
  }

  const clickPortFolio = (id, name) => {
    setPaymentId(id)
    setStudentName(name)
    setIsCreateOpen(true)
  }

  return (
    <>
      <TabFormTopInfo title={'포트폴리오'} noti={false} />
      <p style={{ fontSize: '0.8rem', color: '#11181C' }}>
        ❗학생을 선택하면 포트폴리오를 확인할 수 있습니다. 데모 환경에서는
        포트폴리오 저장이 제한됩니다.
      </p>
      <FlexChipBox>
        {sortStudents &&
          sortStudents
            .filter(student => student.courseComplete !== completion.dropout)
            .map((item, index) => (
              <button
                key={index}
                onClick={() => clickPortFolio(item.id, item.student.name)}
              >
                <Chip
                  endContent={
                    <>
                      {portfolioStudentId.includes(item.student.id) ? (
                        <p className="text-[1rem] text-primary">
                          <i className="xi-check-circle" />
                        </p>
                      ) : (
                        <p className="text-[1rem] text-gray">
                          <i className="xi-close-circle" />
                        </p>
                      )}
                    </>
                  }
                  variant="bordered"
                  className={'hover:border-primary leading-none'}
                >
                  {item.student.name}
                </Chip>
              </button>
            ))}
      </FlexChipBox>
    </>
  )
}
