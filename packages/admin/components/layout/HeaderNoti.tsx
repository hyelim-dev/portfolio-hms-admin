import { Suspense, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import AlarmsModal from '@/components/modal/AlarmsModal'
import AlarmsTotal from '@/components/items/AlarmsTotal'

const NotiBtn = styled.button`
  display: flex;
  align-items: center;
  position: relative;
  font-size: 2.2rem;
  justify-content: center;

  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 1.5rem;
    top: 50%;
    right: -0.9rem;
    margin-top: -0.75rem;
    background: ${({ theme }) => theme.colors.lightGray};
    transition: 0.3s;
  }

  @media screen and (max-width: 1024px) {
    font-size: 2rem;
    &:after {
      right: -0.4rem;
    }
  }
`
const NotiBox = styled.div`
  position: relative;
  @media screen and (max-width: 1024px) {
    position: unset;
  }
`
const NotiListBox = styled.div`
  position: absolute;
  top: 3rem;
  right: -9.3rem;
  width: 24rem;

  @media screen and (max-width: 1024px) {
    width: 100vw;
    top: 3.9rem;
    right: 0;
    margin-left: 0;
  }
`
const DropBox = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  background: #fff;
  border-radius: 0.5rem;
  height: fit-content;
  padding-bottom: 1rem;
`
const LodingDiv = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  padding: 0.3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
export default function HeaderNoti({}) {
  const [isListOpen, setIsListOpen] = useState(false)
  const notiBoxRef = useRef(null)
  const handleClickOutside = event => {
    if (notiBoxRef.current && !notiBoxRef.current.contains(event.target)) {
      setIsListOpen(false)
    }
  }

  useEffect(() => {
    if (isListOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isListOpen])

  return (
    <>
      <NotiBox ref={notiBoxRef}>
        <NotiBtn onClick={() => setIsListOpen(!isListOpen)}>
          <i className="xi-bell-o" />
          <AlarmsTotal />
        </NotiBtn>
        {isListOpen && (
          <NotiListBox>
            <DropBox>
              <Suspense
                fallback={
                  <LodingDiv>
                    <i className="xi-spinner-2" />
                  </LodingDiv>
                }
              >
                <AlarmsModal isListOpen={isListOpen} />
              </Suspense>
            </DropBox>
          </NotiListBox>
        )}
      </NotiBox>
    </>
  )
}
