import React, { useState, useEffect } from 'react'
import { Typography, Input, Button, Message } from 'src/components/kit'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import theme from 'src/assets/styles/theme.json'
import copy from 'copy-to-clipboard'
import { CopyIcon } from 'src/components/kit/icons/copy.icon'
import {
  updateProfileApiAction,
  changePasswordApiAction,
  getDriveInfoApiAction
} from 'src/store/actionCreators'
import { customEllipsis } from 'src/util/helpers'

type CopyButtonProps = {
  pingActive: boolean
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 6em;
`

const ParentContainer = styled.div`
  width: 700px;
`

const ProfileFormContainer = styled.form`
  margin: 3em 0em;
  width: 500px;
`

const PasswordFormContainer = styled.form`
  margin: 3em 0em;
  width: 500px;
`

const KeyContainer = styled.div`
  margin: 3em 0em;
  width: 500px;
`

const NamesBox = styled.div`
  display: flex;
`

const RightSpaceBox = styled.div`
  margin-right: 8px;
  width: 100%;
`

const LeftSpaceBox = styled.div`
  margin-left: 8px;
  width: 100%;
`

const PaddedBox = styled.div`
  padding: 1.5em 0em;
`

const PasswordsBox = styled.div`
  padding: 1em 0em 1.5em 0;
`

const InputGroup = styled.div`
  padding: 0.3em 0em;
`

const EmailBox = styled.div`
  padding: 0.3em 0em;
`

const CopyButton = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  margin: 13px 0;
  border: 1px solid
    ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.grey7};
  padding: 5px 12px;
  transition-duration: 200ms;
  & > * {
    color: ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.grey7} !important;
  }
  & svg {
    height: 20px;
    width: 20px;
    fill: ${({ pingActive }: CopyButtonProps) =>
      pingActive ? theme.colors.green6 : theme.colors.primary};
    transition-duration: 200ms;
  }
`

const Account: React.FC = () => {
  const { auth, drive } = useSelector((state: AppState) => state)

  const { profile, profileUpdating, changingPassword } = auth
  const { apiKey } = drive

  const dispatch = useDispatch()

  const [myProfile, setMyProfile] = useState({
    firstName: profile ? profile.firstName : '',
    lastName: profile ? profile.lastName : '',
    email: profile ? profile.email : ''
  })

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  })

  const [updateProfileError, setUpdateProfileError] = useState('')
  const [updatePasswordError, setUpdatePasswordError] = useState('')

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setMyProfile(profileState => ({
      ...profileState,
      [e.target.name]: e.target.value
    }))
  }

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    // first name and last name not made mandatory for now

    // if (!myProfile.firstName || !myProfile.lastName) {
    //   setUpdateProfileError("First name and last name are required");
    //   return;
    // }
    setUpdateProfileError('')
    dispatch(
      updateProfileApiAction(
        myProfile.firstName,
        myProfile.lastName,
        myProfile.email
      )
    )
  }

  const onChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.newPasswordConfirm
    ) {
      setUpdatePasswordError('Please fill up all passwords')
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
    setUpdatePasswordError('')

    const onSuccess = () => {
      setPasswords({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      })
    }

    dispatch(
      changePasswordApiAction(
        passwords.oldPassword,
        passwords.newPassword,
        passwords.newPasswordConfirm,
        onSuccess
      )
    )
  }

  const [copyActive, setCopyActive] = useState<boolean>(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setCopyActive(false), 500)
    return () => {
      clearTimeout(timer1)
    }
  }, [copyActive])

  useEffect(() => {
    dispatch(getDriveInfoApiAction())
  }, [dispatch])

  const copyToClipboard = () => {
    copy(apiKey)
    setCopyActive(true)
  }

  return (
    <Container>
      <ParentContainer>
        <Typography.Title level={2}>Account</Typography.Title>
        <ProfileFormContainer onSubmit={onSaveProfile}>
          <Typography.Title level={3}>Profile</Typography.Title>
          <PaddedBox>
            <NamesBox>
              <RightSpaceBox>
                <Typography>First name</Typography>
                <Input
                  placeholder="First name"
                  name="firstName"
                  value={myProfile.firstName}
                  onChange={handleChangeProfile}
                />
              </RightSpaceBox>
              <LeftSpaceBox>
                <Typography>Last name</Typography>
                <Input
                  placeholder="Last name"
                  name="lastName"
                  value={myProfile.lastName}
                  onChange={handleChangeProfile}
                />
              </LeftSpaceBox>
            </NamesBox>
            <EmailBox>
              <Typography>Email</Typography>
              <Input
                placeholder="Email"
                name="email"
                // disabled={true}
                value={myProfile.email}
                onChange={handleChangeProfile}
              />
            </EmailBox>
            {updateProfileError && (
              <Message type="error" message={updateProfileError} />
            )}
          </PaddedBox>
          <Button htmlType="submit" loading={profileUpdating}>
            Save profile
          </Button>
        </ProfileFormContainer>
        <PasswordFormContainer onSubmit={onChangePassword}>
          <Typography.Title level={3}>Change password</Typography.Title>
          <PasswordsBox>
            <InputGroup>
              <Typography>Old password</Typography>
              <Input.Password
                placeholder="Old password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleChangePassword}
              />
            </InputGroup>
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
          <Button htmlType="submit" loading={changingPassword}>
            Change password
          </Button>
        </PasswordFormContainer>
        {apiKey ? (
          <KeyContainer>
            <Typography.Title level={3}>API key</Typography.Title>
            <InputGroup>
              <CopyButton
                pingActive={copyActive}
                onClick={() => copyToClipboard()}
              >
                <Typography>{customEllipsis(apiKey, 30)}</Typography>
                <CopyIcon />
              </CopyButton>
            </InputGroup>
          </KeyContainer>
        ) : null}
      </ParentContainer>
    </Container>
  )
}

export { Account }
