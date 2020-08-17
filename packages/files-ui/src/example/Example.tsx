import React from 'react'
import { Button } from '@chainsafe/common-components'
import {
  createTheme,
  ThemeProvider,
  darkPalette,
  lightPalette,
  GlobalStyles,
  styled,
  IThemeInput,
  ITheme
} from '@chainsafe/common-themes'

const Container = styled.div`
  width: 100%;
  padding: 1em;
  text-align: center;
`

function Example() {
  const customTheme: IThemeInput = {
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

  const [theme, setTheme] = React.useState<ITheme>(createTheme())

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
      <ExampleChild />
    </ThemeProvider>
  )
}

const ChildContainer = styled.div`
  height: 100px;
  width: 100px;
  background-color: ${({ theme }) => theme.palette.brand.background};
`

function ExampleChild() {
  return <ChildContainer>Example child</ChildContainer>
}

export default Example
