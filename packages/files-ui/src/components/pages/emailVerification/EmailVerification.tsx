import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Message } from 'src/components/kit'
import { AppState } from 'src/store/store'
import { verifyEmailApiAction } from 'src/store/actionCreators'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10vh;
  flex-flow: column;
  align-items: center;
`

const MessageSpaced = styled(Message)`
  margin: 4px 0;
  font-size: 1.2em;
`

const EmailVerify: React.FC = () => {
  const { userId, token } = useParams()
  const { verifyingEmail, verifyEmailError, emailJustVerified } = useSelector(
    (state: AppState) => state.auth
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(verifyEmailApiAction(userId, token))
  }, [userId, token, dispatch])

  return (
    <Container>
      {emailJustVerified === null ||
      verifyingEmail ? null : emailJustVerified === true ? (
        <MessageSpaced message="Email verification success" type="success" />
      ) : (
        <MessageSpaced message={verifyEmailError} type="error" />
      )}
      {verifyingEmail ? (
        'Loading...'
      ) : (
        <NavLink to="/">
          <Button>Go Home</Button>
        </NavLink>
      )}
    </Container>
  )
}

export { EmailVerify }
