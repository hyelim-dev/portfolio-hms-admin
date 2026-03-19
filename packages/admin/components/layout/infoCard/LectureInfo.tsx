import { styled } from 'styled-components'
import { Textarea } from '@nextui-org/react'
import { useRecoilValue } from 'recoil'
import { completionStatus, employmentStatus } from '@/lib/recoilAtoms'
import { useEffect, useState } from 'react'

const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaSmallBox = styled.div`
  @media (max-width: 768px) {
    width: 100% !important;
  }
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  span {
    color: red;
  }
`

const LineBox = styled.div`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-bottom: 2px solid hsl(240 6% 90%);
  height: 40px;
  line-height: 40px;
  font-size: 0.875rem;
`

export default function LectureInfo({ lectureData, students, attendance }) {
  const completion = useRecoilValue(completionStatus)
  const employment = useRecoilValue(employmentStatus)
  const [isFinish, setIsFinish] = useState(false)
  const [employmentStudent, setEmploymentStudent] = useState(null)
  const [courseDropout, setCourseDropout] = useState(null)
  const [incomplete, setIncomplete] = useState(null)
  const [graduates, setGraduates] = useState(null)

  useEffect(() => {
    if (lectureData && students) {
      const today = new Date()
      const endDate = new Date(parseInt(lectureData.lecturePeriodEnd))
      const studentFilter = students.filter(
        student =>
          student.courseComplete === completion.inTraining &&
          student.employment !== employment.unemployed,
      )

      setEmploymentStudent(studentFilter)

      setCourseDropout(
        countFilteredStudents(
          students,
          student => student.courseComplete === completion.dropout,
        ),
      )
      setGraduates(
        countFilteredStudents(
          students,
          student => student.courseComplete === completion.completed,
        ),
      )

      if (today > endDate) {
        setIsFinish(true)
        setIncomplete(
          countFilteredStudents(
            students,
            student => student.courseComplete === completion.notCompleted,
          ),
        )
      } else {
        setIncomplete(0)
      }

      // setExpectedEmploymentProof()
    }
  }, [lectureData, students])

  const formatDate = data => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    const formatted =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} `
    return formatted
  }

  const addSixMonths = dateString => {
    const timestamp = parseInt(dateString, 10)
    const date = new Date(timestamp)
    date.setMonth(date.getMonth() + 6)

    return formatDate(date.getTime())
  }

  const formatTime = dateString => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const extractTimeRange = dates => {
    const startTime = formatTime(dates[0])
    const endTime = formatTime(dates[1])
    return `${startTime} - ${endTime}`
  }

  const formatUsernames = data => {
    return data.map(item => item.mUsername).join(', ')
  }

  const calculatePercentage = (part, total) => {
    if (total === 0) {
      return 0
    }
    let percentage = (part / total) * 100
    return parseFloat(percentage.toFixed(2))
  }

  const countFilteredStudents = (students, filterCondition) => {
    const filteredStudents = students.filter(filterCondition)
    return filteredStudents.length
  }

  return (
    lectureData && (
      <>
        <FlexBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            <div>
              <FilterLabel>과정코드</FilterLabel>
              <LineBox>{lectureData.subject.subjectCode}</LineBox>
            </div>
          </AreaSmallBox>
          <AreaBox>
            <div>
              <Textarea
                label="강의명"
                isDisabled={true}
                isReadOnly={true}
                labelPlacement="outside"
                defaultValue={lectureData.temporaryName}
                minRows={1}
                variant="underlined"
                size="md"
                radius="sm"
                classNames={{
                  base: 'opacity-1',
                }}
              ></Textarea>
            </div>
          </AreaBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            <div>
              <FilterLabel>강의장</FilterLabel>
              <LineBox>{lectureData.roomNum}</LineBox>
            </div>
          </AreaSmallBox>
        </FlexBox>
        <FlexBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            <div>
              <FilterLabel>수강 구분</FilterLabel>
              <LineBox>{lectureData.subDiv}</LineBox>
            </div>
          </AreaSmallBox>
          <AreaBox>
            <div>
              <FilterLabel>훈련기간</FilterLabel>
              <LineBox>
                {formatDate(lectureData.lecturePeriodStart) +
                  ' ~ ' +
                  formatDate(lectureData.lecturePeriodEnd)}
              </LineBox>
            </div>
          </AreaBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            {attendance ? (
              <div>
                <FilterLabel>훈련시간</FilterLabel>
                <LineBox>{extractTimeRange(lectureData.lectureTime)}</LineBox>
              </div>
            ) : (
              <div>
                <FilterLabel>관리 종료일</FilterLabel>
                <LineBox>{addSixMonths(lectureData.lecturePeriodEnd)}</LineBox>
              </div>
            )}
          </AreaSmallBox>
          <AreaSmallBox style={{ minWidth: '20%' }}>
            <div>
              <FilterLabel>강사명</FilterLabel>
              <LineBox>{formatUsernames(lectureData.teachers)}</LineBox>
            </div>
          </AreaSmallBox>
        </FlexBox>
        {attendance && (
          <>
            <FlexBox>
              <AreaBox>
                <div>
                  <FilterLabel>승인 인원</FilterLabel>
                  <LineBox>{lectureData.ApprovedNum}</LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>확정 인원</FilterLabel>
                  <LineBox>{lectureData.confirmedNum}</LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>수강포기</FilterLabel>
                  <LineBox>
                    {countFilteredStudents(
                      students,
                      student => student.courseComplete === completion.dropout,
                    )}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>미수료</FilterLabel>
                  <LineBox>
                    {countFilteredStudents(
                      students,
                      student =>
                        student.courseComplete === completion.notCompleted,
                    )}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>조기취업 가입</FilterLabel>
                  <LineBox>
                    {employmentStudent && employmentStudent.length > 0
                      ? countFilteredStudents(
                          employmentStudent,
                          student =>
                            student.EmploymentStatus[0].completionType ===
                              '조기취업' &&
                            student.EmploymentStatus[0].imploymentInsurance ===
                              'Y',
                        )
                      : 0}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>조기취업 미가입</FilterLabel>
                  <LineBox>
                    {employmentStudent && employmentStudent.length > 0
                      ? countFilteredStudents(
                          employmentStudent,
                          student =>
                            student.EmploymentStatus[0].completionType ===
                              '조기취업' &&
                            student.EmploymentStatus[0].imploymentInsurance ===
                              'N',
                        )
                      : 0}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>훈련 인원</FilterLabel>
                  <LineBox>
                    {countFilteredStudents(
                      students,
                      student =>
                        student.courseComplete === completion.inTraining,
                    )}
                  </LineBox>
                </div>
              </AreaBox>
            </FlexBox>
            <FlexBox>
              <AreaBox>
                <div>
                  <FilterLabel>수료인원</FilterLabel>
                  <LineBox>
                    {countFilteredStudents(
                      students,
                      student =>
                        student.courseComplete === completion.completed,
                    )}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>수료취업 가입</FilterLabel>
                  <LineBox>
                    {employmentStudent && employmentStudent.length > 0
                      ? countFilteredStudents(
                          employmentStudent,
                          student =>
                            student.EmploymentStatus[0].completionType ===
                              '수료취업' &&
                            student.EmploymentStatus[0].imploymentInsurance ===
                              'Y',
                        )
                      : 0}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>수료취업 미가입</FilterLabel>
                  <LineBox>
                    {employmentStudent && employmentStudent.length > 0
                      ? countFilteredStudents(
                          employmentStudent,
                          student =>
                            student.EmploymentStatus[0].completionType ===
                              '수료취업' &&
                            student.EmploymentStatus[0].imploymentInsurance ===
                              'N',
                        )
                      : 0}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>중도탈락율</FilterLabel>
                  <LineBox>
                    {`${calculatePercentage(
                      courseDropout + incomplete,
                      lectureData.confirmedNum,
                    )}%`}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>수료율</FilterLabel>
                  <LineBox>
                    {`${calculatePercentage(
                      graduates,
                      lectureData.confirmedNum,
                    )}%`}
                  </LineBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>재직증명확보예정</FilterLabel>
                  <LineBox>
                    {employmentStudent && employmentStudent.length > 0
                      ? countFilteredStudents(
                          employmentStudent,
                          student =>
                            student.EmploymentStatus[0].proofOfImployment ===
                            'Y',
                        )
                      : 0}
                  </LineBox>
                </div>
              </AreaBox>
            </FlexBox>
          </>
        )}
      </>
    )
  )
}
