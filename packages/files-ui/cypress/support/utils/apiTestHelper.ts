import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"

const REFRESH_TOKEN_KEY = "csf.refreshToken"

export const apiTestHelper = {

  clearBucket(apiUrlBase: string, bucketType: BucketType) {
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
          apiClient.listBuckets(bucketType).then((buckets) => {
            apiClient
              .getBucketObjectChildrenList(buckets[0].id, { path: "/" })
              .then((items) => {
                const toDelete = items.map(
                  ({ name }: { name: string }) => `/${name}`
                )
                console.log(`Deleting bucket ${bucketType} ${JSON.stringify(toDelete)}`)
                apiClient.removeBucketObject(buckets[0].id, { paths: toDelete }).catch()
              })
          })
        })
    })
  }
}
