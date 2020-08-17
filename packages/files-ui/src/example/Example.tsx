import React from 'react'
import {
  Button,
  Router,
  Switch,
  Route,
  Link,
  ConditionalRoute,
  useHistory
} from '@chainsafe/common-components'
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

function ExampleRouter() {
  return <Router>{<ExampleChildRoutes />}</Router>
}

function ExampleChildRoutes() {
  const { redirect } = useHistory()

  const Links = (
    <>
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/about">about</Link>
      <br />
      <Link to="/dashboard">Dashboard private dashboard 403</Link>
      <br />
      <Link to="/account">Account private dashboard 401</Link>
      <br />
      <br />

      <button onClick={() => redirect('/home')}>
        check redirect on click - home
      </button>
    </>
  )

  return (
    <Switch>
      <Route
        path="/home"
        exact={true}
        component={() => <div>Home {Links}</div>}
      />

      <Route
        path="/about"
        exact={true}
        component={() => <div>About {Links}</div>}
      />

      <ConditionalRoute
        path="/dashboard"
        exact={true}
        isAuthorized={false}
        component={() => <div>dashboard {Links}</div>}
      />

      <ConditionalRoute
        path="/account"
        redirectPath="/401"
        exact={true}
        isAuthorized={false}
        component={() => <div>dashboard {Links}</div>}
      />

      <Route path="*">
        not found
        {Links}
      </Route>
    </Switch>
  )
}

export { Example, ExampleRouter }
