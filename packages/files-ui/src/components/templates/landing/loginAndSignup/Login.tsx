import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Typography,
  Input,
  Checkbox,
  LinkButton,
  Message
} from 'src/components/kit'
import { loginApiAction } from 'src/store/actionCreators'
import { useDispatch, useSelector } from 'react-redux'
import { loginValidator } from 'src/validators/loginValidator'
import { AppState } from 'src/store/store'
import { WalletAccessModule } from 'src/components/modules/WalletAccessModule/WalletAccessModule'

const Container = styled.div`
  width: 350px;
  padding: 2em;
`

const FormBox = styled.form`
  padding: 1em 0em;
  max-width: 300px;
`

const ForgotBox = styled.div`
  padding: 0em 0em 0em;
`

const TextForm = styled.div`
  padding: 0.2em 0em;
`

const SubmitBox = styled.div`
  padding: 1em 0em;
`

const useLoginForm = () => {
  const [loginInputs, setLoginInputs] = useState({
    email: '',
    password: ''
  })

  const handleLoginInputChange = (event: any) => {
    event.persist()
    setLoginInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }))
  }

  return {
    loginInputs,
    handleLoginInputChange
  }
}

enum SLIDE {
  WEB2 = 'web2',
  WEB3 = 'web3',
  GOOGLE = 'google' // Not implemented
}

interface IProps {
  showForgotPassword(): void
}

const Login: React.FC<IProps> = ({ showForgotPassword }) => {
  const { loginInputs, handleLoginInputChange } = useLoginForm()
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const { loginLoading, loginError } = useSelector(
    (state: AppState) => state.auth
  )

  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { errors, isValid } = loginValidator(loginInputs)
    if (!isValid) {
      return setLoginErrors(errors)
    }
    setLoginErrors({ email: '', password: '' })
    dispatch(loginApiAction(loginInputs.email, loginInputs.password))
  }

  const onForgotPassword = () => {
    // event.preventDefault();
    showForgotPassword()
  }

  const [slide, setSlide] = useState<SLIDE>(SLIDE.WEB2)

  return (
    <Container>
      {slide === SLIDE.WEB3 ? (
        <WalletAccessModule />
      ) : (
        <Button type="primary" onClick={() => setSlide(SLIDE.WEB3)}>
          Sign in with Web3 wallet
        </Button>
      )}
      {slide === SLIDE.WEB2 ? (
        <FormBox onSubmit={onLoginSubmit}>
          <TextForm>
            <Typography>Email</Typography>
            <Input
              placeholder="Email"
              name="email"
              value={loginInputs.email}
              onChange={handleLoginInputChange}
            />
            {loginErrors.email ? (
              <Message type="error" message={loginErrors.email} />
            ) : null}
          </TextForm>
          <TextForm>
            <Typography>Password</Typography>
            <Input.Password
              placeholder="password"
              name="password"
              value={loginInputs.password}
              onChange={handleLoginInputChange}
            />
            {loginErrors.password ? (
              <Message type="error" message={loginErrors.password} />
            ) : null}
          </TextForm>
          <TextForm>
            <Checkbox>Remember me</Checkbox>
          </TextForm>
          <br></br>
          <ForgotBox>
            <LinkButton onClick={onForgotPassword}>
              Forgot your password
            </LinkButton>
          </ForgotBox>
          <br></br>
          <SubmitBox>
            {loginError ? <Message type="error" message={loginError} /> : null}
            <Button htmlType="submit" type="primary" loading={loginLoading}>
              Sign in
            </Button>
          </SubmitBox>
        </FormBox>
      ) : (
        <Button type="primary" onClick={() => setSlide(SLIDE.WEB2)}>
          Sign in with email
        </Button>
      )}
    </Container>
  )
}

export { Login }
