import { cidsPage } from "../support/page-objects/cidsPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { testCid, testCidName } from "../fixtures/storageTestData"
import { addCidModal } from "../support/page-objects/modals/addCidModal"

describe("CID management", () => {

  context("desktop", () => {

    it("can pin a CID", () => {
      cy.web3Login({ withNewSession: true })
      navigationMenu.cidsNavButton().click()

      // pin a cid and see it in the pinned items table
      cidsPage.pinButton().click()
      addCidModal.body().should("be.visible")
      addCidModal.nameInput().type(testCidName)
      addCidModal.cidInput().type(testCid)
      addCidModal.pinSubmitButton().safeClick()
      cidsPage.cidItemRow().should("have.length", 1)
      cidsPage.cidItemRow().within(() => {
        cidsPage.cidNameCell().should("have.text", testCidName)
      })

      // open the pin cid modal and cancel it
      cidsPage.pinButton().click()
      addCidModal.body().should("be.visible")
      addCidModal.pinCancelButton().click()
      addCidModal.body().should("not.exist")
    })

    // this is unreliable since the pin from the previous 
    // test is still in the "queued" state while being unpinned.
    it("can unpin a cid", () => {
      cy.web3Login({ withNewSession: true })
      navigationMenu.cidsNavButton().click()

      // pin and then unpin a CID
      cidsPage.addPinnedCid()
      cidsPage.cidRowKebabButton().click()
      cidsPage.unpinMenuOption().click()
      cidsPage.cidItemRow().should("contain.text", "queued")
    })
  })

  it("can see a warning when attempting to pin the same CID twice", () => {
    cy.web3Login({ withNewSession: true })
    navigationMenu.cidsNavButton().click()

    // add a cid
    cidsPage.addPinnedCid()

    // see warning if attempting to pin the cid again
    cidsPage.pinButton().click()
    addCidModal.body().should("be.visible")
    addCidModal.cidInput().type(testCid)
    addCidModal.cidPinnedWarningLabel().should("be.visible")
  })
})