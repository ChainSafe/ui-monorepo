import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.secondary};
  padding: 1em;
`

const Button: React.FC = props => {
  return <StyledButton>{props.children}</StyledButton>
}

export { Button }
