import React from 'react'
import styled from 'styled-components'
import { Empty, Typography } from 'src/components/kit'
import { INotification } from 'src/types/fps'
import { Notification } from './Notification'

const Container = styled.div`
  width: 300px;
  background: white;
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.greyLight};
`

const ScrollBox = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  max-height: 450px;
`

const Title = styled(Typography)`
  color: ${({ theme }) => theme.colors.writing};
  font-size: 0.875em;
  font-weight: bold;
  padding: 0.25em 0em 0.25em 1em;
`

const TitleBox = styled(Typography)`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.greyLight};
`

interface IProps {
  notifications: INotification[]
}

const NotificationBox: React.FC<IProps> = ({ notifications }) => {
  return (
    <Container>
      <TitleBox>
        <Title>Notifications</Title>
      </TitleBox>
      <ScrollBox>
        {notifications.length ? (
          notifications.map((notification, index) => (
            <Notification
              key={index}
              title={notification.filename || notification.cid}
              description={notification.message}
            />
          ))
        ) : (
          <Empty
            style={{ padding: '3em' }}
            imageStyle={{ height: 60 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
          />
        )}
      </ScrollBox>
    </Container>
  )
}

export { NotificationBox }
