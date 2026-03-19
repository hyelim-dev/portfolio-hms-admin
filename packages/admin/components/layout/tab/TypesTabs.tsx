import { Tab, Tabs } from '@nextui-org/react'
import { styled } from 'styled-components'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TypesItem from '@/components/items/TypesItem'

const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: none;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function TypesTabs() {
  const router = useRouter()
  const { typeTab } = router.query
  const [selected, setSelected] = useState('adviceType')

  useEffect(() => {
    if (typeTab) {
      setSelected(String(typeTab))
    }
  }, [typeTab])

  return (
    <>
      <Tabs
        variant="underlined"
        aria-label="Options"
        color="primary"
        classNames={{
          tabList: 'flex-wrap',
          tab: 'w-auto',
        }}
        selectedKey={selected}
        onSelectionChange={e => setSelected(String(e))}
      >
        <Tab key="adviceType" title="상담분야">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'상담분야'} />
          </Suspense>
        </Tab>
        <Tab key="receipt" title="접수구분">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'접수구분'} />
          </Suspense>
        </Tab>
        <Tab key="subDiv" title="수강구분">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'수강구분'} />
          </Suspense>
        </Tab>
        <Tab key="teacherType" title="강의분야">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'강의분야'} />
          </Suspense>
        </Tab>
        <Tab key="supportType" title="훈련생유형">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'훈련생유형'} />
          </Suspense>
        </Tab>
        <Tab key="mPartType" title="부서">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'부서'} />
          </Suspense>
        </Tab>
        <Tab key="smsSender" title="발신인증번호">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <TypesItem type={'발신인증번호'} />
          </Suspense>
        </Tab>
      </Tabs>
    </>
  )
}
