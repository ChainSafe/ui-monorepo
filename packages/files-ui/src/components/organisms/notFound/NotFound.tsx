import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10vh;
  flex-flow: column;
  align-items: center;
`

const NotFound: React.FC = () => {
  return (
    <Container>
      <i className="fa fa-hourglass-start" />
      <h4>404</h4>
      <h5>Page not found</h5>
    </Container>
  )
}

export { NotFound }
