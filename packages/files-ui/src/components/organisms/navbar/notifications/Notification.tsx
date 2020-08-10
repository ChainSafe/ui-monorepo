import React from 'react'
import { Typography } from 'src/components/kit'
import styled from 'styled-components'

const Container = styled.div`
  padding: 0.75em 1em;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.greyLight};
`

const Title = styled(Typography)`
  color: ${({ theme }) => theme.colors.writing};
  font-size: 0.75em;
  font-weight: bold;
`

const Caption = styled(Typography)`
  color: ${({ theme }) => theme.colors.greyLight};
  font-size: 0.75em;
`

interface IProps {
  title: string
  description: string
}

const Notification: React.FC<IProps> = props => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <Caption>{props.description}</Caption>
    </Container>
  )
}

export { Notification }
