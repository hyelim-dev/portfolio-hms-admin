import styled from 'styled-components'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { CHANGE_ORDER_AT_MUTATION } from '@/graphql/mutations'
import { useEffect, useState } from 'react'
import { ResultAdviceType } from '@/src/generated/graphql'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import {
  SEE_ADVICE_TYPE_ORDER_QUERY,
  SEE_ADVICE_TYPE_QUERY,
} from '@/graphql/queries'

const Container = styled.div`
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;
`

const Item = styled.div`
  padding: 0.5rem 1rem;
  background: #fff;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0.5rem;
  gap: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightPrimary};
  }
`

type seeAdviceTypeQuery = {
  seeAdviceType: ResultAdviceType
}

export default function TypeIndex({ isOpen, onClose, category }) {
  const [orderPage, setOrderPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(30)
  // const { userLogs } = useUserLogsMutation()
  const [changeOrderAt] = useMutation(CHANGE_ORDER_AT_MUTATION)
  const { handleSubmit, formState, setValue } = useForm()
  const { errors, isDirty } = formState
  const { error, data, fetchMore, refetch } =
    useSuspenseQuery<seeAdviceTypeQuery>(SEE_ADVICE_TYPE_ORDER_QUERY, {
      variables: {
        page: 1,
        limit: currentLimit,
        category: category,
      },
    })
  const [items, setItems] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const fetchMoreData = async nextPage => {
    await fetchMore({
      variables: { page: nextPage },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult

        const newTypes = [
          ...prevResult.seeAdviceType.adviceType,
          ...fetchMoreResult.seeAdviceType.adviceType,
        ]

        setItems(newTypes)

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
    setOrderPage(nextPage)
  }

  useEffect(() => {
    if (isFetching) {
      const nextPage = orderPage + 1
      fetchMoreData(nextPage).finally(() => {
        setIsFetching(false)
      })
    }
  }, [isFetching])

  const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetching) {
      if (orderPage < Math.ceil(data.seeAdviceType.totalCount / currentLimit)) {
        setIsFetching(true)
      }
    }
  }

  useEffect(() => {
    if (data && data.seeAdviceType) {
      setItems(data.seeAdviceType.adviceType)
    }
  }, [data])

  const handleOnDragEnd = result => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    setItems(newItems)
    setValue('adviceType', newItems, { shouldDirty: true })
  }

  const onSubmit = async data => {
    if (!isDirty) return alert('변경된 내용이업습니다.')

    try {
      const typeID = data.adviceType.map(advice => advice.id)
      const typeIndex = data.adviceType.map((_, index) => index + 1)
      const result = await changeOrderAt({
        variables: {
          ids: typeID,
          indexNums: typeIndex,
        },
        refetchQueries: [
          {
            query: SEE_ADVICE_TYPE_QUERY,
            variables: {
              page: 1,
              limit: 50,
              category: category,
            },
          },
        ],
      })

      // userLogs(`${category} 순서 변경`, `ok: ${result.data.changeOrderAT.ok}`)

      if (!result.data.changeOrderAT.ok) {
        throw new Error(`${category} 순서 변경 실패`)
      }
      refetch()

      alert(`${category} 순서가 변경되었습니다.`)

      closeBtn()
    } catch (error) {
      console.error(`${category} 순서 변경 중 에러 발생:`, error)
    }
  }

  const closeBtn = () => {
    onClose()
  }

  return (
    <>
      <Modal
        size={'md'}
        isOpen={isOpen}
        onClose={closeBtn}
        placement={'center'}
      >
        <ModalContent>
          {closeBtn => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  분야 순서변경
                </ModalHeader>
                <ModalBody>
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="droppable">
                      {provided => (
                        <Container
                          className="scrollbar"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          onScroll={handleScroll}
                        >
                          {items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.type}
                              index={index}
                            >
                              {provided => (
                                <Item
                                  key={item.id}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <span>{item.type}</span>
                                  <span>
                                    <i className="xi-drag-handle" />
                                  </span>
                                </Item>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </Container>
                      )}
                    </Droppable>
                  </DragDropContext>
                </ModalBody>
                <ModalFooter>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="text-accent border-accent"
                    onPress={closeBtn}
                  >
                    Close
                  </Button>
                  <Button size="sm" color="primary" type="submit">
                    저장
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
