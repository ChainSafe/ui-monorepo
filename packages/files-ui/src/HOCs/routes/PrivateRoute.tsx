import React, { ReactType } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from 'src/store/store'

interface IProps {
  component: ReactType
  layout?: ReactType
  exact: boolean
  path: string
}

const PrivateRoute: React.FC<IProps> = ({
  component: Component,
  layout: Layout,
  path,
  ...rest
}) => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth)

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated === null ? null : isAuthenticated === true ? (
          // {Component}
          Layout ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/',
              search: `?redirect=${path}`,
              state: { from: path }
            }}
          />
        )
      }
    />
  )
}

export { PrivateRoute }
