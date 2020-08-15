import React from 'react'
import { Button } from '@chainsafe/common-components'
// import styled from 'styled-components'
import { ThemeProvider as ProjectThemeProvider } from 'styled-components'
import { Theme } from '@chainsafe/common-themes'

const { styled } = Theme

const Container = styled.div`
  width: 100%;
  padding: 1em;
  text-align: center;
`

function Example() {
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
      {/* <ProjectThemeProvider theme={theme}> */}

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
      {/* </ProjectThemeProvider> */}
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
