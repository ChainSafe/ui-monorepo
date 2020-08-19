import React from "react"
import { Route, Redirect } from "react-router-dom"

interface IProps {
  component: React.ReactType
  isAuthorized: boolean
  path: string
  redirectPath?: string
  exact?: boolean
}

const ConditionalRoute: React.FC<IProps> = ({
  component: Component,
  isAuthorized,
  redirectPath = "/403",
  path,
  exact,
  ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    render={() => {
      return isAuthorized ? (
        <Component {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: `${redirectPath}`,
            state: { from: path },
          }}
        />
      )
    }}
  />
)

export default ConditionalRoute
