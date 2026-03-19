import { Button, Chip } from '@nextui-org/react'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import {
  CHANGE_ORDER_AT_MUTATION,
  EDIT_ADVICE_TYPE_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import { styled } from 'styled-components'
import {
  SEE_ADVICE_TYPE_ORDER_QUERY,
  SEE_ADVICE_TYPE_QUERY,
} from '@/graphql/queries'
import { useEffect, useState } from 'react'
import { ResultAdviceType } from '@/src/generated/graphql'

const ChipBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`
const MoreBtn = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.offWhite};
  display: flex;
`

type seeAdviceTypeQuery = {
  seeAdviceType: ResultAdviceType
}

export default function AdviceTypeList({
  category,
  setTotalCount,
  typeIsOpne,
}) {
  // const { userLogs } = useUserLogsMutation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [editAdvice] = useMutation(EDIT_ADVICE_TYPE_MUTATION)
  const [changeOrderAt] = useMutation(CHANGE_ORDER_AT_MUTATION)
  const createNumberArray = n => Array.from({ length: n }, (_, i) => i + 1)
  const [isFetching, setIsFetching] = useState(false)
  const [adviceList, setAdviceList] = useState([])
  const {
    error,
    data,
    fetchMore,
    refetch: seeRefetch,
  } = useSuspenseQuery<seeAdviceTypeQuery>(SEE_ADVICE_TYPE_QUERY, {
    variables: {
      page: 1,
      category: category,
      limit: limit,
    },
  })

  const fetchMoreData = async nextPage => {
    await fetchMore({
      variables: { page: nextPage },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult

        const newTypes = [
          ...prevResult.seeAdviceType.adviceType,
          ...fetchMoreResult.seeAdviceType.adviceType,
        ]

        setAdviceList(newTypes)

        return {
          ...prevResult,
          seeAdviceType: {
            ...prevResult.seeAdviceType,
            data: newTypes,
            totalCount: fetchMoreResult.seeAdviceType.totalCount,
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
    if (page < Math.ceil(data?.seeAdviceType.totalCount / limit)) {
      setIsFetching(true)
    }
  }

  useEffect(() => {
    if (data && data.seeAdviceType) {
      setAdviceList(data.seeAdviceType.adviceType)
      setTotalCount(data?.seeAdviceType.totalCount)
    }
  }, [data])

  useEffect(() => {
    if (typeIsOpne) {
      setPage(1)
      seeRefetch({
        page: 1,
        category: category,
        limit: limit,
      }).then(result => {
        setAdviceList(result.data.seeAdviceType.adviceType)
      })
    }
  }, [typeIsOpne])

  const deleteType = async item => {
    const isDelete = confirm(
      `해당 분야가 노출된 부분에서 전부 삭제 처리됩니다.\n[${item.type}]을 삭제하시겠습니까?`,
    )
    if (!isDelete) return

    try {
      const result = await editAdvice({
        variables: {
          editAdviceTypeId: item.id,
          onOff: 'N',
        },
        refetchQueries: [
          {
            query: SEE_ADVICE_TYPE_ORDER_QUERY,
            variables: {
              page: 1,
              limit: 30,
              category: category,
            },
          },
        ],
      })
      const typeID = adviceList
        .filter(type => type.id !== item.id)
        .map(advice => advice.id)
      const typeIndex = createNumberArray(typeID.length)
      const changeResult = await changeOrderAt({
        variables: {
          ids: typeID,
          indexNums: typeIndex,
        },
      })
      // userLogs(
      //   `${item.type} ${category} 삭제`,
      //   `ok: ${result.data.editAdviceType.ok}`,
      // )
      if (!result.data.editAdviceType.ok) {
        throw new Error(`${category} 삭제 실패`)
      }
      if (!changeResult.data.changeOrderAT.ok) {
        throw new Error(`${category} 삭제 후 순서 재설정 실패`)
      }
      setPage(1)
      seeRefetch()

      alert(`${category}가 삭제되었습니다.`)
    } catch (error) {
      console.error(`${category} 삭제 중 에러 발생:`, error)
    }
  }

  return (
    <>
      <ChipBox>
        {adviceList &&
          adviceList.map((item, index) => (
            <Chip
              key={index}
              variant="bordered"
              onClose={() => deleteType(item)}
              className={'hover:border-primary'}
            >
              {item.type}
            </Chip>
          ))}
      </ChipBox>

      {page < Math.ceil(data?.seeAdviceType.totalCount / limit) && (
        <MoreBtn>
          <Button
            color="primary"
            onClick={loadMore}
            className="bg-[transparent] w-[100%] text-black"
          >
            더보기{' '}
            <span className="text-primary text-[1rem]">
              <i className="xi-plus-circle" />
            </span>
          </Button>
        </MoreBtn>
      )}
    </>
  )
}
