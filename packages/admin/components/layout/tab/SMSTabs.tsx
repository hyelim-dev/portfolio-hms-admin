import { Tab, Tabs } from '@nextui-org/react'
import { styled } from 'styled-components'
import { Suspense, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { smsFilterState, smsSearchState } from '@/lib/recoilAtoms'
import SMSCardList from '@/components/list/SMSCardList'
import SmsSendFilter from '@/components/filter/SmsSendFilter'
import { useRouter } from 'next/router'
import SmsSendList from '@/components/list/SmsSendList'
import SmsSendFilterList from '@/components/list/SmsSendFilterList'

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
const AreaTitleFilter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export default function SMSTabs({ setMessageCon, setValue, setByteLength }) {
  const router = useRouter()
  const { smsTab } = router.query
  const [selected, setSelected] = useState('mySMS')
  const [filterSearch, setFilterSearch] = useRecoilState(smsFilterState)
  const [smsFilter, setSmsFilter] = useRecoilState(smsSearchState)

  useEffect(() => {
    if (smsTab) {
      setSelected(String(smsTab))
    }
  }, [smsTab])

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
        <Tab key="mySMS" title="내문자함">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <SMSCardList
              setMessageCon={setMessageCon}
              setValue={setValue}
              setByteLength={setByteLength}
              type={'개인'}
            />
          </Suspense>
        </Tab>
        <Tab key="commonSMS" title="공통문자함">
          <Suspense
            fallback={
              <LodingDiv>
                <i className="xi-spinner-2" />
              </LodingDiv>
            }
          >
            <SMSCardList
              setMessageCon={setMessageCon}
              setValue={setValue}
              setByteLength={setByteLength}
              type={'공통'}
            />
          </Suspense>
        </Tab>
        <Tab key="send" title="보낸문자함">
          <AreaTitleFilter>
            <SmsSendFilter
              filterSearch={filterSearch}
              onFilterSearch={setFilterSearch}
              setSmsFilter={setSmsFilter}
              smsFilter={smsFilter}
            />
          </AreaTitleFilter>
          {filterSearch ? (
            <Suspense
              fallback={
                <LodingDiv>
                  <i className="xi-spinner-2" />
                </LodingDiv>
              }
            >
              <SmsSendFilterList smsFilter={smsFilter} />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <LodingDiv>
                  <i className="xi-spinner-2" />
                </LodingDiv>
              }
            >
              <SmsSendList />
            </Suspense>
          )}
        </Tab>
      </Tabs>
    </>
  )
}
