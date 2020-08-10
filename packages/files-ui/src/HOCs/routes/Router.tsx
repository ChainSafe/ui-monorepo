import React, { useEffect } from 'react'
import { NotFound } from 'src/components/organisms/notFound/NotFound'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AppState } from 'src/store/store'
import { getProfileInitApiAction } from 'src/store/actionCreators'
import { useSelector, useDispatch } from 'react-redux'
import { LandingPage } from 'src/components/pages/landing/Landing'
import { AccountPage } from 'src/components/pages/account/Account'
import { BillingPage } from 'src/components/pages/billing/Billing'
// import { FpsPage } from "src/components/pages/fps/fpsPage";
import { EmailVerify } from 'src/components/pages/emailVerification/EmailVerification'
import { ResetPassword } from 'src/components/pages/resetPassword/ResetPassword'
import { DashboardLayout } from 'src/components/layouts/DashboardLayout'
import {
  HOME_ROUTE,
  ACCOUNT_ROUTE,
  BILLING_ROUTE,
  EMAIL_VERIFY_ROUTE,
  RESET_PASSWORD_ROUTE
} from './routes'
import { PrivateRoute } from './PrivateRoute'

const RouterComp: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: AppState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileInitApiAction(true))
    }
  }, [dispatch, isAuthenticated])

  return (
    <Router>
      <Switch>
        <Route exact={true} path={HOME_ROUTE} component={LandingPage} />
        <Route
          exact={true}
          path={RESET_PASSWORD_ROUTE}
          component={ResetPassword}
        />
        <PrivateRoute
          exact={true}
          path={ACCOUNT_ROUTE}
          component={AccountPage}
          layout={DashboardLayout}
        />
        <PrivateRoute
          exact={true}
          path={BILLING_ROUTE}
          component={BillingPage}
          layout={DashboardLayout}
        />
        {/* <PrivateRoute exact={true} path={FPS_ROUTE}
          component={FpsPage} layout={DashboardLayout}
        /> */}
        <Route exact={true} path={EMAIL_VERIFY_ROUTE}>
          <EmailVerify />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}

export default RouterComp
