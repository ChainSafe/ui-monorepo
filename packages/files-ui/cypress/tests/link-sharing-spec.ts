import { createEditSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerKey } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"

describe("Link Sharing", () => {

  context("desktop", () => {

    it("can create, copy and remove links to shared folders", () => {
      // intercept and stub the response to ensure the explainer is not displayed
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })

      // create a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolder()
      sharedPage.fileItemKebabButton().click()
      sharedPage.manageAccessMenuOption().click()
      createEditSharedFolderModal.body().should("be.visible")

      // ensure default state of displayed elements is correct
      createEditSharedFolderModal.activeShareLink().should("not.exist")
      createEditSharedFolderModal.labelPermissionType().should("not.exist")
      createEditSharedFolderModal.copyLinkButton().should("not.exist")
      createEditSharedFolderModal.linkKebabMenu().should("not.exist")
      createEditSharedFolderModal.permissionTypeDropdown().should("be.visible")
      createEditSharedFolderModal.createLinkButton().should("be.visible")

      // ensure "view-only" and "can-edit" options are present
      createEditSharedFolderModal.permissionTypeDropdown().click()
      createEditSharedFolderModal.createLinkButton().scrollIntoView()
      createEditSharedFolderModal.viewOnlyOption().should("be.visible")
      createEditSharedFolderModal.canEditOption().should("be.visible")

      // create a "view-only" link
      createEditSharedFolderModal.viewOnlyOption().click()
      createEditSharedFolderModal.createLinkButton().click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 1)
      createEditSharedFolderModal.labelPermissionType().should("have.length", 1)
      createEditSharedFolderModal.copyLinkButton().should("have.length", 1)

      // ensure only the can-edit option is present if a "view-only" link exists
      createEditSharedFolderModal.permissionTypeDropdown().click()
      createEditSharedFolderModal.viewOnlyOption().should("not.exist")
      createEditSharedFolderModal.canEditOption().should("be.visible")

      // create a "can-edit" link
      createEditSharedFolderModal.canEditOption().click()
      createEditSharedFolderModal.createLinkButton().click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 2)
      createEditSharedFolderModal.labelPermissionType().should("have.length", 2)
      createEditSharedFolderModal.copyLinkButton().should("have.length", 2)

      // ensure create button and drop down are not shown if links exist
      createEditSharedFolderModal.permissionTypeDropdown().should("not.exist")
      createEditSharedFolderModal.createLinkButton().should("not.exist")

      // delete one of the links
      createEditSharedFolderModal.linkKebabMenu().first().click()
      createEditSharedFolderModal.deleteLinkMenuOption().first()
        .scrollIntoView()
        .click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 1)
    })
  })
})
