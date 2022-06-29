import { cidsPage } from "../support/page-objects/cidsPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { testCid, testCidAlternative, testCidName } from "../fixtures/storageTestData"
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

    it("can search via name or cid", () => {
      cy.web3Login({ withNewSession: true })
      navigationMenu.cidsNavButton().click()

      // use helper to add required pins
      // partially sharing the same name, each with unique cid
      const pin1 = "Pin 1"
      const pin2 = "Pin 2"
      cidsPage.addPinnedCid({ name: pin1 })
      cidsPage.addPinnedCid({ name: pin2, cid: testCidAlternative })

      // ensure search by full name yields 1 result
      cidsPage.searchCidInput().type(pin1)
      cidsPage.cidItemRow().should("have.length", 1)
      cidsPage.cidItemRow().within(() => {
        cidsPage.cidNameCell().should("have.text", pin1)
      })

      // ensure search by partial name yields 2 results
      cidsPage.searchCidInput()
        .clear()
        .type(pin1.slice(0, 3))
      cidsPage.cidItemRow().should("have.length", 2)
      cidsPage.cidItemRow().within(() => {
        cidsPage.cidNameCell().should("contain.text", pin1)
        cidsPage.cidNameCell().should("contain.text", pin2)
      })

      // ensure search by full cid yields 1 result
      cidsPage.searchCidInput()
        .clear()
        .type(testCid)
      cidsPage.cidItemRow().should("have.length", 1)
      cidsPage.cidItemRow().within(() => {
        cidsPage.cidCell().should("have.text", testCid)
      })

      // peform a search that yields no results
      cidsPage.searchCidInput()
        .clear()
        .type("bogus")
      cidsPage.cidItemRow().should("have.length", 0)

      // remove search input to remove all search filtering
      cidsPage.searchCidInput().clear()
      cidsPage.cidItemRow().should("have.length", 2)
    })

    it("can sort by name or created at in cids table", () => {
      cy.web3Login({ withNewSession: true })
      navigationMenu.cidsNavButton().click()

      const pin1 = "Pin 1"
      const pin2 = "Pin 2"
      cidsPage.addPinnedCid({ name: pin1 })
      cidsPage.addPinnedCid({ name: pin2, cid: testCidAlternative })
      cidsPage.cidItemRow().should("have.length", 2)

      // by default should be sort by date uploading in descending order (newest first)
      cidsPage.cidNameCell().eq(0).should("have.text", pin2)
      cidsPage.cidNameCell().eq(1).should("have.text", pin1)

      // ensure sort by created in descending order (oldest first)
      cidsPage.createdTableHeader().click()
      cidsPage.cidNameCell().eq(0).should("have.text", pin1)
      cidsPage.cidNameCell().eq(1).should("have.text", pin2)

      // ensure sort by name in descending order (Z-A)
      cidsPage.nameTableHeader().click()
      cidsPage.cidNameCell().eq(0).should("have.text", pin2)
      cidsPage.cidNameCell().eq(1).should("have.text", pin1)

      // ensure sort by name in ascending order (A-Z)
      cidsPage.nameTableHeader().click()
      cidsPage.cidNameCell().eq(0).should("have.text", pin1)
      cidsPage.cidNameCell().eq(1).should("have.text", pin2)
    })
  })
})