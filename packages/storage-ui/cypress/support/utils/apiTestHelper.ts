import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"

const REFRESH_TOKEN_KEY = "csf.refreshToken"

export const apiTestHelper = {
  clearPins(apiUrlBase: string) {
    const axiosInstance = axios.create({
      // Disable the internal Axios JSON de serialization as this is handled by the client
      transformResponse: []
    })
    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)
    cy.window().then((win) => {
      apiClient
        .getRefreshToken({
          refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || ""
        })
        .then((tokens) => {
          apiClient.setToken(tokens.access_token.token)
          apiClient.listPins(undefined, undefined, ["queued", "pinning", "pinned", "failed"])
            .then((pins) => pins.results?.forEach(ps => apiClient.deletePin(ps.requestid)))
        })
    })
  }
}
