import React from 'react'
import styled from 'styled-components'
import logo from 'src/assets/images/chainsafe_logo.png'
import { Typography } from 'src/components/kit'
import { NavLink } from 'react-router-dom'

const Logo = styled.img`
  height: 72px;
  width: auto;
  margin: 0.5em 1em 1em 0em;
`

const LogoContainer = styled.div`
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

const LogoBox: React.FC = () => {
  return (
    <NavLink to="/">
      <LogoContainer>
        <Logo src={logo} alt="Chainsafe files" />
        <Typography.Title level={2}>ChainSafe Files</Typography.Title>
        <BetaText>Alpha</BetaText>
      </LogoContainer>
    </NavLink>
  )
}

export { LogoBox }
