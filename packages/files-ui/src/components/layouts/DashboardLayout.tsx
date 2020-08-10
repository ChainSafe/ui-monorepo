import React from 'react'
import { Navbar } from 'src/components/organisms/navbar/Navbar'
import { Sidebar } from 'src/components/organisms/sidebar/Sidebar'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`

const BodyContainer = styled.div`
  margin: 0 4em;
  display: flex;
  flex-flow: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin-left: 225px;
  padding-left: 3em;
`

const LimitContainer = styled.div`
  max-width: 1000px;
  width: 100%;
`

interface IProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<IProps> = props => {
  const { children } = props
  return (
    <Container>
      <Sidebar />
      <BodyContainer>
        <LimitContainer>
          <Navbar />
          {children}
        </LimitContainer>
      </BodyContainer>
    </Container>
  )
}

export { DashboardLayout }
