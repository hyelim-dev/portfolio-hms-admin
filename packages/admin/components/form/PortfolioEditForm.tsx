import { styled } from 'styled-components'
import { Button, Checkbox, Input, Link, Textarea } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
// import useUserLogsMutation from '@/utils/userLogs'
import { EDIT_PORTFOLIO_MUTATION } from '@/graphql/mutations'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import PortfolioList from '@/components/layout/PortfolioList'

const DetailForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FlexBox = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1 3;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const FlexColBox = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  flex: 1;
  flex-direction: column;
`

const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`

const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;

  span {
    color: red;
  }
`
const CheckAreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`
const CheckText = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: normal;
  color: ${({ theme }) => theme.colors.black};
  display: block;

  span {
    font-weight: 700;
  }
`
const FilesBox = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
`

const FilesItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
`

const FilesItem = styled.div`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  width: 5rem;
  height: 5rem;
  background-color: #fff;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 4rem;
  text-align: center;
  color: #fff;
  font-weight: 700;
`
const FilesDelBtn = styled.button`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray};
`
const UrlBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
`
const URLItemBox = styled.div`
  display: flex;
  gap: 0.3rem;
`
const UrlText = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
const UrlInputBox = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.75rem;
  width: 5rem;

  @media (max-width: 768px) {
    padding-top: 0;
    width: 100%;
  }
