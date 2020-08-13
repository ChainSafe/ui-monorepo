import React from 'react'
import styled from 'styled-components'
// import { Input, Menu, Dropdown } from "src/components/kit";
import { Menu, Dropdown } from 'src/components/kit'
import { DownOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import { logoutAndReset } from 'src/store/actionCreators'
import { NavLink } from 'react-router-dom'
import { useWalletAugmented } from 'src/HOCs/ConfiguredWalletProvider/ConfiguredWalletProvider'
import { customEllipsis } from 'src/util/helpers'
import { NotificationsComponent } from './notifications/NotificationDrop'

const Container = styled.div`
  height: 6em;
  padding: 1.8em 0em;
  display: flex;
  width: 100%;
`

const FlexGrow = styled.div`
  flex: 1;
`

// const { Search } = Input;

const Navbar: React.FC = () => {
  const { profile } = useSelector((state: AppState) => state.auth)
  const dispatch = useDispatch()

  const { account, deactivate } = useWalletAugmented()

  const menu = (
    <Menu>
      <Menu.Item>
        <NavLink to="/account">Account</NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/billing">Billing</NavLink>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          if (account && account !== '') {
            deactivate()
          }
          dispatch(logoutAndReset())
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Container>
      {/* <Search
        placeholder="Search your files"
        style={{ width: 500 }}
      /> */}
      {/* TODO: remove element used in place of styling */}
      <FlexGrow />
      <NotificationsComponent />
      {profile && (
        <Dropdown overlay={menu} trigger={['click']}>
          <span style={{ cursor: 'pointer' }}>
            {profile.firstName
              ? profile.firstName
              : profile.address
              ? customEllipsis(profile.address, 4)
              : profile.email
              ? profile.email
              : ''}{' '}
            <DownOutlined />
          </span>
        </Dropdown>
      )}
    </Container>
  )
}

export { Navbar }
