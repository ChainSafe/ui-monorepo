import React from "react"
import { Route, Redirect } from "react-router-dom"

interface IProps {
  component: React.ElementType
  isAuthorized: boolean | undefined
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
      return isAuthorized === true ? (
        <Component {...rest} />
      ) : isAuthorized === false ? (
        <Redirect
          to={{
            pathname: `${redirectPath}`,
            state: { from: path },
          }}
        />
      ) : null
    }}
  />
)

export default ConditionalRoute