`

export default function PortfolioEditForm({ item, refetch, studentName }) {
  // const { userLogs } = useUserLogsMutation()
  const [editPortfolio] = useMutation(EDIT_PORTFOLIO_MUTATION, {
    context: {
      headers: {
        'x-apollo-operation-name': 'filePath',
        // 'apollo-require-preflight': 'true',
      },
    },
  })
  const [avatarImg, setAvatartImg] = useState([])
  const [validFiles, setValidFiles] = useState([])
  const [portfolioFiles, setPortfolioFiles] = useState([])
  const [urlList, setUrlList] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [best, setBest] = useState(false)
  const fileInputRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    control,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      isBest: '',
      filePath: null,
      url: null,
      details: '',
    },
  })

  useEffect(() => {
    if (item) {
      reset({
        isBest: item.isBest || 'N',
        filePath: [],
        url: item.url || [],
        details: item.details || '',
      })

      if (item.isBest) {
        setBest(item.isBest === 'Y' ? true : false)
      }

      if (item.filePath) {
        setPortfolioFiles(item.filePath)
      }

      if (item.url) {
        setUrlList(item.url)
      }
    }
  }, [item])

  useEffect(() => {
    if (validFiles.length > 0) {
      setValue('filePath', validFiles, { shouldDirty: true })
    } else {
      setValue('filePath', [], { shouldDirty: true })
    }
  }, [validFiles])

  useEffect(() => {
    setValue('url', urlList, { shouldDirty: true })
  }, [urlList])

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('변경사항이 있습니다. 수정하시겠습니까?')
      if (isModify) {
        try {
          const result = await editPortfolio({
            variables: {
              editStudentPortfolioId: item.id,
              url: urlList,
              details: data.details,
              filePath: validFiles.length > 0 ? validFiles : null,
              isBest: data.isBest ? 'Y' : 'N',
              lastModifiedTime: new Date(),
            },
          })

          const dirtyFieldsArray = [...Object.keys(dirtyFields)]
          // userLogs(
          //   `${item.stName} 포트폴리오 수정`,
          //   `ok: ${
          //     result.data.editStudentPortfolio.ok
          //   } / ${dirtyFieldsArray.join(', ')}`,
          // )

          if (!result.data.editStudentPortfolio.ok) {
            throw new Error('포트폴리오 수정 실패')
          }

          refetch()
          setValidFiles([])
          setAvatartImg([])
          alert('수정되었습니다.')
        } catch (error) {
          console.error('포트폴리오 수정 중 에러 발생:', error)
          alert('포트폴리오 수정 처리 중 오류가 발생했습니다.')
        }
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  }

  const handleCheckboxChange = value => {
    setBest(value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    const files = event.target.files

    if (files && files.length > 0) {
      const newValidFiles = []
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ] // 허용할 이미지 타입 목록

      Array.from(files).forEach(file => {
        if (!validImageTypes.includes(file.type)) {
          setError('filePath', {
            type: 'manual',
            message:
              '이미지 파일만 업로드 가능합니다. ( jpg, jpeg, png, gif, webp )',
          })
        } else if (file.size > MAX_FILE_SIZE) {
          setError('filePath', {
            type: 'manual',
            message: '파일이 너무 큽니다. 10MB 이하만 가능합니다.',
          })
        } else {
          newValidFiles.push(file)
        }
      })

      if (newValidFiles.length > 0) {
        clearErrors('filePath')

        // 기존 validFiles와 새로운 validFiles를 합칩니다.
        setValidFiles(prevValidFiles => [...prevValidFiles, ...newValidFiles])
        newValidFiles.forEach(file => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setAvatartImg(prev => [...prev, reader.result])
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setValidFiles(prevValidFiles => {
      const updatedFiles = [...prevValidFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })

    setAvatartImg(prevAvatartImg => {
      const updatedAvatartImg = [...prevAvatartImg]
      updatedAvatartImg.splice(index, 1)
      return updatedAvatartImg
    })
  }
  const handleButtonClick = () => {
    fileInputRef.current.click()
  }
  const isValidURL = url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  const handleUrlClick = () => {
    if (inputValue !== '') {
      if (isValidURL(inputValue)) {
        setUrlList([...urlList, inputValue])
        setInputValue('')
        clearErrors('url')
      } else {
        setError('url', {
          type: 'manual',
          message: '올바른 URL 형식이 아닙니다.',
        })
      }
    }
  }
  const handleRemoveURL = (index: number) => {
    setUrlList(prevUrlList => {
      const updatedUrls = [...prevUrlList]
      updatedUrls.splice(index, 1)
      return updatedUrls
    })
  }

  const handleUrlInputKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault() // 기본 폼 제출 동작을 막기
      handleUrlClick() // URL 추가 버튼 클릭 핸들러 호출
    }
  }

  return (
    <>
      <DetailForm onSubmit={handleSubmit(onSubmit)}>
        <FlexBox>
          <CheckAreaBox>
            <CheckText>
              <span>{studentName}</span>학생을 우수학생으로 선정하시겠습니까?
            </CheckText>
            <Controller
              control={control}
              name="isBest"
              render={({ field }) => (
                <Checkbox
                  isSelected={best}
                  classNames={{ wrapper: 'mr-[0.3rem]' }}
                  onValueChange={e => {
                    handleCheckboxChange(e)
                    field.onChange(e)
                  }}
                >
                  <CheckText>선정</CheckText>
                </Checkbox>
              )}
            />
          </CheckAreaBox>
        </FlexBox>
        <FlexColBox>
          <FilterLabel>
            포트폴리오 <span>*</span>
          </FilterLabel>
          <PortfolioList
            portfolioFiles={portfolioFiles}
            portfolioId={item.id}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
          <Button
            variant="bordered"
            className="w-full text-lightPrimary border-lightPrimary text-[1.5rem] mt-[0.5rem]"
            type="button"
            onClick={handleButtonClick}
          >
            <i className="xi-plus" />
          </Button>

          <FilesBox>
            {avatarImg?.map((img, index) => (
              <FilesItemBox key={index}>
                <FilesItem
                  style={{
                    backgroundImage: `url('${img}')`,
                  }}
                />
                <FilesDelBtn
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                >
                  <i className="xi-close-circle" />
                </FilesDelBtn>
              </FilesItemBox>
            ))}
          </FilesBox>
          {errors.filePath && (
            <p className="px-2 pt-2 text-xs text-red">
              {String(errors.filePath.message)}
            </p>
          )}
        </FlexColBox>
        <FlexBox>
          <AreaBox>
            <FilterLabel>포트폴리오 URL</FilterLabel>
            <UrlBox>
              {urlList?.map((item, index) => (
                <URLItemBox key={index}>
                  <Link href={item} target="_blank">
                    <UrlText>{item}</UrlText>
                  </Link>
                  <FilesDelBtn
                    type="button"
                    onClick={() => handleRemoveURL(index)}
                  >
                    <i className="xi-close-circle" />
                  </FilesDelBtn>
                </URLItemBox>
              ))}
            </UrlBox>
            <UrlInputBox>
              <Input
                variant="bordered"
                value={inputValue}
                onKeyDown={handleUrlInputKeyDown}
                onChange={e => setInputValue(e.target.value)}
                placeholder="https://example.com"
              />
              <Button
                type="button"
                color="primary"
                variant="bordered"
                className="text-lightPrimary border-lightPrimary text-[1.5rem]"
                onClick={handleUrlClick}
              >
                <i className="xi-plus" />
              </Button>
            </UrlInputBox>
            {errors.url && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.url.message)}
              </p>
            )}
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Textarea
              label={
                <FilterLabel>
                  한줄 평가<span>*</span>
                </FilterLabel>
              }
              labelPlacement="outside"
              className="max-w-full"
              variant="bordered"
              minRows={5}
              onChange={e => {
                register('details').onChange(e)
              }}
              {...register('details', {
                required: {
                  value: true,
                  message: '한줄 평가를 입력해주세요.',
                },
              })}
            />
            {errors.details && (
              <p className="px-2 pt-2 text-xs text-red">
                {String(errors.details.message)}
              </p>
            )}
          </AreaBox>
          <BtnBox>
            <Button
              type="submit"
              size="md"
              radius="md"
              color="primary"
              className="md:w-[50%] w-full"
            >
              수정
            </Button>
          </BtnBox>
        </FlexBox>
      </DetailForm>
    </>
  )
}
