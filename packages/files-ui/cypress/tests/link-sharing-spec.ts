import { createEditSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerKey } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"
import { viewOnlyShareLink, canEditShareLink, deletedShareLink, malformedTokenShareLink, deletedFolderLink } from "../fixtures/linkData"
import { linkSharingConfirmation } from "../support/page-objects/linkSharingConfirmation"
import { folderContentsPage } from "../support/page-objects/sharedFolderContentsPage"
import { authenticationPage } from "../support/page-objects/authenticationPage"

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
      sharedPage.fileItemKebabButton()
        .should("be.visible")
        .click()
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
      createEditSharedFolderModal.viewOnlyOption()
        .scrollIntoView()
        .should("be.visible")
      createEditSharedFolderModal.canEditOption()
        .scrollIntoView()
        .should("be.visible")

      // create a "view-only" link
      createEditSharedFolderModal.viewOnlyOption().click()
      createEditSharedFolderModal.createLinkButton().click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 1)
      createEditSharedFolderModal.labelPermissionType().should("have.length", 1)
      createEditSharedFolderModal.copyLinkButton().should("have.length", 1)

      // ensure only the can-edit option is present if a "view-only" link exists
      createEditSharedFolderModal.permissionTypeDropdown().click()
      createEditSharedFolderModal.viewOnlyOption().should("not.exist")
      createEditSharedFolderModal.canEditOption()
        .scrollIntoView()
        .should("be.visible")

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

    it("can join a share from link with view only access", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })

      cy.visit(viewOnlyShareLink)

      linkSharingConfirmation.viewAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // can browse the shared folder
      linkSharingConfirmation.browseButton().click()
      folderContentsPage.appHeaderLabel().should("be.visible")

      // ensure file options correspond to view-only access rights
      folderContentsPage.awaitBucketRefresh()
      folderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      folderContentsPage.previewMenuOption().should("be.visible")
      folderContentsPage.downloadMenuOption().should("be.visible")
      folderContentsPage.infoMenuOption().should("be.visible")
      folderContentsPage.reportMenuOption().should("be.visible")
      folderContentsPage.copyToMenuOption().should("be.visible")
      folderContentsPage.renameMenuOption().should("not.exist")
      folderContentsPage.moveMenuOption().should("not.exist")
      folderContentsPage.deleteMenuOption().should("not.exist")

      // ensure shared folder is now shown on main share page
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemRow().should("have.length", 1)
    })

    it("can join a share from link with edit access", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })

      cy.visit(canEditShareLink)

      //todo: SEE IF THERES AN API CALL I CAN WAIT FOR

      linkSharingConfirmation.editAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // can browse the shared folder
      linkSharingConfirmation.browseButton().click()
      folderContentsPage.appHeaderLabel().should("be.visible")

      // ensure file options correspond to can-edit access rights
      folderContentsPage.awaitBucketRefresh()
      folderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      folderContentsPage.previewMenuOption().should("be.visible")
      folderContentsPage.downloadMenuOption().should("be.visible")
      folderContentsPage.infoMenuOption().should("be.visible")
      folderContentsPage.reportMenuOption().should("be.visible")
      folderContentsPage.copyToMenuOption().should("be.visible")
      folderContentsPage.renameMenuOption().should("be.visible")
      folderContentsPage.moveMenuOption().should("be.visible")
      folderContentsPage.deleteMenuOption().should("be.visible")

      // ensure shared folder is now shown on main share page
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemRow().should("have.length", 1)
    })

    it("can see an invalid link message when it has been deleted", () => {
      cy.web3Login()
      cy.visit(deletedShareLink)
      linkSharingConfirmation.ErrorIcon().should("be.visible")
      linkSharingConfirmation.invalidLinkMessage().should("be.visible")
    })

    it("can see an error message for a link with a malformed token", () => {
      cy.web3Login()
      cy.visit(malformedTokenShareLink)
      linkSharingConfirmation.ErrorIcon().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("be.visible")
    })

    it("can see an error message for a link to a deleted shared folder", () => {
      cy.web3Login()
      cy.visit(deletedFolderLink)
      linkSharingConfirmation.ErrorIcon().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("be.visible")
    })

    it("can see a prompt to sign in when trying to visit a share link", () => {
      cy.visit(viewOnlyShareLink)
      authenticationPage.signInToAccessShareLabel().should("be.visible")
    })

    it("can see an invalid link message when signed out", () => {
      cy.visit(deletedShareLink)
      authenticationPage.ErrorIcon().should("be.visible")
      authenticationPage.invalidLinkMessage().should("be.visible")

      // return to login
      authenticationPage.goToLoginButton().click()
      authenticationPage.web3Button().should("be.visible")
    })
  })
})
