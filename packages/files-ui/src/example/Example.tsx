import React from 'react'
import {
  Router,
  Switch,
  Route,
  Link,
  ConditionalRoute,
  useHistory
} from '@chainsafe/common-components'

function Example() {
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

export { Example }
