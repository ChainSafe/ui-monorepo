import React, { useState, Fragment, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import { IUser } from 'src/types'
import theme from 'src/assets/styles/theme.json'
import { Typography, Button, Input, Message } from 'src/components/kit'
import { SmileEmoji } from 'src/components/kit/icons/Emoji/smile.emoji'
import Validator from 'validator'
import { RocketEmoji } from 'src/components/kit/icons/Emoji/rocket.emoji'
import { updateProfileApiAction } from 'src/store/actionCreators'
import { useOnClickOutside } from 'src/util/hooks/useOnClickOutside'

const Root = styled.article`
  position: fixed;
  padding: 32px;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
  width: 500px;
  max-width: 80vw;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  background-color: ${theme.colors.backgroundColor};
  &.hidden {
    display: none;
  }
  & h3 {
    margin-bottom: 24px;
  }
  & .centered {
    text-align: center;
  }
`

const InputZone = styled.section`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  & input {
    width: 300px;
  }
`

enum SLIDE {
  REQUEST = 'REQUEST',
  VERIFY = 'VERIFY',
  HIDE = 'HIDE'
}

export const EmailRequestModule: React.FC = () => {
  // TODO: Profile update clears profile data on error
  const profile: IUser | null = useSelector(
    (state: AppState) => state.auth.profile
  )

  const [newEmail, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [slide, setSlide] = useState<SLIDE>(SLIDE.REQUEST)

  useEffect(() => {
    if (profile?.email === '') {
      setSlide(SLIDE.REQUEST)
    } else {
      setSlide(SLIDE.HIDE)
    }
  }, [profile])

  const dispatch = useDispatch()
  const handleSettingEmail = () => {
    if (profile) {
      dispatch(
        updateProfileApiAction(profile.firstName, profile.lastName, newEmail)
      )
      setSlide(SLIDE.VERIFY)
    }
  }

  // Checks if the email was set ever and if its been 10 min since the account was created
  const displayScreen: boolean = useMemo(
    () =>
      profile?.email === '' &&
      new Date(profile.emailChanged) < new Date(profile.joinedDate) &&
      new Date() <
        new Date(new Date(profile.joinedDate).getTime() + 10 * 60000),
    [profile]
  )
  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    setSlide(SLIDE.HIDE)
  })

  return displayScreen ? (
    <Root ref={ref} className={slide === SLIDE.HIDE ? 'hidden' : ''}>
      {slide === SLIDE.REQUEST ? (
        <Fragment>
          <Typography.Title level={3}>
            Hey there, welcome to Files! <SmileEmoji />
          </Typography.Title>
          <Typography.Paragraph>
            Providing us with your email is never a requirement, but it helps us
            keep you updated on the files you’ve stored. You can remove your
            email at any time in Settings.
          </Typography.Paragraph>
          <InputZone>
            <Input
              placeholder="Email"
              name="email"
              value={newEmail}
              onChange={(e: any) => {
                setEmail(e.target.value)
                if (Validator.isEmpty(e.target.value)) {
                  setError('Email is required')
                } else if (!Validator.isEmail(e.target.value)) {
                  setError('Email is invalid')
                } else {
                  setError('')
                }
              }}
            />
            <Button
              type="primary"
              onClick={() => handleSettingEmail()}
              disabled={!(error === '' && newEmail !== '')}
            >
              Connect Email
            </Button>
          </InputZone>
          {error ? <Message type="error" message={error} /> : null}
          <Button onClick={() => setSlide(SLIDE.HIDE)} type="primary">
            Maybe later
          </Button>
        </Fragment>
      ) : (
        slide === SLIDE.VERIFY && (
          <Fragment>
            <Typography.Title className="centered" level={3}>
              Great! <RocketEmoji />
            </Typography.Title>
            <Typography.Paragraph className="centered">
              We’ve sent you an email to confirm if it’s really you.
            </Typography.Paragraph>
          </Fragment>
        )
      )}
    </Root>
  ) : (
    <></>
  )
}
