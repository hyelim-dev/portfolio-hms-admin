import { useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { gradeState } from '@/lib/recoilAtoms'
import { useRecoilValue } from 'recoil'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { SEARCH_STUDENTSTATE_MUTATION } from '@/graphql/mutations'
// import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import ConsolutMemoForm from '@/components/form/ConsolutMemoForm'
import ConsultDuplicate from '@/components/items/ConsultDuplicate'
import FormTopInfo from '@/components/common/FormTopInfo'
import ConsolutMemoEditForm from '@/components/form/ConsolutMemoEditForm'
import ConsultEditForm from '@/components/form/ConsultEditForm'
// import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'

const ConArea = styled.div`
  width: 100%;
  max-width: 1400px;
`

const DetailBox = styled.div`
  margin-top: 2rem;
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
`
const SemiTitle = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.accent};
  padding-bottom: 0.375rem;
  display: block;
`

const ColFlexBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`

const MemoList = styled.ul`
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

const MemoItem = styled.li`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;

  textarea {
    width: 100%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`

// type SearchPermissionsGrantedQeury = {
//   searchPermissionsGranted: ResultSearchPermissionsGranted
// }

export default function ConsultEdit({ mGrade, mId, studentId }) {
  const grade = useRecoilValue(gradeState)
  const [searchStudentStateMutation] = useMutation(SEARCH_STUDENTSTATE_MUTATION)
  const [consultation, setConsultation] = useState([])
  const [memoList, setMemoList] = useState([])
  const [studentState, setStudentState] = useState(null)

  // const { error: permissionError, data: permissionData } =
  //   useSuspenseQuery<SearchPermissionsGrantedQeury>(
  //     SEARCH_PERMISSIONS_GRANTED_QUERY,
  //     {
  //       variables: {
  //         permissionName: '상담관리자',
  //       },
  //     },
  //   )
  // const permissionManagers =
  //   permissionData.searchPermissionsGranted.data[0].ManageUser.map(
  //     manager => manager.id,
  //   )

  const fetchStudentState = async () => {
    if (studentId === null) return

    try {
      const { data } = await searchStudentStateMutation({
        variables: { searchStudentStateId: parseInt(studentId) },
      })

      if (!data || !data.searchStudentState.ok) {
        throw new Error('학생 상태를 불러오는 데 실패했습니다.')
      }

      return data.searchStudentState.studentState
    } catch (error) {
      console.error('학생 상태 조회 에러:', error)
    }
  }

  const fetchRelatedData = async (phoneNum1, stName) => {
    try {
      const { data } = await searchStudentStateMutation({
        variables: { phoneNum1, stName },
      })

      if (!data || !data.searchStudentState.ok) {
        throw new Error('관련 데이터를 불러오는 데 실패했습니다.')
      }

      return data.searchStudentState.studentState
    } catch (error) {
      console.error('관련 데이터 조회 에러:', error)
    }
  }

  const fetchData = async () => {
    const studentState = await fetchStudentState()

    if (studentState) {
      setStudentState(studentState[0])
      setMemoList(studentState[0].consultationMemo || [])

      const consultationData = await fetchRelatedData(
        studentState[0].phoneNum1,
        studentState[0].stName,
      )
      if (consultationData) {
        setConsultation(consultationData)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [studentId])

  return (
    <>
      {studentState !== null && (
        <ConArea>
          <Breadcrumb rightArea={false} isFilter={false} />
          <DetailBox>
            <FormTopInfo item={studentState} noti={true} time={true} />
            <ConsultEditForm
              studentState={studentState}
              mGrade={mGrade}
              supervisor={
                mGrade <= grade.subMaster
                // || permissionManagers.includes(mId)
              }
            />
          </DetailBox>
          {consultation?.length > 1 && (
            <DetailBox>
              <SemiTitle>중복 상담 문의 내역</SemiTitle>
              <ColFlexBox>
                {consultation
                  .filter(item => item.id !== studentState.id)
                  .map((item, index) => (
                    <ConsultDuplicate
                      key={index}
                      index={index + 1}
                      listData={item}
                    />
                  ))}
              </ColFlexBox>
            </DetailBox>
          )}

          <DetailBox>
            <ConsolutMemoForm
              setMemoList={setMemoList}
              studentId={studentState?.id}
            />
            {memoList && (
              <MemoList>
                {memoList?.map((item, index) => (
                  <MemoItem key={index}>
                    <ConsolutMemoEditForm
                      item={item}
                      setMemoList={setMemoList}
                      studentId={studentState?.id}
                    ></ConsolutMemoEditForm>
                  </MemoItem>
                ))}
              </MemoList>
            )}
          </DetailBox>
        </ConArea>
      )}
    </>
  )
}
