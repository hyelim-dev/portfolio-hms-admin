import { Pagination } from '@nextui-org/react'
import { styled } from 'styled-components'
import { useEffect, useState } from 'react'
import { SEE_MESSAGE_STORAGE_QUERY } from '@/graphql/queries'
import { useSuspenseQuery } from '@apollo/client'
import { ResultMessageStorage } from '@/src/generated/graphql'
import SMSCardItem from '@/components/items/SMSCardItem'

const FlexBox = styled.div`
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  display: grid;

  @media (max-width: 1610px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 1450px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 540px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`
const PagerWrap = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: center;
`

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

type SeeMessageStorageQuery = {
  seeMessageStorage: ResultMessageStorage
}

export default function SMSCardList({
  setMessageCon,
  setValue,
  type,
  setByteLength,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(12)
  const { error, data, refetch } = useSuspenseQuery<SeeMessageStorageQuery>(
    SEE_MESSAGE_STORAGE_QUERY,
    {
      variables: {
        saveType: type,
        limit: currentLimit,
        page: currentPage,
      },
    },
  )

  useEffect(() => {
    refetch()
  }, [currentPage])

  return (
    <>
      {data?.seeMessageStorage?.totalCount > 0 ? (
        <FlexBox>
          {data?.seeMessageStorage?.data?.map((item, index) => (
            <SMSCardItem
              key={index}
              item={item}
              setValue={setValue}
              setByteLength={setByteLength}
              setMessageCon={setMessageCon}
            />
          ))}
        </FlexBox>
      ) : (
        <Nolist>보관된 문자가 없습니다.</Nolist>
      )}

      {data?.seeMessageStorage?.totalCount > 0 && (
        <PagerWrap>
          <Pagination
            variant="light"
            showControls
            initialPage={currentPage}
            page={currentPage}
            total={Math.ceil(
              data?.seeMessageStorage?.totalCount / currentLimit,
            )}
            onChange={newPage => {
              setCurrentPage(newPage)
            }}
          />
        </PagerWrap>
      )}
    </>
  )
}
