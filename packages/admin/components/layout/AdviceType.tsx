import styled from 'styled-components'
import { Button, useDisclosure } from '@nextui-org/react'
import AdviceTypeList from '@/components/list/AdviceTypeList'
import { Suspense, useState } from 'react'
import TypeAddForm from '@/components/form/TypeAddForm'
import TypeIndexMoal from '@/components/modal/TypeIndexMoal'
import NotiModal from '@/components/modal/NotiModal'

const NotiBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 0.5rem;

  span {
    color: red;
  }

  button {
    font-size: 0.7rem;
  }
`
const BoxArea = styled.div`
  display: flex;
  width: 100%;
  gap: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function AdviceType({ category }) {
  const [totalCount, setTotalCount] = useState(0)
  const {
    isOpen: typeIsOpne,
    onOpen: typeOnOPen,
    onClose: typeOnClose,
  } = useDisclosure()

  const {
    isOpen: notiIsOpne,
    onOpen: notiOnOPen,
    onClose: notiOnClose,
  } = useDisclosure()

  return (
    <>
      <BoxArea>
        {category === '발신인증번호' && (
          <NotiBox>
            <p>
              <span>*</span> 반드시 이용증명원을 발급받은 번호만 등록해주세요.
            </p>
            <Button
              type="button"
              size="sm"
              // variant="light"
              variant="solid"
              className="px-2 text-white bg-accent h-unit-7"
              onClick={() => notiOnOPen()}
            >
              자세히보기
            </Button>
          </NotiBox>
        )}

        <TypeAddForm
          category={category}
          typeOnOPen={typeOnOPen}
          totalCount={totalCount}
        />

        <Suspense
          fallback={
            <LodingDiv>
              <i className="xi-spinner-2" />
            </LodingDiv>
          }
        >
          <AdviceTypeList
            category={category}
            setTotalCount={setTotalCount}
            typeIsOpne={typeIsOpne}
          />
        </Suspense>
      </BoxArea>
      {typeIsOpne && (
        <Suspense
          fallback={
            <LodingDiv>
              <i className="xi-spinner-2" />
            </LodingDiv>
          }
        >
          <TypeIndexMoal
            isOpen={typeIsOpne}
            onClose={typeOnClose}
            category={category}
          />
        </Suspense>
      )}
      {category === '발신인증번호' && (
        <>
          {notiIsOpne && (
            <NotiModal isOpen={notiIsOpne} onClose={notiOnClose} />
          )}
        </>
      )}
    </>
  )
}
