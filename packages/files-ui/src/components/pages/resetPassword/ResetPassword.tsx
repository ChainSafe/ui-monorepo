import React, { useState } from 'react'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Message, Input, Typography } from 'src/components/kit'
import { AppState } from 'src/store/store'
import { resetPasswordApiAction } from 'src/store/actionCreators'
import { LogoBox } from 'src/components/organisms/navbar/LogoBox'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5vh;
  flex-flow: column;
  align-items: center;
`

const MessageSpaced = styled(Message)`
  margin: 16px 0;
  font-size: 1.2em;
`

const PasswordFormContainer = styled.form`
  margin: 3em 0em;
  width: 500px;
`

const PasswordsBox = styled.div`
  padding: 1em 0em 1.5em 0;
`

const InputGroup = styled.div`
  padding: 0.3em 0em;
`

const ResetPassword: React.FC = () => {
  const { userId, token } = useParams()
  const { resetPasswordLoading } = useSelector((state: AppState) => state.auth)
  const dispatch = useDispatch()

  const [passwords, setPasswords] = useState({
    newPassword: '',
    newPasswordConfirm: ''
  })

  const [updatePasswordError, setUpdatePasswordError] = useState('')
  const [successReset, setSuccessReset] = useState(false)

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitReset = (event: React.FormEvent) => {
    event.preventDefault()
    if (!passwords.newPassword || !passwords.newPasswordConfirm) {
      setUpdatePasswordError('Please fill up passwords')
      return
    }
    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      setUpdatePasswordError('Passwords do not match')
      return
    }
    if (passwords.newPassword.length < 8) {
      setUpdatePasswordError('Passwords must be 8 characters')
      return
    }

    const userIdNum = parseInt(userId)
    if (isNaN(userIdNum)) {
      setUpdatePasswordError('User id is not valid')
      return
    }
    setUpdatePasswordError('')

    const onSuccess = () => {
      setSuccessReset(true)
      setPasswords({
        newPassword: '',
        newPasswordConfirm: ''
      })
    }

    const onFail = (errorMessage: string) => {
      setUpdatePasswordError(errorMessage)
    }

    dispatch(
      resetPasswordApiAction(
        userIdNum,
        token,
        passwords.newPassword,
        passwords.newPasswordConfirm,
        onSuccess,
        onFail
      )
    )
  }

  return (
    <Container>
      <LogoBox />
      <PasswordFormContainer onSubmit={onSubmitReset}>
        <Typography.Title level={3}>Reset password</Typography.Title>
        {successReset ? (
          <PasswordsBox>
            <MessageSpaced
              message="Password changed successfully"
              type="success"
            />
            <NavLink to="/">
              <Button>Login now</Button>
            </NavLink>
          </PasswordsBox>
        ) : (
          <>
            <PasswordsBox>
              <InputGroup>
                <Typography>New password</Typography>
                <Input.Password
                  placeholder="New password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChangePassword}
                />
              </InputGroup>
              <InputGroup>
                <Typography>Confirm new password</Typography>
                <Input.Password
                  placeholder="Confirm new password"
                  name="newPasswordConfirm"
                  value={passwords.newPasswordConfirm}
                  onChange={handleChangePassword}
                />
              </InputGroup>
              {updatePasswordError && (
                <Message type="error" message={updatePasswordError} />
              )}
            </PasswordsBox>
            <Button
              htmlType="submit"
              loading={resetPasswordLoading}
              type="primary"
            >
              Reset password
            </Button>
          </>
        )}
      </PasswordFormContainer>
    </Container>
  )
}

export { ResetPassword }
