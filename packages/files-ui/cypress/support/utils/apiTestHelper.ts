import axios from "axios"
import { FilesApiClient } from "@chainsafe/files-api-client"
import { BucketType } from "@chainsafe/files-api-client"
import { navigationMenu } from "../page-objects/navigationMenu"
import { homePage } from "../page-objects/homePage"

const API_BASE_URL = "https://stage.imploy.site/api/v1"
const REFRESH_TOKEN_KEY = "csf.refreshToken"
const FREE_PLAN_ID = "prod_JwRu6Ph25b1f2O"

export type ClearBucketType = Exclude<BucketType, "share" | "pinning" | "fps">
const getApiClient = () => {
  // Disable the internal Axios JSON deserialization as this is handled by the client
  const axiosInstance = axios.create({ transformResponse: [] })
  const apiClient = new FilesApiClient({}, API_BASE_URL, axiosInstance)

  return apiClient
}
export const apiTestHelper = {
  deleteSharedFolders() {
    const apiClient = getApiClient()

    return new Cypress.Promise(async (resolve) => {
      cy.window()
        .then(async (win) => {
          const tokens = await apiClient.getRefreshToken({ refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || "" })

          await apiClient.setToken(tokens.access_token.token)
          const buckets = await apiClient.listBuckets(["share"])
          buckets.forEach(async (bucket) => {
            cy.log(`Deleting shared bucket: "${bucket.name}""`)
            await apiClient.removeBucket(bucket.id)
          })
          cy.log("Done deleting shared buckets.")
          resolve()
        })
    })
  },
  ensureUserIsOnFreePlan () {
    const apiClient = getApiClient()

    return new Cypress.Promise(async (resolve, reject) => {
      cy.window()
        .then(async (win) => {
          try {
            const tokens = await apiClient.getRefreshToken({ refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || "" })
            await apiClient.setToken(tokens.access_token.token)

            const subscription = await apiClient.getCurrentSubscription()

            // if they are not on the free plan, cancel the current plan
            if(subscription.product.id !== FREE_PLAN_ID) {
              await apiClient.cancelSubscription(subscription.id)
              cy.log("Done canceling subscription")
            }

            resolve()
          } catch (e){
            cy.log("Something wrong happened during the subscription cancelation")
            console.log(e)
            reject(e)
          }
        })
    })

  },
  deleteCreditCards() {
    const apiClient = getApiClient()

    return new Cypress.Promise(async (resolve) => {
      cy.window()
        .then(async (win) => {
          const tokens = await apiClient.getRefreshToken({ refresh: win.sessionStorage.getItem(REFRESH_TOKEN_KEY) || "" })

          await apiClient.setToken(tokens.access_token.token)
          try {
            const card = await apiClient.getDefaultCard()
            apiClient.deleteCard(card.id)
          } catch {
            cy.log("There's no card to delete")
          }
          cy.log("Done deleting the default card")
          resolve()
        })
    })
  },
  clearBucket(bucketType: ClearBucketType) {
    const apiClient = getApiClient()

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
          cy.log(`Clearing bucket ${bucketType} ${JSON.stringify(toDelete)}`)
          await apiClient.removeBucketObject(buckets[0].id, { paths: toDelete })
          cy.log("Done clearing")
          resolve()
        })
    })
  },
  // create a folder with a full path like "/new folder"
  // you can create subfolders on the fly too with "/first/sub folder"
  createFolder(folderPath: string){
    const apiClient = getApiClient()

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
        homePage.fileItemName().contains(firstFolderName)
      })
    })


  }
}
