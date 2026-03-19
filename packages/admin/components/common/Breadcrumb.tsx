import { useRouter } from 'next/router'
import { Suspense, useEffect, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { motion } from 'framer-motion'
import { Button } from '@nextui-org/react'
import category from '@/lib/category'
import TypeBtn from '@/components/common/TypeBtn'
import PermissionBtn from '@/components/common/PermissionBtn'
import { withDemoGuard } from '@/utils/demo'

const BreadcrumbBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
`
const CateTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`
const BackIcon = styled.figure`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  color: #fff;
  margin-right: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.gray};
  }
`
const TitleBox = styled.div`
  display: flex;
  align-items: center;
`
const Title1 = styled.p`
  font-size: 1.875rem;
  letter-spacing: -0.025em;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};
  padding: 0 0.25rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`
const Title2 = styled.p`
  font-weight: normal;
  font-size: 1.5rem;
  padding-left: 0.25rem;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  span {
    font-size: 1rem;
    padding-left: 0.5rem;
  }
`
const BoxRt = styled.div`
  display: flex;
`
const FilterBtn = styled(motion.button)`
  display: flex;
  height: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 0.875rem;
`
const ActiveIcon = styled(motion.i)`
  padding: 0.5rem;
  color: #fff;
`
const LodingDiv = styled.div`
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Breadcrumb(props) {
  const theme = useTheme()
  const router = useRouter()
  const [breadcrumb, setBreadcrumb] = useState<string[]>([])

  const PrimaryColor = theme.colors.primary
  const FilterVariants = {
    initial: {
      padding: '0 1rem',
      background: '#fff',
      color: PrimaryColor,
      transition: {},
    },
    active: {
      padding: '0 1rem 0 0.5rem',
      background: PrimaryColor,
      color: '#fff',
      transition: {},
    },
  }

  const IconVariants = {
    initial: {
      scale: 0,
      display: 'none',
    },
    active: {
      scale: 1,
      display: 'inline',
    },
  }

  useEffect(() => {
    const pathnames = router.pathname.split('/').filter(x => x)
    setBreadcrumb(pathnames)
  }, [router.pathname])

  const topCate = category.find(item => item.href === `/${breadcrumb[0]}`)
  const subCate =
    topCate?.children !== undefined &&
    topCate.children.find(item =>
      breadcrumb[1] ? item.href === `/${breadcrumb[1]}` : item.href === '/',
    )
  const currentCate =
    breadcrumb.length > 1
      ? subCate
      : topCate?.children.find(item => item.href === '/') === undefined
        ? topCate
        : subCate

  return (
    <>
      {currentCate?.isBreadcrumb && (
        <BreadcrumbBox>
          <CateTitle>
            <TitleBox>
              {!currentCate.exposure && (
                <button onClick={() => router.back()}>
                  <BackIcon>
                    <i className="xi-arrow-left"></i>
                  </BackIcon>
                </button>
              )}
              <Title1>{topCate?.name}</Title1>
            </TitleBox>
            {subCate !== undefined && (
              <TitleBox>
                <Title2>
                  <i className="xi-angle-right-thin" />
                </Title2>
                <Title2>
                  {subCate?.name}
                  <span>{props.addTitle}</span>
                </Title2>
              </TitleBox>
            )}
          </CateTitle>
          {props.rightArea && (
            <BoxRt>
              {props.isFilter && (
                <FilterBtn
                  variants={FilterVariants}
                  initial="initial"
                  animate={props.isActive ? 'active' : 'initial'}
                  onClick={() => {
                    props.onFilterToggle(prev => !prev)
                  }}
                >
                  <ActiveIcon
                    variants={IconVariants}
                    initial="initial"
                    animate={props.isActive ? 'active' : 'initial'}
                    className="xi-check-min"
                  />
                  Filter
                </FilterBtn>
              )}
              {props.write && (
                <>
                  {props.write.permissionName ? (
                    <Suspense
                      fallback={
                        <LodingDiv>
                          <i className="xi-spinner-2" />
                        </LodingDiv>
                      }
                    >
                      <PermissionBtn
                        btnName={'등록'}
                        style={{
                          size: 'sm',
                          variant: 'solid',
                          css: 'bg-accent text-white',
                        }}
                        permissionName={props.write.permissionName}
                        handleClick={withDemoGuard(() => {
                          router.push(props.write.link)
                        })}
                      />
                    </Suspense>
                  ) : (
                    <Button
                      size="sm"
                      radius="sm"
                      variant="solid"
                      className="text-white bg-accent"
                      onClick={withDemoGuard(() =>
                        router.push(props.write.link),
                      )}
                    >
                      등록
                    </Button>
                  )}
                </>
              )}
              {props.typeBtn && (
                <Suspense
                  fallback={
                    <LodingDiv>
                      <i className="xi-spinner-2" />
                    </LodingDiv>
                  }
                >
                  <TypeBtn
                    typeLink={props.typeBtn.typeLink}
                    permissionName={props.typeBtn.permissionName}
                  />
                </Suspense>
              )}
              {props.addRender !== '' && <>{props.addRender}</>}
            </BoxRt>
          )}
        </BreadcrumbBox>
      )}
    </>
  )
}
