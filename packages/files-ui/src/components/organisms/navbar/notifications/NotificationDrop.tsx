import React, { useEffect } from 'react'
import { Dropdown, Badge } from 'src/components/kit'
import { BellOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getFpsNotificationApiAction } from 'src/store/actionCreators'
import { NotificationBox } from './NotificationBox'
import { AppState } from 'src/store/store'

const Container = styled.div`
  padding: 0em 1.2em;
`

const BellIcon = styled(BellOutlined)`
  font-size: 1.2em;
`

const NotificationsComponent = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state: AppState) => state.fps)

  useEffect(() => {
    dispatch(getFpsNotificationApiAction())
    const pollStatus = setInterval(async () => {
      dispatch(getFpsNotificationApiAction())
    }, 5000)

    return () => {
      clearInterval(pollStatus)
    }
  }, [dispatch])

  return (
    <Container>
      <Dropdown
        overlay={<NotificationBox notifications={notifications} />}
        trigger={['click']}
        placement="bottomRight"
      >
        <span style={{ cursor: 'pointer' }}>
          <Badge dot={notifications.length > 0}>
            <BellIcon />
          </Badge>
        </span>
      </Dropdown>
    </Container>
  )
}

export { NotificationsComponent }
