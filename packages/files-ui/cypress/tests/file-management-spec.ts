describe("File management", () => {

  context("desktop", () => {

    it("can add files and cancel", () => {
      cy.web3Login()
      cy.get("[data-cy=upload-modal-button]").click()
      cy.get("[data-cy=upload-file-form] input").attachFile("../fixtures/uploadedFiles/text-file.txt")
      cy.get("[data-testid=file-list-fileUpload] li").should("have.length", 1)
      cy.get("[data-cy=upload-cancel-button").click()
      cy.get("[data-cy=files-app-header").should("be.visible")
    })

    it("can add/remove files and upload", () => {
      cy.web3Login({ clearCSFBucket: true })
      cy.get("[data-cy=upload-modal-button]").click()
      cy.get("[data-cy=upload-file-form] input").attachFile("../fixtures/uploadedFiles/text-file.txt")
      cy.get("[data-testid=file-list-fileUpload] li").should("have.length", 1)
      cy.get("[data-cy=upload-file-form] input").attachFile("../fixtures/uploadedFiles/logo.png")
      cy.get("[data-testid=file-list-fileUpload] li").should("have.length", 2)
      cy.get("[data-testid=file-list-close-button-fileUpload]").first().click()
      cy.get("[data-testid=file-list-fileUpload] li").should("have.length", 1)
      cy.get("[data-cy=upload-file-form] input").attachFile("../fixtures/uploadedFiles/text-file.txt")
      cy.get("[data-testid=file-list-fileUpload] li").should("have.length", 2)
      cy.get("[data-cy=upload-ok-button]").click()
      cy.get("[data-cy=files-app-header]").should("be.visible")
      cy.get("[data-cy=file-item-row]").should("have.length", 2)
    })

    it("can rename a file with error handling", () => {
      const newName = "awesome new name"

      cy.web3Login({ clearCSFBucket: true })
      cy.get("[data-cy=upload-modal-button]").click()
      cy.get("[data-cy=upload-file-form] input").attachFile("../fixtures/uploadedFiles/text-file.txt")
      cy.get("[data-cy=upload-ok-button]").click()
      cy.get("[data-cy=files-app-header]").should("be.visible")

      cy.get("[data-testid=drowpdown-title-fileDropdown]").first().click()
      cy.get("[data-cy=menu-rename]").click()
      cy.get("[data-cy=rename-form] input").type("{selectall}{del}")
      cy.get("[data-cy=rename-form] span.minimal.error").should("be.visible")
      cy.get("[data-cy=rename-form] input").type(`${newName}{enter}`)
      cy.get("[data-cy=file-item-name]").contains(newName)

      cy.get("[data-testid=drowpdown-title-fileDropdown]").first().click()
      cy.get("[data-cy=menu-rename]").click()
      cy.get("[data-cy=rename-form] input").type("{selectall}{del}{esc}")
      cy.get("[data-cy=rename-form] input").should("not.exist")
      cy.get("[data-cy=file-item-name]").contains(newName)
    })
  })
})
