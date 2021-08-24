import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"
import { navigationMenu } from "../page-objects/navigationMenu"

const API_BASE_USE = "https://stage.imploy.site/api/v1"
const REFRESH_TOKEN_KEY = "csf.refreshToken"

export const apiTestHelper = {
  clearBucket(bucketType: BucketType, apiUrlBase: string = API_BASE_USE) {
    // Disable the internal Axios JSON deserialization as this is handled by the client
    const axiosInstance = axios.create({ transformResponse: [] })
    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)

    return new Cypress.Promise(async (resolve) => {
      cy.window()
        .then(async (win) => {
          const tokens = await apiClient.getRefreshToken({ refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || "" })

          await apiClient.setToken(tokens.access_token.token)
          const buckets = await apiClient.listBuckets([bucketType])
          const items = await apiClient.getBucketObjectChildrenList(buckets[0].id, { path: "/" })
          const toDelete = items.map(
            ({ name }: { name: string }) => `/${name}`
          )
          cy.log(`Deleting bucket ${bucketType} ${JSON.stringify(toDelete)}`)
          await apiClient.removeBucketObject(buckets[0].id, { paths: toDelete })
          cy.log("done deleting")
          resolve()
        })
    })
  },
  // create a folder with a full path like "/new folder"
  // you can create subfolders on the fly too with "/first/sub folder"
  createFolder(
    folderPath: string,
    apiUrlBase: string = API_BASE_USE
  ){
    // Disable the internal Axios JSON deserialization as this is handled by the client
    const axiosInstance = axios.create({ transformResponse: [] })
    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)

    return new Cypress.Promise((resolve, reject) => {
      cy.window().then(async (win) => {
        cy.log("creating folder", folderPath)

        try{
          const tokens = await apiClient
            .getRefreshToken({
              refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || ""
            })

          apiClient.setToken(tokens.access_token.token)
          const buckets = await apiClient.listBuckets()
          const bucketId = buckets.find((b) => b.type === "csf")?.id

          if(!bucketId) throw new Error("No csf bucket")

          await apiClient.addBucketDirectory(bucketId, { path: folderPath })
          cy.log("done with creating folder")
          resolve()
        } catch(e){
          console.error(e)
          reject(e)
        }

        navigationMenu.binNavButton().click()
        navigationMenu.homeNavButton().click()

        const firstFolderName = folderPath.split("/")[1]
        cy.get("[data-testid=table-home]", { timeout: 10000 })
          .contains(firstFolderName)
      })
    })


  }
}
