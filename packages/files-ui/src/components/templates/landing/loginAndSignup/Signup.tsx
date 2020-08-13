import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Typography,
  Input,
  Checkbox,
  Message
} from 'src/components/kit'
import { useDispatch, useSelector } from 'react-redux'
import { signupApiAction } from 'src/store/actionCreators'
import { signupValidator } from 'src/validators/loginValidator'
import { AppState } from 'src/store/store'
import { WalletAccessModule } from 'src/components/modules/WalletAccessModule/WalletAccessModule'

const Container = styled.div`
  width: 350px;
  padding: 2em;
`

// const FlexBox = styled.div`
//   display: flex;
//   align-items: center;
// `;

const FormBox = styled.form`
  padding: 1em 0em;
  max-width: 300px;
`

const TextForm = styled.div`
  padding: 0.2em 0em;
`

const SubmitBox = styled.div`
  padding: 1em 0em;
`

const useSignupForm = () => {
  const [signupInputs, setSignupInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const handleSignupInputChange = (event: any) => {
    event.persist()
    setSignupInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }))
  }

  return {
    signupInputs,
    handleSignupInputChange
  }
}

enum SLIDE {
  WEB2 = 'web2',
  WEB3 = 'web3',
  GOOGLE = 'google' // Not implemented
}

const SignUp: React.FC = () => {
  const [signupErrors, setSignupErrors] = useState({
    email: '',
    password: '',
    name: ''
  })
  const { signupInputs, handleSignupInputChange } = useSignupForm()
  const dispatch = useDispatch()
  const { signupLoading, signupError } = useSelector(
    (state: AppState) => state.auth
  )

  const onSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { errors, isValid } = signupValidator(signupInputs)
    if (!isValid) {
      return setSignupErrors(errors)
    }
    setSignupErrors({ name: '', email: '', password: '' })
    dispatch(signupApiAction(signupInputs))
  }

  const [slide, setSlide] = useState<SLIDE>(SLIDE.WEB2)

  return (
    <Container>
      {slide === SLIDE.WEB3 ? (
        <WalletAccessModule />
      ) : (
        <Button
          htmlType="button"
          type="primary"
          onClick={() => setSlide(SLIDE.WEB3)}
        >
          Sign up with Web3 wallet
        </Button>
      )}
      {slide === SLIDE.WEB2 ? (
        <FormBox onSubmit={onSignUpSubmit}>
          {/* <TextForm>
              <FlexBox>
                <div>
                  <Typography>First name</Typography>
                  <Input
                    style={{ marginRight: 4 }}
                    name="firstName"
                    onChange={handleSignupInputChange}
                    value={signupInputs.firstName}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Typography>Last name</Typography>
                  <Input
                    style={{ marginLeft: 4 }}
                    name="lastName"
                    onChange={handleSignupInputChange}
                    value={signupInputs.lastName}
                    placeholder="Last name"
                  />
                </div>
              </FlexBox>
              {signupErrors.name ? <Message type="error" message={signupErrors.name} /> : null}
            </TextForm> */}
          <TextForm>
            <Typography>Email</Typography>
            <Input
              type="email"
              name="email"
              onChange={handleSignupInputChange}
              value={signupInputs.email}
              placeholder="Email"
            />
            {signupErrors.email ? (
              <Message type="error" message={signupErrors.email} />
            ) : null}
          </TextForm>
          <TextForm>
            <Typography>Password</Typography>
            <Input
              type="password"
              name="password"
              onChange={handleSignupInputChange}
              value={signupInputs.password}
              placeholder="Password"
            />
          </TextForm>
          <TextForm>
            <Typography>Confirm Password</Typography>
            <Input
              type="password"
              name="passwordConfirm"
              onChange={handleSignupInputChange}
              value={signupInputs.passwordConfirm}
              placeholder="Confirm password"
            />
            {signupErrors.password ? (
              <Message type="error" message={signupErrors.password} />
            ) : null}
          </TextForm>
          <TextForm>
            <Checkbox>Remember me</Checkbox>
          </TextForm>
          <br></br>
          <SubmitBox>
            {signupError ? (
              <Message type="error" message={signupError} />
            ) : null}
            <Button htmlType="submit" type="primary" loading={signupLoading}>
              Sign up
            </Button>
          </SubmitBox>
        </FormBox>
      ) : (
        <Button
          htmlType="button"
          type="primary"
          onClick={() => setSlide(SLIDE.WEB2)}
        >
          Sign up with email
        </Button>
      )}
    </Container>
  )
}

export { SignUp }
