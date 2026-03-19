import styled from 'styled-components'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react'
import { useForm } from 'react-hook-form'
// import useUserLogsMutation from '@/utils/userLogs'
import { useMutation } from '@apollo/client'
import { EDIT_MANAGE_USER_MUTATION } from '@/graphql/mutations'
import { useEffect } from 'react'
import { MME_QUERY, SEARCH_MANAGEUSER_QUERY } from '@/graphql/queries'

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
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
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
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: red;
  }
`

export default function ChangePassword({ isOpen, onClose, managerData }) {
  // const { userLogs } = useUserLogsMutation()
  const [editManager] = useMutation(EDIT_MANAGE_USER_MUTATION)
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm()
  const { errors } = formState

  const closePopup = () => {
    reset()
    onClose()
  }
  const password = watch('mPassword')
  const confirmPassword = watch('mPassword1')
  const checkPassword = (password1, password2) => {
    if (password1) {
      if (password1.length < 7) {
        setError('mPassword', {
          type: 'manual',
          message: '최소 8자리 이상이어야 합니다.',
        })
      } else {
        clearErrors('mPassword')
      }
    }
    if (password1 && password2) {
      if (password1 !== password2 || password1.length !== password2.length) {
        setError('mPassword1', {
          type: 'manual',
          message: '비밀번호가 일치하지 않습니다.',
        })
      } else {
        clearErrors('mPassword1')
      }
    }
  }

  useEffect(() => {
    checkPassword(password, confirmPassword)
  }, [password, confirmPassword])

  const onSubmit = async data => {
    try {
      const result = await editManager({
        variables: {
          editManageUserId: managerData.id,
          mPassword: data.mPassword.trim(),
          lastModifiedTime: new Date(),
        },
        refetchQueries: [MME_QUERY, SEARCH_MANAGEUSER_QUERY],
      })

      // userLogs(
      //   `${managerData.mUsername} 비밀번호 변경`,
      //   `ok: ${result.data.editManageUser.ok}`,
      // )

      if (!result.data.editManageUser.ok) {
        throw new Error('비밀번호 변경 실패')
      }

      alert('변경되었습니다.')
      closePopup()
    } catch (error) {
      console.error('비밀번호 변경 중 에러 발생:', error)
      alert('비밀번호 변경 처리 중 오류가 발생했습니다.')
      closePopup()
    }
  }

  return (
    <>
      <Modal
        size={'md'}
        isOpen={isOpen}
        onClose={closePopup}
        placement={'center'}
      >
        <ModalContent>
          {closePopup => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  비밀번호 변경
                </ModalHeader>
                <ModalBody>
                  <ScrollShadow className="scrollbar min-h-[10rem] max-h-[25rem]">
                    <TopInfo>
                      <Noti>
                        <span>*</span> 는 필수입력입니다.
                      </Noti>
                    </TopInfo>

                    <DetailDiv>
                      <FlexBox>
                        <AreaBox>
                          <Input
                            labelPlacement="outside"
                            placeholder="hc+입사년월일 예) hc240101"
                            variant={'bordered'}
                            radius="md"
                            type="password"
                            label={
                              <FilterLabel>
                                비밀번호<span>*</span>
                              </FilterLabel>
                            }
                            className="w-full"
                            onChange={e => {
                              register('mPassword').onChange(e)
                            }}
                            {...register('mPassword', {
                              required: {
                                value: true,
                                message: '비밀번호를 입력해주세요.',
                              },
                              minLength: {
                                value: 8,
                                message: '최소 8자리 이상이어야 합니다.',
                              },
                            })}
                          />
                          {errors.mPassword && (
                            <p className="px-2 pt-2 text-xs text-red">
                              {String(errors.mPassword.message)}
                            </p>
                          )}
                        </AreaBox>
                        <AreaBox>
                          <Input
                            labelPlacement="outside"
                            placeholder="비밀번호 확인"
                            variant={'bordered'}
                            radius="md"
                            type="password"
                            label={
                              <FilterLabel>
                                비밀번호확인<span>*</span>
                              </FilterLabel>
                            }
                            className="w-full"
                            onChange={e => {
                              register('mPassword1').onChange(e)
                            }}
                            {...register('mPassword1', {
                              required: {
                                value: true,
                                message: '비밀번호를 다시 한번 입력해주세요.',
                              },
                            })}
                          />
                          {errors.mPassword1 && (
                            <p className="px-2 pt-2 text-xs text-red">
                              {String(errors.mPassword1.message)}
                            </p>
                          )}
                        </AreaBox>
                      </FlexBox>
                    </DetailDiv>
                  </ScrollShadow>
                </ModalBody>
                <ModalFooter>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="text-accent border-accent"
                    onPress={closePopup}
                  >
                    Close
                  </Button>
                  <Button size="sm" color="primary" type="submit">
                    비밀번호 변경
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
