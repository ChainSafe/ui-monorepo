import { createEditSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerKey } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"
import { viewOnlyShareLink, canEditShareLink, deletedShareLink, malformedTokenShareLink, deletedFolderLink } from "../fixtures/linkData"
import { linkSharingConfirmation } from "../support/page-objects/linkSharingConfirmation"
import { sharedFolderContentsPage } from "../support/page-objects/sharedFolderContentsPage"
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
      createEditSharedFolderModal.linkPermissionDropdown().should("be.visible")
      createEditSharedFolderModal.createLinkButton().should("be.visible")

      // ensure "view-only" and "can-edit" options are present
      createEditSharedFolderModal.linkPermissionDropdown().click()
      createEditSharedFolderModal.viewOnlyDropdownOption()
        .scrollIntoView()
        .should("be.visible")
      createEditSharedFolderModal.canEditDropdownOption()
        .scrollIntoView()
        .should("be.visible")

      // create a "view-only" link
      createEditSharedFolderModal.viewOnlyDropdownOption().click()
      createEditSharedFolderModal.createLinkButton().click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 1)
      createEditSharedFolderModal.labelPermissionType().should("have.length", 1)
      createEditSharedFolderModal.copyLinkButton().should("have.length", 1)

      // ensure only the can-edit option is present if a "view-only" link exists
      createEditSharedFolderModal.linkPermissionDropdown().click()
      createEditSharedFolderModal.viewOnlyDropdownOption().should("not.exist")
      createEditSharedFolderModal.canEditDropdownOption()
        .scrollIntoView()
        .should("be.visible")

      // create a "can-edit" link
      createEditSharedFolderModal.canEditDropdownOption().click()
      createEditSharedFolderModal.createLinkButton().click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 2)
      createEditSharedFolderModal.labelPermissionType().should("have.length", 2)
      createEditSharedFolderModal.copyLinkButton().should("have.length", 2)

      // ensure create button and drop down are not shown if links exist
      createEditSharedFolderModal.linkPermissionDropdown().should("not.exist")
      createEditSharedFolderModal.createLinkButton().should("not.exist")

      // delete one of the links
      createEditSharedFolderModal.linkKebabMenu().first().click()
      createEditSharedFolderModal.deleteLinkMenuOption().first()
        .scrollIntoView()
        .click()
      createEditSharedFolderModal.activeShareLink().should("have.length", 1)
    })

    it("can join a share from link with view-only access", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })
      cy.visit(viewOnlyShareLink)
      linkSharingConfirmation.viewAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // can navigate to the shared folder
      linkSharingConfirmation.browseButton()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.appHeaderLabel().should("be.visible")

      // ensure file options correspond to view-only access rights
      sharedFolderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.viewOnlyPermissionOptionsShould("be.visible")
      sharedFolderContentsPage.canEditPermissionOptionsShould("not.exist")

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
      linkSharingConfirmation.editAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // can navigate to the shared folder
      linkSharingConfirmation.browseButton()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.appHeaderLabel().should("be.visible")

      // ensure file options correspond to "can-edit" access rights
      sharedFolderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.viewOnlyPermissionOptionsShould("be.visible")
      sharedFolderContentsPage.canEditPermissionOptionsShould("be.visible")

      // ensure the shared folder is now shown on the main share page
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemRow().should("have.length", 1)
    })

    it("can see an invalid link message when it has been deleted", () => {
      cy.web3Login()
      cy.visit(deletedShareLink)
      linkSharingConfirmation.errorIcon().should("be.visible")
      linkSharingConfirmation.invalidLinkMessage().should("be.visible")
    })

    it("can see an error message for a link with a malformed token", () => {
      cy.web3Login()
      cy.visit(malformedTokenShareLink)
      linkSharingConfirmation.errorIcon().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("be.visible")
    })

    it("can see an error message for a link to a deleted shared folder", () => {
      cy.web3Login()
      cy.visit(deletedFolderLink)
      linkSharingConfirmation.errorIcon().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("be.visible")
    })

    it("can see a prompt to sign in when trying to visit a share link", () => {
      cy.visit(viewOnlyShareLink)
      authenticationPage.signInToAccessShareLabel().should("be.visible")
    })

    it("can see an invalid link message when signed out", () => {
      cy.visit(deletedShareLink)
      authenticationPage.errorIcon().should("be.visible")
      authenticationPage.invalidLinkMessage().should("be.visible")

      // return to the main login section
      authenticationPage.goToLoginButton().click()
      authenticationPage.web3Button().should("be.visible")
    })

    it("can upgrade access level from view-only by visiting an can-edit link", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      // join a shared folder with "view-only" access
      cy.web3Login({ deleteShareBucket: true })
      cy.visit(viewOnlyShareLink)
      linkSharingConfirmation.viewAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // join the share again from a "can-edit" link
      cy.visit(canEditShareLink)
      linkSharingConfirmation.browseButton()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.appHeaderLabel().should("be.visible")

      // ensure the file options correspond to "can-edit" access rights
      sharedFolderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.viewOnlyPermissionOptionsShould("be.visible")
      sharedFolderContentsPage.canEditPermissionOptionsShould("be.visible")
    })

    it("cannot downgrade access level from can-edit by visiting a view-only link", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      // join a shared folder with "can-edit" rights
      cy.web3Login({ deleteShareBucket: true })
      cy.visit(canEditShareLink)
      linkSharingConfirmation.editAccessConfirmationLabel().should("be.visible")
      linkSharingConfirmation.linkErrorMessage().should("not.exist")

      // join the share again from a "view-only" link
      cy.visit(viewOnlyShareLink)
      linkSharingConfirmation.browseButton()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.appHeaderLabel().should("be.visible")

      // ensure the file options still correspond to "can-edit" access rights
      sharedFolderContentsPage.fileItemKebabButton()
        .first()
        .should("be.visible")
        .click()
      sharedFolderContentsPage.viewOnlyPermissionOptionsShould("be.visible")
      sharedFolderContentsPage.canEditPermissionOptionsShould("be.visible")
    })
  })
})
