import React from "react"
import { Route, Redirect, useLocation } from "react-router-dom"

interface IConditionalRouteProps {
  component: React.ElementType
  isAuthorized?: boolean
  path: string
  // The path the user should be redirected to if the condition is not met
  redirectPath: string
  // This flag will ignore the redirect path and redirect the user to where they were originally going
  redirectToSource?: boolean
  exact?: boolean
}

const ConditionalRoute: React.FC<IConditionalRouteProps> = ({
  component: Component,
  isAuthorized,
  redirectPath,
  redirectToSource,
  path,
  exact,
  ...rest
}) => {
  const { state, pathname } = useLocation<{from?: string} | undefined>()
  const from = (state as any)?.from

  return <Route
    path={path}
    exact={exact}
    render={() => {
      return isAuthorized === true ? (
        <Component {...rest} />
      ) : isAuthorized === false ? (
        <Redirect
          to={{
            pathname: redirectToSource && from ? from : redirectPath,
            state: { from: pathname }
          }}
        />
      ) : // this may be converted into loading
        null
    }}
  />
}

export default ConditionalRoute
