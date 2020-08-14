import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.palette.brand.background};
  color: ${({ theme }) => theme.palette.brand.main};
  padding: 1em;
`

const Button: React.FC = props => {
  return <StyledButton>{props.children}</StyledButton>
}

export default Button
