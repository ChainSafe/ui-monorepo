import React, { ReactNode } from 'react'
import styled from 'styled-components'
import theme from 'src/assets/styles/theme.json'

const Root = styled.div`
  background-color: ${theme.colors.backgroundDark};
  transition-duration: 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border-radius: 3px;
  &.clickable {
    cursor: pointer;
  }
`

const Icon = styled.section`
  padding: 10px 0;
  height: 100px;
  display: flex;
  svg,
  img {
    max-height: 100%;
    margin: 0 auto;
    width: 80%;
    display: block;
  }
`

const Text = styled.section`
  color: ${theme.colors.writingLight};
  text-align: center;
`

interface IProps {
  icon: ReactNode
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const IconButton: React.FC<IProps> = ({
  children,
  className,
  icon,
  onClick
}) => {
  return (
    <Root
      className={`${className ? className : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick ? () => onClick() : undefined}
    >
      <Icon>{icon}</Icon>
      <Text>{children}</Text>
    </Root>
  )
}
