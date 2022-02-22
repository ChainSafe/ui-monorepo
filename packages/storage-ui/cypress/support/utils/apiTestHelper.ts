import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"

const REFRESH_TOKEN_KEY = "css.refreshToken"
const API_BASE_URL = "https://stage.imploy.site/api/v1"

const getApiClient = () => {
  // Disable the internal Axios JSON deserialization as this is handled by the client
  const axiosInstance = axios.create({ transformResponse: [] })
  const apiClient = new FilesApiClient({}, API_BASE_URL, axiosInstance)

  return apiClient
}

export const apiTestHelper = {
  clearPins() {
    const apiClient = getApiClient()

    cy.window().then((win) => {
      apiClient
        .getRefreshToken({
          refresh: win.localStorage.getItem(REFRESH_TOKEN_KEY) || ""
        })
        .then((tokens) => {
          apiClient.setToken(tokens.access_token.token)
          apiClient.listPins(undefined, undefined, ["queued", "pinning", "pinned", "failed"])
            .then((pins) =>
              pins.results?.forEach(ps => apiClient.deletePin(ps.requestid)
              ))
        })
    })
  },
  deleteBuckets(type: BucketType | BucketType[]) {
    const apiClient = getApiClient()
    const typeToDelete = Array.isArray(type) ? type : [type]

    return new Cypress.Promise(async (resolve) => {
      cy.window()
        .then(async (win) => {
          const tokens = await apiClient.getRefreshToken({ refresh: win.localStorage.getItem(REFRESH_TOKEN_KEY) || "" })

          await apiClient.setToken(tokens.access_token.token)
          const buckets = await apiClient.listBuckets(typeToDelete)
          buckets.forEach(async (bucket) => {
            cy.log(`Deleting fps bucket: "${bucket.name}""`)
            await apiClient.removeBucket(bucket.id)
          })
          cy.log("Done deleting fps buckets.")
          resolve()
        })
    })
  }
}
