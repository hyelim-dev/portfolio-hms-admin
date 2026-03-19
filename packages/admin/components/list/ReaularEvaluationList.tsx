import { styled } from 'styled-components'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { SEE_REGULAREVALUATION_SET_QUERY } from '@/graphql/queries'
import { ResultSeeRegularEvaluationSet } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import ReaularEvaluationEditForm from '@/components/form/ReaularEvaluationEditForm'

const MoreBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

type seeRegularEvaluationSetQuery = {
  seeRegularEvaluationSet: ResultSeeRegularEvaluationSet
}

export default function ReaularEvaluationList({
  isCreate,
  setIsCreate,
  lectureId,
  subjectId,
  mId,
}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [searchData, setSearchData] = useState([])
  const { error, data, fetchMore, refetch } =
    useSuspenseQuery<seeRegularEvaluationSetQuery>(
      SEE_REGULAREVALUATION_SET_QUERY,
      {
        variables: {
          lectureId: lectureId,
          subjectId: subjectId,
          limit: limit,
          page: 1,
        },
      },
    )

  const fetchMoreData = async nextPage => {
    await fetchMore({
      variables: { page: nextPage },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult
        const newData = [
          ...prevResult.seeRegularEvaluationSet.data,
          ...fetchMoreResult.seeRegularEvaluationSet.data,
        ]
        setSearchData(newData)

        return {
          ...prevResult,
          searchSM: {
            ...prevResult.seeRegularEvaluationSet,
            data: newData,
            totalCount: fetchMoreResult.seeRegularEvaluationSet.totalCount,
          },
        }
      },
    })
    setPage(nextPage)
  }

  useEffect(() => {
    if (isFetching) {
      const nextPage = page + 1
      fetchMoreData(nextPage).finally(() => {
        setIsFetching(false)
      })
    }
  }, [isFetching])

  const loadMore = () => {
    if (page < Math.ceil(data?.seeRegularEvaluationSet.totalCount / limit)) {
      setIsFetching(true)
    }
  }

  useEffect(() => {
    if (data && data?.seeRegularEvaluationSet) {
      setSearchData(data?.seeRegularEvaluationSet.data)
    }
  }, [data])

  useEffect(() => {
    if (isCreate) {
      setPage(1)
      setIsCreate(false)
    }
  }, [isCreate])

  if (error) {
    console.log(error)
  }

  return (
    <>
      {data?.seeRegularEvaluationSet.totalCount > 0 ? (
        <>
          {searchData &&
            searchData.map((item, index) => (
              <ReaularEvaluationEditForm
                key={index}
                item={item}
                refetch={refetch}
                setPage={setPage}
                mId={mId}
              />
            ))}
          {page <
            Math.ceil(data?.seeRegularEvaluationSet.totalCount / limit) && (
            <MoreBtn>
              <Button
                size="md"
                onClick={loadMore}
                className="w-full bg-white border-secondary text-secondary"
              >
                더보기{' '}
                <span className="text-secondary text-[1rem]">
                  <i className="xi-plus-circle" />
                </span>
              </Button>
            </MoreBtn>
          )}
        </>
      ) : (
        <>
          <Nolist>등록된 정기평가 설정내용이 없습니다.</Nolist>
        </>
      )}
    </>
  )
}
