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
import SMSAddrStudentItem from '@/components/items/SMSAddrStudentItem'
import { useMutation } from '@apollo/client'
import { SEARCH_STUDENT_FILTER_MUTATION } from '@/graphql/mutations'

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
const Tphone = styled.div`
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

export default function SMSAddrModal({ groupSelected, setGroupSelected }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(5)
  const [searchStudentFilterMutation] = useMutation(
    SEARCH_STUDENT_FILTER_MUTATION,
  )

  const [studentData, setStudentData] = useState(null)
  const [studentTotal, setStudentTotal] = useState(0)
  const { register, handleSubmit, getValues } = useForm()
  const searchName = getValues('studentName')

  useEffect(() => {
    if (studentData) {
      searchStudentFilterMutation({
        variables: {
          studentName: searchName,
          page: currentPage,
          limit: currentLimit,
        },
        onCompleted: resData => {
          if (resData.searchStudent.ok) {
            const { student, totalCount } = resData.searchStudent || {}
            setStudentData(student)
            setStudentTotal(totalCount)
          }
        },
      })
    }
  }, [currentPage])

  const onSubmit = data => {
    searchStudentFilterMutation({
      variables: {
        studentName: data.studentName,
        page: currentPage,
        limit: currentLimit,
      },
      onCompleted: resData => {
        if (resData.searchStudent.ok) {
          const { student, totalCount } = resData.searchStudent || {}
          setStudentData(student)
          setStudentTotal(totalCount)
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
            {...register('studentName')}
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
                <Tpart>생일</Tpart>
                <Tphone>휴대폰</Tphone>
              </TableRow>
            </Theader>
            {studentTotal > 0 && (
              <>
                {studentData?.map((student, index) => (
                  <TableItem key={index}>
                    <TableRow>
                      <Checkbox key={student.id} value={student}></Checkbox>
                      <SMSAddrStudentItem student={student} />
                    </TableRow>
                  </TableItem>
                ))}
              </>
            )}
            {studentTotal === 0 && <Nolist>검색 결과가 없습니다.</Nolist>}
          </CheckboxGroup>
        </TableWrap>
      </ScrollShadow>

      {studentTotal > 0 && (
        <PagerWrap>
          <Pagination
            variant="light"
            showControls
            initialPage={currentPage}
            page={currentPage}
            total={Math.ceil(studentTotal / currentLimit)}
            onChange={newPage => {
              setCurrentPage(newPage)
            }}
          />
        </PagerWrap>
      )}
    </>
  )
}
