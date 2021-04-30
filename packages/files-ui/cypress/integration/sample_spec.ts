describe("My First Test", () => {

    // beforeEach(() => {
    //   cy.log("--> window")
    //   cy.on('window:after:load', (win) => {
    //     Object.defineProperty(win, 'aaaaa', {
    //       value: "bbb",
    //     });
    //     cy.log("winn",win)
    //   });
    // });

  it("Visits the login page", () => {
    
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'aaaaa', {
        value: "bbb",
      });
    });
    // cy.on("window:before:load", (win) => {
    //   Object.defineProperty(win, 'aaaaa', {
    //     configurable: false,
    //     get: () => "bbbb", // always return the stub
    //     set: () => {}, // don't allow actual google analytics to overwrite this property
    //   })
    //   // (win as any).thib = "bla"
    //   // const provider = new PrivateKeyProvider(
    //   //   "0xe3ae65151e19ea16ceac0627cddff698f7cf0e22aea0f7f4063181000c156ed3",
    //   //   "https://rinkeby.infura.io"
    //   // );
    //   // (win as any).web3 = new Web3(provider); // eslint-disable-line no-param-reassign
    //   console.log('injected2--------------')
    // });
            
    cy.visit("http://localhost:3000")
    
  
    // cy.fixture("login").then((fixt) => {
    //   Object.keys(fixt).forEach((key) => {
    //     // cy.window().then((window) => {
    //     //   window.sessionStorage.setItem(key, fixt[key])
    //     // })
    //   })
    // })
    // cy.get('[data-cy=web3]').click()
    // cy.get('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom').click()
    // console.log('wiiiii3', window)
    // cy.pause()
  })
})