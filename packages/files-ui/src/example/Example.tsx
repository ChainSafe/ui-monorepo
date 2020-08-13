import React from 'react'
import { Components, Theme } from '@chainsafe/common-ui'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: 1em;
  text-align: center;
`

function Example() {
  const { Button } = Components
  const {
    createTheme,
    ThemeProvider,
    darkPalette,
    lightPalette,
    GlobalStyles
  } = Theme

  const customTheme: Theme.IThemeInput = {
    palette: {
      brand: {
        ...lightPalette.brand,
        background: 'yellow'
      }
    }
  }

  const lightTheme = {
    palette: lightPalette,
    typography: {
      body: 'PT Sans'
    }
  }

  const darkTheme = {
    palette: darkPalette,
    typography: {
      body: 'IBM Plex Mono'
    }
  }

  const [theme, setTheme] = React.useState<Theme.ITheme>(createTheme())

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        <Button>Kit</Button>
        <button onClick={() => setTheme(createTheme(lightTheme))}>light</button>
        <button onClick={() => setTheme(createTheme(darkTheme))}>dark</button>
        <button onClick={() => setTheme(createTheme(customTheme))}>
          custom
        </button>
      </Container>
    </ThemeProvider>
  )
}

export default Example
