import MainWrap from '@/components/wrappers/MainWrap'
import { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { Button, Chip, Link } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import Layout from '@/pages/lecture/layout'
import { SEARCH_LECTURES_MUTATION } from '@/graphql/mutations'
import LectureInfo from '@/components/layout/infoCard/LectureInfo'
import AbsentList from '@/components/table/AbsentList'
import Attendance from '@/components/table/Attendance'
import AttendanceFilter from '@/components/filter/AttendanceFilter'
import AttendanceFilterList from '@/components/table/AttendanceFilterList'
import AttendanceCountFilter from '@/components/filter/AttendanceCountFilter'
import AbsentFilterList from '@/components/table/AbsentFilterList'
import { useRecoilValue } from 'recoil'
import {
  assignmentState,
  completionStatus,
  gradeState,
} from '@/lib/recoilAtoms'
import AttendanceTabs from '@/components/layout/tab/AttendanceTabs'
import FormTopInfo from '@/components/common/FormTopInfo'
import useMmeQuery from '@/utils/mMe'
import PermissionBtn from '@/components/common/PermissionBtn'
import { demoAlert, withDemoGuard } from '@/utils/demo'

const LodingDiv = styled.div`
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

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
const FlexBox = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 0.5rem;
  padding: 1.5rem 1.5rem 0;
`
const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  font-size: 0.8rem;
  @media (max-width: 768px) {
    align-items: flex-end;
    flex-direction: column-reverse;
  }
`
const Noti = styled.p`
  font-size: 0.8rem;
  span {
    color: red;
  }
`

const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const FlexChipBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const AreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
`
const AreaTitleFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

const Nolist = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  color: ${({ theme }) => theme.colors.gray};
`

export default function AttendancePage() {
  const router = useRouter()
  const lectureId = typeof router.query.id === 'string' ? router.query.id : null
  const grade = useRecoilValue(gradeState)
  const { useMme } = useMmeQuery()
  const mId = useMme('id')
  const mGrade = useMme('mGrade')
  const [searchLectures] = useMutation(SEARCH_LECTURES_MUTATION)
  const assignment = useRecoilValue(assignmentState)
  const completion = useRecoilValue(completionStatus)
  const [lectureData, setLectureData] = useState(null)
  const [students, setStudents] = useState(null)
  const [sortStudents, setSortStudents] = useState(null)
  const [filterAttandanceActive, setFilterAttandanceActive] = useState(true)
  const [filterAttandanceSearch, setFilterAttandanceSearch] = useState()
  const [filterAttandanceData, setFilterAttandanceData] = useState(true)
  const [isRead, setIsRead] = useState(false)
  const [filterAttandanceCountActive, setFilterAttandanceCountActive] =
    useState(true)
  const [filterAttandanceCountSearch, setFilterAttandanceCountSearch] =
    useState()
  const [filterAttandanceCountData, setFilterAttandanceCountData] =
    useState(true)

  const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  }

  useEffect(() => {
    if (lectureId !== null) {
      searchLectures({
        variables: {
          searchLecturesId: parseInt(lectureId),
        },
        onCompleted: result => {
          if (result.searchLectures.ok) {
            const { data } = result.searchLectures
            setLectureData(data[0])
            const filterStudent = data[0].subject.StudentPayment.filter(
              student => student.lectureAssignment === assignment.assignment,
            )
            setStudents(filterStudent)
            const sortOrder = filterStudent.sort((a, b) => {
              return naturalCompare(a.student.name, b.student.name)
            })
            setSortStudents(sortOrder)

            const theachers = data[0].teachers.map(teacher => teacher.id)
            if (mGrade <= grade.general || theachers.includes(mId)) {
              setIsRead(true)
            } else {
              alert('접근권한이 없습니다.')
              router.back()
            }
          }
        },
      })
    }
  }, [router])

  const handleClick = event => {
    if (lectureData?.timetableAttached === null) {
      event.preventDefault()
      alert('등록된 시간표가 없습니다.')
    }
  }

  return (
    <>
      {isRead && (
        <MainWrap>
          <ConArea>
            <Breadcrumb rightArea={false} isFilter={false} />
            <DetailBox>
              <FormTopInfo item={lectureData} noti={true} time={true} />
              <DetailDiv>
                <AreaTitle>
                  <h4>기본 정보</h4>
                  <Suspense
                    fallback={
                      <LodingDiv>
                        <i className="xi-spinner-2" />
                      </LodingDiv>
                    }
                  >
                    <PermissionBtn
                      btnName={'수정'}
                      style={{
                        size: 'sm',
                        variant: 'solid',
                        css: 'text-white',
                      }}
                      permissionName={'강의관리접근'}
                      handleClick={withDemoGuard(() => {
                        router.push(`/lecture/detail/${lectureData?.id}`)
                      })}
                    />
                  </Suspense>
                </AreaTitle>
                <LectureInfo
                  lectureData={lectureData}
                  students={students}
                  attendance={true}
                />
              </DetailDiv>
            </DetailBox>
            <DetailBox>
              <DetailDiv>
                <AreaTitle>
                  <h4>학적부</h4>
                </AreaTitle>
                <Noti>
                  <span>&#10071;</span>
                  교육훈련대상 수강생이 아닌 경우 학적부 명단에 나타나지
                  않습니다.
                </Noti>
                <FlexChipBox>
                  {sortStudents?.length > 0 ? (
                    <>
                      {mGrade === grade.teacher ? (
                        <>
                          {sortStudents
                            .filter(
                              student =>
                                student.courseComplete !== completion.dropout,
                            )
                            .map((item, index) => (
                              <Chip key={index} color="primary">
                                {item.student.name}
                              </Chip>
                            ))}
                        </>
                      ) : (
                        <>
                          {sortStudents
                            .filter(
                              student =>
                                student.courseComplete !== completion.dropout,
                            )
                            .map((item, index) => (
                              <Link
                                href={`/lecture/employmentDetail/${item.id}`}
                                key={index}
                                onClick={e => {
                                  e.preventDefault()
                                  demoAlert()
                                }}
                              >
                                <Chip color="primary">{item.student.name}</Chip>
                              </Link>
                            ))}
                        </>
                      )}
                    </>
                  ) : (
                    <Nolist>교육훈련대상 수강생이 없습니다.</Nolist>
                  )}
                </FlexChipBox>
              </DetailDiv>
            </DetailBox>

            {lectureData?.timetableAttached && (
              <FlexBox>
                <Link
                  href={lectureData?.timetableAttached || '#'}
                  onClick={handleClick}
                >
                  <Chip variant="bordered" color="primary">
                    &#128205; 훈련시간표 다운로드
                  </Chip>
                </Link>
              </FlexBox>
            )}

            <DetailBox>
              <DetailDiv>
                <AreaTitleFilter>
                  <h4>출석부</h4>
                  {students?.length > 0 && (
                    <AttendanceFilter
                      isActive={filterAttandanceActive}
                      lectureData={lectureData}
                      filterAttandanceSearch={filterAttandanceSearch}
                      setFilterAttandanceData={setFilterAttandanceData}
                      setFilterAttandanceSearch={setFilterAttandanceSearch}
                    />
                  )}
                </AreaTitleFilter>
                {students?.length > 0 ? (
                  <>
                    {filterAttandanceSearch ? (
                      <AttendanceFilterList
                        lectureData={lectureData}
                        students={students}
                        filterAttandanceData={filterAttandanceData}
                        isTeacher={mGrade === grade.teacher}
                      />
                    ) : (
                      <Attendance
                        lectureData={lectureData}
                        students={students}
                        isTeacher={mGrade === grade.teacher}
                      />
                    )}
                  </>
                ) : (
                  <Nolist>수강생이 없습니다.</Nolist>
                )}
              </DetailDiv>
            </DetailBox>
            {sortStudents && (
              <DetailBox>
                <DetailDiv>
                  <AreaTitleFilter>
                    <h4>출결현황</h4>
                    {students?.length > 0 && (
                      <AttendanceCountFilter
                        isActive={filterAttandanceActive}
                        lectureData={lectureData}
                        filterAttandanceCountSearch={
                          filterAttandanceCountSearch
                        }
                        setFilterAttandanceCountData={
                          setFilterAttandanceCountData
                        }
                        setFilterAttandanceCountSearch={
                          setFilterAttandanceCountSearch
                        }
                      />
                    )}
                  </AreaTitleFilter>
                  {students?.length > 0 ? (
                    <>
                      {filterAttandanceCountSearch ? (
                        <AbsentFilterList
                          lectureId={lectureData?.id}
                          filterAttandanceCountData={filterAttandanceCountData}
                          sortStudents={sortStudents}
                        />
                      ) : (
                        <AbsentList
                          lectureId={lectureData?.id}
                          lectureDates={lectureData?.lectureDetails}
                          sortStudents={sortStudents}
                        />
                      )}
                    </>
                  ) : (
                    <Nolist>출결사항이 없습니다.</Nolist>
                  )}
                </DetailDiv>
              </DetailBox>
            )}
            <AttendanceTabs
              lectureId={lectureData?.id}
              subjectId={lectureData?.subjectId}
              students={students}
            />
            <DetailBox>
              <BtnBox>
                <Button
                  size="md"
                  radius="md"
                  variant="bordered"
                  color="primary"
                  className="md:w-[50%] w-full"
                  onClick={() => {
                    router.back()
                  }}
                >
                  이전으로
                </Button>
              </BtnBox>
            </DetailBox>
          </ConArea>
        </MainWrap>
      )}
    </>
  )
}
AttendancePage.getLayout = page => <Layout>{page}</Layout>
