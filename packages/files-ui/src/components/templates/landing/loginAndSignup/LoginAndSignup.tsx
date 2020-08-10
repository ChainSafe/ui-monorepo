import React, { useState } from 'react'
import { Login } from './Login'
import { SignUp } from './Signup'
import { ForgotPassword } from './ForgotPassword'
import styled from 'styled-components'
import { Typography, LinkButton } from 'src/components/kit'

const Container = styled.div``

const BoxTitle = styled.div`
  flex: 1;
`

const FlexBox = styled.div`
  padding: 0 2em;
  display: flex;
  align-items: center;
`

const BoxOr = styled(Typography)`
  padding-right: 0.5em;
`

enum MODE {
  SIGN_IN = 'signIn',
  SIGN_UP = 'signUp',
  FORGOT_PASSWORD = 'forgotPassword'
}

const LoginAndSignup: React.FC = () => {
  const [mode, setMode] = useState<MODE>(MODE.SIGN_IN)

  return (
    <Container>
      <FlexBox>
        <BoxTitle>
          <Typography.Title level={4}>
            {mode === MODE.SIGN_IN
              ? 'Sign In'
              : mode === MODE.SIGN_UP
              ? 'Sign up'
              : 'Forgot password'}
          </Typography.Title>
        </BoxTitle>
        <BoxOr>or</BoxOr>
        {mode === MODE.SIGN_IN ? (
          <LinkButton onClick={() => setMode(MODE.SIGN_UP)}>
            Create an account
          </LinkButton>
        ) : (
          <LinkButton onClick={() => setMode(MODE.SIGN_IN)}>Sign in</LinkButton>
        )}
      </FlexBox>
      {mode === MODE.SIGN_IN ? (
        <Login showForgotPassword={() => setMode(MODE.FORGOT_PASSWORD)} />
      ) : mode === MODE.SIGN_UP ? (
        <SignUp />
      ) : (
        <ForgotPassword />
      )}
    </Container>
  )
}

export { LoginAndSignup }
