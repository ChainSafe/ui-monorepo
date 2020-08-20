import {
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from "react-router-dom"

function useHistoryFunctions() {
  const history = useHistory()

  const redirect = (route: string) => {
    history.push(route)
  }

  return { history, redirect }
}

export { useParams, useRouteMatch, useLocation, useHistoryFunctions }
