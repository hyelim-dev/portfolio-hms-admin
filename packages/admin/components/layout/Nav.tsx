import { navOpenState, navScrollPositionState } from '@/lib/recoilAtoms'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import Category from '@/components/layout/Category'
import { ScrollShadow } from '@nextui-org/react'
import { useEffect, useRef } from 'react'

const NavSec = styled(motion.div)<{ $navOpen: boolean }>`
  display: flex;
  width: ${props => (props.$navOpen ? '18rem' : '5rem')};
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  background: #fff;
  transition: 0.3s;

  @media screen and (max-width: 1024px) {
    max-width: 100%;
    width: 80vw;
    transform: ${props =>
      props.$navOpen ? 'translatex(0);' : 'translatex(-100%);'};
  }
`

const NavWrap = styled(motion.div)<{ $navOpen: boolean }>`
  row-gap: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  display: flex;
  padding: ${props =>
    props.$navOpen ? ' 0 1.5rem 1.5rem' : ' 0 0.7rem 1.5rem'};
  transition: 0.3s;

  @media screen and (max-width: 1024px) {
    padding: 0 1.5rem 1.5rem;
  }

  @media screen and (max-width: 640px) {
    padding: 0 1rem 1rem;
  }
`

const Logo = styled(motion.h1)<{ $navOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.$navOpen ? 'start' : 'center')};
  width: 100%;
  height: 4rem;
  flex-shrink: 0;
  overflow: hidden;
`
const LogoImg = styled(motion.img)<{ $navOpen: boolean }>`
  max-width: ${props => (props.$navOpen ? '80%' : '100%')};
  height: ${props => (props.$navOpen ? '3rem' : '2rem')};

  @media screen and (max-width: 1024px) {
    max-width: none;
    height: 2rem;
  }

  @media screen and (max-width: 520px) {
    max-width: none;
    height: 1.5rem;
  }
`

const ConBox = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const CateBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 1.75rem;
`
const Dim = styled(motion.div)`
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 49;
  background: rgba(0, 0, 0, 0.5);

  @media screen and (max-width: 1024px) {
    display: block;
  }
`
const DimBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 0.7rem;
  display: none;
  align-items: center;
  width: 2.2rem;
  height: 2.2rem;
  padding: 0.3rem;
  font-size: 1.5rem;
  color: #111;
  z-index: 1000;

  @media screen and (max-width: 1024px) {
    display: flex;
  }
`

export default function Nav() {
  const [navOpen, setNavOpen] = useRecoilState(navOpenState)
  const [navScrollPosition, setNavScrollPosition] = useRecoilState(
    navScrollPositionState,
  )
  const navRef = useRef<HTMLDivElement>(null)

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  useEffect(() => {
    if (navOpen && navRef.current) {
      navRef.current.scrollTop = navScrollPosition
    }
  }, [navOpen])

  const handleScroll = () => {
    if (navRef.current) {
      setNavScrollPosition(navRef.current.scrollTop)
    }
  }

  return (
    <>
      <NavSec $navOpen={navOpen}>
        <div
          ref={navRef}
          onScroll={handleScroll}
          style={{ height: '100%', overflowY: 'auto', width: '100%' }}
          className="scrollbar_g"
        >
          <ScrollShadow className="w-full">
            <NavWrap $navOpen={navOpen}>
              <Logo $navOpen={navOpen}>
                <Link href={'/'}>
                  <LogoImg
                    $navOpen={navOpen}
                    src={navOpen ? '/logo_c.svg' : '/logo_c.svg'}
                    alt="Admin"
                  />
                </Link>
              </Logo>
              <DimBtn onClick={toggleNav}>
                <i className="xi-close" />
              </DimBtn>
              <ConBox>
                <CateBox>
                  <Category />
                </CateBox>
              </ConBox>
            </NavWrap>
          </ScrollShadow>
        </div>
      </NavSec>
      {navOpen && <Dim onClick={toggleNav} />}
    </>
  )
}
