import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { loginIdFocuseState, loginPasswordFocuseState } from '@/lib/recoilAtoms'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { LogUserIn } from '@/lib/apolloClient'
import { Button, Input } from '@nextui-org/react'
import { LOGIN_MUTATION } from '@/graphql/mutations'
import { useEffect, useState } from 'react'
// import useUserLogsMutation from '@/utils/userLogs'

type LoginForm = {
  id: string
  password: string
}

const Logo = styled.h1`
  width: 30%;
  margin: 0 auto 3rem;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 0 2rem;
  background: radial-gradient(
    circle,
    rgba(56, 99, 182, 1),
    rgba(33, 58, 101, 1)
  );
`

const LoginBox = styled.div`
  font-size: 2rem;
  color: #333;
  max-width: 28rem;
  width: 100%;
  padding: 5rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5rem rgba(0, 0, 0, 0.4);
`
const InputBox = styled.div`
  margin-top: 0.7rem;
  font-size: 1rem;

  label {
    color: inherit;
  }

  input {
    &:-webkit-autofill {
      background-color: transparent !important;
      -webkit-box-shadow: 0 0 0px 0 transparent inset;
      transition: background-color 5000s ease-in-out 0s;
      -webkit-text-fill-color: #fff !important;
    }

    &:autofill {
      background-color: transparent !important;
      -webkit-box-shadow: 0 0 0px 0 transparent inset;
      transition: background-color 5000s ease-in-out 0s;
      -webkit-text-fill-color: #fff !important;
    }
  }
`

const BtnBox = styled.div`
  margin-top: 3rem;
`

const Alink = styled.p`
  margin-top: 0.7rem;
  font-size: 0.9rem;
  font-weight: 200;
  color: #fff;
  padding-left: 0.2rem;

  a {
    position: relative;
  }

  a:after {
    content: '';
    width: 100%;
    height: 1px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`

const ErrorMessage = styled.p`
  padding: 0.5rem 0.5rem 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: tomato;
`

const InputVariants = {
  initial: {
    top: '1rem',
    fontSize: '1rem',
    opacity: '1',
  },
  focus: {
    top: '0.3rem',
    fontSize: '0.8rem',
    opacity: '0.5',
  },
  hasValue: {
    top: '0.3rem',
    fontSize: '0.8rem',
    opacity: '0.5',
  },
}

export default function Login() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LoginForm>()
  const [loginIdFocus, setLoginIdFocus] = useRecoilState(loginIdFocuseState)
  const [loginPasswordFocus, setLoginPasswordFocus] = useRecoilState(
    loginPasswordFocuseState,
  )
  // const { userLogs } = useUserLogsMutation()
  //api Test
  const [loginError, setLoginError] = useState('')
  const router = useRouter()
  const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION)

  const onSubmit = (data: LoginForm) => {
    login({
      variables: {
        mUserId: data.id.trim(),
        mPassword: data.password.trim(),
      },
      onCompleted: data => {
        const {
          mLogin: { ok, token, refreshToken, error },
        } = data

        // userLogs(`로그인`, `ok: ${ok}`)

        if (ok) {
          LogUserIn(token, refreshToken)
          router.push('/')
        } else {
          setLoginError(error)
        }
      },
    })
  }

  const clickAdmin = () => {
    alert(`데모 환경에서는 계정 찾기 기능을 제공하지 않습니다.`)
  }

  const idValue = useWatch({ control, name: 'id' })
  const passValue = useWatch({ control, name: 'password' })

  useEffect(() => {
    sessionStorage.removeItem('newStudent')
    sessionStorage.removeItem('newStudentState')
    sessionStorage.removeItem('newConsult')
    sessionStorage.removeItem('todayStudentTotal')
    sessionStorage.removeItem('newAccounting')
    sessionStorage.removeItem('today')
  }, [])

  return (
    <>
      <Container>
        <LoginBox>
          <Logo>
            <img src="logo_w.svg" alt="Admin" />
          </Logo>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputBox>
              <Input
                type="text"
                variant="bordered"
                label="User ID"
                id="id"
                autoCapitalize="none"
                onFocus={() => setLoginIdFocus(true)}
                className="text-white"
                {...register('id', {
                  required: {
                    value: true,
                    message: '아이디를 입력해주세요',
                  },
                  onBlur: () => {
                    if (idValue) {
                      setLoginIdFocus(true)
                    } else {
                      setLoginIdFocus(false)
                    }
                  },
                })}
              />
              {errors.id && (
                <ErrorMessage>{String(errors.id.message)}</ErrorMessage>
              )}
            </InputBox>
            <InputBox>
              <Input
                type="password"
                variant="bordered"
                label="password"
                id="password"
                className="text-white"
                onFocus={() => setLoginPasswordFocus(true)}
                {...register('password', {
                  required: {
                    value: true,
                    message: '비밀번호를 입력해주세요',
                  },
                  onBlur: () => {
                    if (passValue) {
                      setLoginPasswordFocus(true)
                    } else {
                      setLoginPasswordFocus(false)
                    }
                  },
                })}
              />
              {errors.password && (
                <ErrorMessage>{String(errors.password.message)}</ErrorMessage>
              )}
            </InputBox>
            {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
            <BtnBox>
              <Button
                type="submit"
                color="primary"
                className="w-full text-white"
              >
                로그인
              </Button>
            </BtnBox>
          </form>
          <Alink>
            <Link href={''} onClick={clickAdmin}>
              Forget ID or PW ?
            </Link>
          </Alink>
        </LoginBox>
      </Container>
    </>
  )
}
