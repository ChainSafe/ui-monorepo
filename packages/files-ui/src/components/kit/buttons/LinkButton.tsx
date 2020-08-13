import React from 'react'
import styled from 'styled-components'

const MyLinkButton = styled.button`
  padding: 0px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  border: none;
  font-size: 0.875em;
  cursor: pointer;
  outline: none;
`

interface IProps {
  onClick?: () => void
  htmlType?: 'submit' | 'button'
}

const LinkButton: React.FC<IProps> = props => {
  return (
    <MyLinkButton onClick={props.onClick} type={props.htmlType || 'button'}>
      {props.children}
    </MyLinkButton>
  )
}

export { LinkButton }
