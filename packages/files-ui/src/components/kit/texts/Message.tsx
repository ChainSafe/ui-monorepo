import React from 'react'
import styled from 'styled-components'

interface IMyProps {
  type: 'error' | 'success' | 'info'
  message?: string
  className?: string
}

const Error = styled.p`
  margin-bottom: 0.2em;
  font-size: 0.9em;
  color: red;
`

const Success = styled.p`
  margin-bottom: 0.2em;
  font-size: 0.875em;
  color: green;
`

const Info = styled.p`
  font-size: 0.875em;
  margin-bottom: 0.2em;
`

const Message: React.FC<IMyProps> = props => {
  const { type, message, className } = props

  return type === 'error' ? (
    <Error className={className}>{message}</Error>
  ) : type === 'success' ? (
    <Success className={className}>{message}</Success>
  ) : type === 'info' ? (
    <Info className={className}>{message}</Info>
  ) : null
}

export { Message }
