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
  const customTheme: Theme.IThemeInput = {
    palette: {
      brand: {
        ...lightPalette.brand,
        background: 'yellow'
      }
    }
  }

  const lightTheme = {
    palette: lightPalette
  }

  const darkTheme = {
    palette: darkPalette
  }

  const [theme, setTheme] = React.useState<Theme.ITheme>(createTheme())

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Button>Kit</Button>
        <button onClick={() => setTheme(lightTheme)}>light</button>
        <button onClick={() => setTheme(darkTheme)}>dark</button>
        <button onClick={() => setTheme(createTheme(customTheme))}>
          custom
        </button>
      </Container>
    </ThemeProvider>
  )
}

export default Example
