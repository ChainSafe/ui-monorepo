import React from 'react'
import { LoginAndSignup } from './loginAndSignup/LoginAndSignup'
import styled from 'styled-components'
import logo from 'src/assets/images/chainsafe_logo.png'
import LandingBulbs from 'src/assets/svgs/landingBulbs.svg'
import { Typography } from 'src/components/kit'

const Logo = styled.img`
  height: 72px;
  width: auto;
  margin: 0.5em 1em 1em 0em;
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
`

const BetaText = styled.p`
  color: ${({ theme }) => theme.colors.writingTitle};
  font-size: 1.2em;
  margin-left: 0.5em;
  margin-top: -12px;
`

const BulbBox = styled.div`
  height: 400px;
  width: auto;
  margin-right: 12px;
  svg,
  img {
    max-width: 100%;
    max-height: 100%;
  }
`

const MiddleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65vh;
`

const Container = styled.div`
  height: 100vh;
  width: 100%;
`

const LoginBox = styled.div`
  margin-left: 12px;
`

const Subtitle = styled(Typography)`
  font-size: 1.2em;
  text-align: center;
  padding: 0.5em 0 0.5em 0.5em;
`

const Landing: React.FC = () => {
  return (
    <Container>
      <LogoBox>
        <Logo src={logo} alt="Chainsafe files" />
        <Typography.Title level={2}>ChainSafe Files</Typography.Title>
        <BetaText>Alpha</BetaText>
      </LogoBox>
      <MiddleBox>
        <div>
          <BulbBox>
            <LandingBulbs />
          </BulbBox>
          <Subtitle>Making secure file storage easier than ever</Subtitle>
        </div>
        <LoginBox>
          <LoginAndSignup />
        </LoginBox>
      </MiddleBox>
    </Container>
  )
}

export { Landing }
