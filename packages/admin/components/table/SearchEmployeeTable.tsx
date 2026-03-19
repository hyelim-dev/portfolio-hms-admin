import styled from 'styled-components'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Pagination,
  ScrollShadow,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import {
  SEARCH_MANAGEUSER_QUERY,
  SEE_MANAGEUSER_QUERY,
} from '@/graphql/queries'
import { useRecoilValue } from 'recoil'
import { gradeState } from '@/lib/recoilAtoms'
import SearchEmployeeItem from '@/components/items/SearchEmployeeItem'

const SearchArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const ItemBox = styled.form`
  display: flex;
  gap: 0.5rem;
`
const TableWrap = styled.div`
  width: 100%;
  display: table;
  min-width: 520px;
`
const Theader = styled.div`
  width: 100%;
  min-width: fit-content;
  display: table;
  flex-wrap: nowrap;
  color: #111;
  font-size: 0.875rem;
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  text-align: center;
`
const TableItem = styled.div`
  display: table;
  position: relative;
  width: 100%;
  min-width: fit-content;
  flex-wrap: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  background: #fff;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);
  }
`
const TableRow = styled.div`
  display: table-row;
  width: 100%;
  min-width: fit-content;
  text-align: center;
`
const Tcheck = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
`
const Tname = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Tpart = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 40%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`
const Trank = styled.div`
  display: table-cell;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 1rem;
  font-size: inherit;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
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

export default function SearchEmployeeTable({
  groupSelected,
  setGroupSelected,
}) {
  const grade = useRecoilValue(gradeState)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(5)
  const [searchManager, { refetch, loading, error, data }] = useLazyQuery(
    SEARCH_MANAGEUSER_QUERY,
  )
  const [managerData, setManagerData] = useState(null)
  const [managerTotal, setManagerTotal] = useState(0)
  const { register, handleSubmit, getValues } = useForm()

  useEffect(() => {
    searchManager({
      variables: {
        mGrade: 9,
        resign: 'N',
        page: currentPage,
        limit: currentLimit,
      },
      onCompleted: result => {
        if (result.searchManageUser.ok) {
          setManagerData(result?.searchManageUser.data)
          setManagerTotal(result?.searchManageUser.totalCount)
        }
      },
    })
  }, [currentPage])

  const onSubmit = data => {
    searchManager({
      variables: {
        mUsername: data.mUsername,
        mGrade: 9,
        resign: 'N',
        page: currentPage,
        limit: currentLimit,
      },
      onCompleted: result => {
        if (result.searchManageUser.ok) {
          setManagerData(result?.searchManageUser.data)
          setManagerTotal(result?.searchManageUser.totalCount)
        }
      },
    })
  }

  const handleCheck = values => {
    setGroupSelected(values)
  }

  return (
    <>
      <SearchArea>
        <ItemBox onSubmit={handleSubmit(onSubmit)}>
          <Input
            labelPlacement="outside-left"
            size="sm"
            placeholder=" "
            type="text"
            variant="bordered"
            label="이름"
            {...register('mUsername')}
          />
          <Button
            type="submit"
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            className="text-white"
          >
            검색
          </Button>
        </ItemBox>
      </SearchArea>
      <ScrollShadow orientation="horizontal" className="scrollbar">
        <TableWrap>
          <CheckboxGroup
            value={groupSelected || []}
            onChange={handleCheck}
            classNames={{
              wrapper: 'gap-0',
            }}
          >
            <Theader>
              <TableRow>
                <Tcheck></Tcheck>
                <Tname>이름</Tname>
                <Tpart>부서</Tpart>
                <Trank>직위/직책</Trank>
              </TableRow>
            </Theader>
            {managerTotal > 0 && (
              <>
                {managerData?.map((manager, index) => (
                  <TableItem key={index}>
                    <TableRow>
                      <Checkbox key={manager.id} value={manager}></Checkbox>
                      <SearchEmployeeItem manager={manager} />
                    </TableRow>
                  </TableItem>
                ))}
              </>
            )}
            {managerTotal === 0 && <Nolist>검색 결과가 없습니다.</Nolist>}
          </CheckboxGroup>
        </TableWrap>
      </ScrollShadow>
      {managerTotal > 0 && (
        <PagerWrap>
          <Pagination
            variant="light"
            showControls
            initialPage={currentPage}
            page={currentPage}
            total={Math.ceil(managerTotal / currentLimit)}
            onChange={newPage => {
              setCurrentPage(newPage)
            }}
          />
        </PagerWrap>
      )}
    </>
  )
}
