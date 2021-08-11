import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"
import { navigationMenu } from "../page-objects/navigationMenu"

const API_BASE_USE = "https://stage.imploy.site/api/v1"
const REFRESH_TOKEN_KEY = "csf.refreshToken"

export const apiTestHelper = {
  clearBucket(bucketType: BucketType, apiUrlBase: string = API_BASE_USE) {
    const axiosInstance = axios.create({
      // Disable the internal Axios JSON deserialization as this is handled by the client
      transformResponse: []
    })

    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)

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
      })
  },
  // create a folder with a full path like "/new folder"
  // you can create subfolders on the fly too with "/first/sub folder"
  createFolder(
    folderPath: string,
    expectedLength: number,
    apiUrlBase: string = API_BASE_USE
  ){
    const axiosInstance = axios.create({
      // Disable the internal Axios JSON deserialization as this is handled by the client
      transformResponse: []
    })

    const apiClient = new FilesApiClient({}, apiUrlBase, axiosInstance)
    cy.log("creating folder", folderPath)
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
            cy.log("done with creating folder")
          } catch(e){
            console.error(e)
          }
        })
    })
      .then(() => {
        navigationMenu.binNavButton().click()
        navigationMenu.homeNavButton().click()

        const firstFolderName = folderPath.split("/")[1]
        cy.get("[data-testid=table-home]", { timeout: 10000 })
          .contains(firstFolderName)
          .should("have.length", expectedLength)
      })
  }
}
