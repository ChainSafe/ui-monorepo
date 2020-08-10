import React, { useState } from 'react'
import styled from 'styled-components'
import logoImg from 'src/assets/images/chainsafe_logo.png'
import { Link } from 'react-router-dom'
import { Menu } from 'src/components/kit'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router'
// import {
//   DeleteOutlined, DatabaseOutlined, StarOutlined, SettingOutlined, InfoCircleOutlined
// } from "@ant-design/icons";

import { DatabaseOutlined } from '@ant-design/icons'

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  min-width: 225px;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.colors.greyBackground};
  overflow: hidden;

  .ant-menu-item {
    padding-left: 32px;
  }
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 1em 0em 1em 2em;
  cursor: pointer;
`

const MenuBox = styled.div`
  margin-top: 5em;
`

const Logo = styled.img`
  display: flex;
  width: 50px;
  height: auto;
  margin-right: 0.5em;
`

const LogoText = styled.p`
  color: ${({ theme }) => theme.colors.writingTitle};
  font-size: 1.2em;
  margin: 0;
`

const BetaText = styled.p`
  color: ${({ theme }) => theme.colors.writingTitle};
  font-size: 0.75em;
  margin-left: 0.5em;
  margin-top: 0px;
`

const MenuItem = styled(Menu.Item)`
  padding-left: 32px;
`

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { pathname } = location
  const pathSlugs = pathname.split('/')
  const slug1 = pathSlugs[1]

  const selectedKeysInit = []
  if (!slug1) {
    selectedKeysInit.push('fps')
  }
  // else {
  //   if (slug1 === "fps") {
  //     selectedKeysInit.push("fps");
  //   }
  // }

  const [selectedKeys] = useState(selectedKeysInit)

  return (
    <Container>
      <Link to="/">
        <LogoBox>
          <Logo src={logoImg} alt="Chainsafe" />
          <LogoText>Files</LogoText>
          <BetaText>Alpha</BetaText>
        </LogoBox>
      </Link>
      <MenuBox>
        <Menu selectedKeys={selectedKeys}>
          {/* <MenuItem key="home" >
            <NavLink to="/">
              <DatabaseOutlined />
              Home
            </NavLink>
          </MenuItem> */}
          <MenuItem key="fps">
            <NavLink to="/">
              <DatabaseOutlined />
              FPS
            </NavLink>
          </MenuItem>
          {/* <MenuItem>
            <StarOutlined />
            Starred
          </MenuItem > */}
          {/* <MenuItem>
            <SettingOutlined />
            Settings
          </MenuItem>
          <MenuItem>
            <InfoCircleOutlined />
            Support
          </MenuItem>
          <MenuItem>
            <DeleteOutlined />
            Trash
          </MenuItem> */}
        </Menu>
      </MenuBox>
    </Container>
  )
}

export { Sidebar }
