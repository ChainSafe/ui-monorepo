import { ethers } from "ethers"


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

    cy.on("window:before:load", (win) => {
      const wallet = new ethers.Wallet("0xa25e2110b53821441a5f476d4666dd7a48569a0be4b1bab87350f94923e99a9c")
      const provider = new ethers.EIP1193Bridge
      // eslint-disable-next-line max-len
      Object.defineProperty(win, "ethereum", {
        get: () => ({
          "_events": {},
          "_eventsCount": 4,
          "_maxListeners": 100,
          "_log": {
            "levels": {
              "TRACE": 0,
              "DEBUG": 1,
              "INFO": 2,
              "WARN": 3,
              "ERROR": 4,
              "SILENT": 5
            }
          },
          "isMetaMask": true,
          "_state": {
            "sentWarnings": {
              "enable": false,
              "experimentalMethods": false,
              "send": false,
              "events": {
                "close": false,
                "data": false,
                "networkChanged": true,
                "notification": false
              }
            },
            "accounts": [
              "0x8c4118c0a13d0a77a5e7f2197fa24ced0e94c9f4"
            ],
            "isConnected": true,
            "isUnlocked": true,
            "initialized": true,
            "isPermanentlyDisconnected": false
          },
          "_metamask": {},
          "selectedAddress": "0x8c4118c0a13d0a77a5e7f2197fa24ced0e94c9f4",
          "networkVersion": "1",
          "chainId": "0x1",
          "_rpcEngine": {
            "_events": {},
            "_eventsCount": 0,
            "_middleware": [
              null,
              null,
              null
            ]
          },
          "autoRefreshOnNetworkChange": false
        })
      })
    })
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
    cy.get("[data-cy=web3]").click()
    cy.get(".bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom").click()
    console.log("wiiiii3", window)
    // cy.pause()
  })
})