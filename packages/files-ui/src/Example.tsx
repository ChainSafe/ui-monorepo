import React from 'react'
import { Components, Theme } from '@chainsafe/common-ui'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: 1em;
  text-align: center;
`

const { Button } = Components
const { createTheme, ThemeProvider, darkPalette, lightPalette } = Theme

function Example() {
  const customTheme = {
    palette: {
      primary: 'yellow',
      secondary: 'black'
    }
  }

  const lightTheme = {
    palette: lightPalette
  }

  const darkTheme = {
    palette: darkPalette
  }

  const [theme, setTheme] = React.useState(createTheme())

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Button>Kit</Button>
        <button onClick={() => setTheme(lightTheme)}>light</button>
        <button onClick={() => setTheme(darkTheme)}>dark</button>
        <button onClick={() => setTheme(customTheme)}>custom</button>
      </Container>
    </ThemeProvider>
  )
}

export default Example
