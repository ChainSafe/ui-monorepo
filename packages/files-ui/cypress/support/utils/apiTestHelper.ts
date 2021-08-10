import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"

const API_BASE_USE = "https://stage.imploy.site/api/v1"
const REFRESH_TOKEN_KEY = "csf.refreshToken"

export const apiTestHelper = {
  clearBucket(bucketType: BucketType, apiUrlBase: string = API_BASE_USE) {
    const axiosInstance = axios.create({
      // Disable the internal Axios JSON deserialization as this is handled by the client
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
          apiClient.listBuckets([bucketType]).then((buckets) => {
            apiClient
              .getBucketObjectChildrenList(buckets[0].id, { path: "/" })
              .then((items) => {
                const toDelete = items.map(
                  ({ name }: { name: string }) => `/${name}`
                )
                console.log(`Deleting bucket ${bucketType} ${JSON.stringify(toDelete)}`)
                apiClient.removeBucketObject(buckets[0].id, { paths: toDelete }).catch()
              })
              .catch(console.error)
          })
        })
    })
  },
  // create a folder with a full path like "/new folder"
  // you can create subfolders on the fly too with "/first/sub folder"
  createFolder(folderPath: string,  apiUrlBase: string = API_BASE_USE){
    const axiosInstance = axios.create({
      // Disable the internal Axios JSON deserialization as this is handled by the client
      transformResponse: []
    })

    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)

    cy.window().then((win) => {
      apiClient
        .getRefreshToken({
          refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || ""
        })
        .then(async (tokens) => {
          apiClient.setToken(tokens.access_token.token)
          try{
            const buckets = await apiClient.listBuckets()
            const bucketId = buckets.find((b) => b.type === "csf")?.id

            if(!bucketId) throw new Error("No csf bucket")

            await apiClient.addBucketDirectory(bucketId, { path: folderPath })
          } catch(e){
            console.error(e)
          }
        })
    })
  }
}
