import { navigationMenu } from "../support/page-objects/navigationMenu"
import { apiKeysPage } from "../support/page-objects/apiKeysPage"
import { newKeyModal } from "../support/page-objects/modals/newKeyModal"

describe("Main Navigation", () => {

  context("desktop", () => {
    beforeEach(() => {
      cy.web3Login({ deleteApiKeys: true })
    })

    it("can add and delete a storage api key", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add new storage api key
      apiKeysPage.addApiKeyButton().click()
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.keyIdLabel().invoke("text").as("keyId")
      newKeyModal.closeButton().click()

      // ensure new key modal is closed and api key button is not enabled
      newKeyModal.secretLabel().should("not.exist")
      apiKeysPage.addApiKeyButton().should("not.be.enabled")

      // ensure key id and status are correct in the table
      cy.get<string>("@keyId").then((keyId) => {
        apiKeysPage.apiKeyIdCell().should("have.text", keyId)
      })
      apiKeysPage.apiKeyTypeCell().should("have.text", "storage")

      // delete api key
      apiKeysPage.apiKeyRowKebabButton().click()
      apiKeysPage.deleteMenuOption().click()
      apiKeysPage.apiKeyIdCell().should("not.exist")
    })

    it("can add and delete a s3 api key", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add new s3 api key
      apiKeysPage.addS3KeyButton().click()
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.keyIdLabel().invoke("text").as("keyId")
      newKeyModal.closeButton().click()

      // ensure new key modal is closed and api key button is enabled
      newKeyModal.secretLabel().should("not.exist")
      apiKeysPage.addS3KeyButton().should("be.enabled")

      // ensure key id and status are correct in the table
      cy.get<string>("@keyId").then((keyId) => {
        apiKeysPage.apiKeyIdCell().should("have.text", keyId)
      })
      apiKeysPage.apiKeyTypeCell().should("have.text", "s3")

      // delete s3 key
      apiKeysPage.apiKeyRowKebabButton().click()
      apiKeysPage.deleteMenuOption().click()
      apiKeysPage.apiKeyIdCell().should("not.exist")
    })

    it("can copy to clipboard secret s3 api key", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add new s3 api key
      apiKeysPage.addS3KeyButton().click()

      // ensure can copy to clipboard the secret key
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.secretLabel().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        newKeyModal.secretLabel().should("have.text", text)
      })
    })

    it("can copy to clipboard secret storage api key", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add new s3 api key
      apiKeysPage.addApiKeyButton().click()

      // ensure can copy to clipboard the secret key
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.secretLabel().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        newKeyModal.secretLabel().should("have.text", text)
      })
    })

    it("can copy to clipboard secret storage api key", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add new s3 api key
      apiKeysPage.addApiKeyButton().click()

      // ensure can copy to clipboard the secret key
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.secretLabel().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        newKeyModal.secretLabel().should("have.text", text)
      })
    })

    it("can add multiple s3 api keys", () => {
      // go to api keys section
      navigationMenu.apiKeysNavButton().click()

      // add first s3 api key
      apiKeysPage.addS3KeyButton().click()
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.keyIdLabel().invoke("text").as("firstKeyId")
      newKeyModal.closeButton().click()

      // ensure key id and status of first key are correct in the table
      cy.get<string>("@firstKeyId").then((keyId) => {
        apiKeysPage.apiKeyIdCell().should("have.text", keyId)
      })
      apiKeysPage.apiKeyTypeCell().should("have.text", "s3")

      // add second s3 api key
      apiKeysPage.addS3KeyButton().click()
      newKeyModal.secretLabel().should("be.visible")
      newKeyModal.keyIdLabel().invoke("text").as("secondKeyId")
      newKeyModal.closeButton().click()

      // ensure key id and status of second key are correct in the table
      cy.get<string>("@secondKeyId").then((keyId) => {
        apiKeysPage.apiKeyIdCell().eq(1).should("have.text", keyId)
      })
      apiKeysPage.apiKeyTypeCell().eq(1).should("have.text", "s3")
    })
  })
})
