import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Typography, Input, Message } from 'src/components/kit'
import { forgotPasswordApiAction } from 'src/store/actionCreators'
import { useDispatch, useSelector } from 'react-redux'
import { forgotValidator } from 'src/validators/loginValidator'
import { AppState } from 'src/store/store'

const Container = styled.div`
  width: 350px;
  padding: 2em;
`

const FormBox = styled.form`
  padding: 1em 0em;
  max-width: 300px;
`

const TextForm = styled.div`
  padding: 0.2em 0em;
`

const SubmitBox = styled.div`
  padding-top: 1em;
`

const useForgotForm = () => {
  const [forgotInputs, setForgotInputs] = useState({
    email: ''
  })

  const handleForgotInputChange = (event: any) => {
    event.persist()
    setForgotInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }))
  }

  return {
    forgotInputs,
    handleForgotInputChange,
    setForgotInputs
  }
}

const ForgotPassword: React.FC = () => {
  const {
    forgotInputs,
    setForgotInputs,
    handleForgotInputChange
  } = useForgotForm()
  const [forgotErrors, setForgotErrors] = useState({ email: '' })
  const dispatch = useDispatch()
  const { forgotPasswordLoading } = useSelector((state: AppState) => state.auth)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const onForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { errors, isValid } = forgotValidator(forgotInputs)
    if (!isValid) {
      return setForgotErrors(errors)
    }
    setMessage(null)
    setForgotErrors({ email: '' })

    const onSuccess = () => {
      setMessage({
        type: 'success',
        message: 'Please check your email for reset link'
      })
      setForgotInputs({ email: '' })
    }
    const onFail = (errorMessage: string) => {
      setMessage({
        type: 'error',
        message: errorMessage
      })
    }
    dispatch(forgotPasswordApiAction(forgotInputs.email, onSuccess, onFail))
  }

  return (
    <Container>
      <FormBox onSubmit={onForgotSubmit}>
        <TextForm>
          <Typography>Email</Typography>
          <Input
            placeholder="Email"
            name="email"
            value={forgotInputs.email}
            onChange={handleForgotInputChange}
          />
          {forgotErrors.email ? (
            <Message type="error" message={forgotErrors.email} />
          ) : null}
        </TextForm>
        <SubmitBox>
          <Button
            htmlType="submit"
            type="primary"
            loading={forgotPasswordLoading}
          >
            Reset password
          </Button>
        </SubmitBox>
        {message ? (
          <Message type={message.type} message={message.message} />
        ) : null}
      </FormBox>
    </Container>
  )
}

export { ForgotPassword }
