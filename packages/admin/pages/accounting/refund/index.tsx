import MainWrap from '@/components/wrappers/MainWrap'
import Breadcrumb from '@/components/common/Breadcrumb'
import Layout from '@/pages/accounting/layout'
import { styled } from 'styled-components'
import RefundTable from '@/components/table/RefundTable'
import RefundFilter from '@/components/filter/RefundFilter'
import { useRecoilState } from 'recoil'
import {
  refundFilterActiveState,
  refundFilterState,
  refundSearchState,
} from '@/lib/recoilAtoms'
import RefundFilterTable from '@/components/table/RefundFilterTable'

const ConBox = styled.div`
  margin: 2rem 0;
`

export default function Refund() {
  const [filterActive, setFilterActive] = useRecoilState(
    refundFilterActiveState,
  )
  const [filterSearch, setFilterSearch] = useRecoilState(refundFilterState)
  const [studentFilter, setStudentFilter] = useRecoilState(refundSearchState)

  return (
    <>
      <MainWrap>
        <Breadcrumb
          onFilterToggle={setFilterActive}
          isActive={filterActive}
          rightArea={true}
          isFilter={true}
        />
        <RefundFilter
          isActive={filterActive}
          onFilterSearch={setFilterSearch}
          setStudentFilter={setStudentFilter}
        />
        <ConBox>
          {filterSearch ? (
            <RefundFilterTable studentFilter={studentFilter} />
          ) : (
            <RefundTable />
          )}
        </ConBox>
      </MainWrap>
    </>
  )
}
Refund.getLayout = page => <Layout>{page}</Layout>
