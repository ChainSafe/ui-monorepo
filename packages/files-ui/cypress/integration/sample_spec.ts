import { ethers, Wallet } from "ethers"
import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge"
import { joinSignature } from "ethers/lib/utils"

const PRIVATE_KEY_TEST_NEVER_USE = "0xa25e2110b53821441a5f476d4666dd7a48569a0be4b1bab87350f94923e99a9c"
// address of the above key
export const TEST_ADDRESS_NEVER_USE = "0xf0Ae62B0EbcB5963538B7103b9A022b3e8cBDB80"


class CustomizedBridge extends Eip1193Bridge {
  async sendAsync(...args) {
    console.debug("sendAsync called", ...args)
    return this.send(...args)
  }
  async isMetaMask(){
    return true
  }
  async send(...args) {
    console.debug("send called", ...args)
    const isCallbackForm = typeof args[0] === "object" && typeof args[1] === "function"
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      method = args[0].method
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }

    if (method === "personal_sign"){
      console.log("---> personal_sign requested", args, typeof args[0])

      const addr = params[1]
      const message = params[0]

      if ((addr as string).toLowerCase() !== TEST_ADDRESS_NEVER_USE.toLowerCase()){
        return Promise.reject(`Wrong address, expected ${TEST_ADDRESS_NEVER_USE}, but got ${addr}`)
      }

      try {
        // const sig = await this.signer.signMessage(message)
        const sig = await joinSignature((this.signer as unknown as Wallet)._signingKey().signDigest(message))
        console.log("sig", sig)
        return sig
      } catch (e) {
        return Promise.reject(`Error in CustomizedBridge for personal_sign: ${e.message}`)
      }
    }

    if (method === "eth_requestAccounts" || method === "eth_accounts") {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] })
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE])
      }
    }

    if (method === "eth_chainId") {
      if (isCallbackForm) {
        callback(null, { result: "0x4" })
      } else {
        return Promise.resolve("0x4")
      }
    }

    try {
      const result = await super.send(method, params)
      console.debug("result received", method, params, result)
      if (isCallbackForm) {
        callback(null, { result })
      } else {
        return result
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null)
      } else {
        throw error
      }
    }
  }
}

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
      const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847", 4)
      const signer = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, provider)
      // const wallet = new ethers.Wallet("")
      // console.log('br', new Eip1193Bridge(signer as any, provider as any))
      // const bridge = new Eip1193Bridge(signer as any, provider as any)
      // (win as any).ethereum = new CustomizedBridge(signer as any, provider as any);
      // (win as any).isMetaMask = {
      //   isMetaMask: true,
      //   request: () => {
      //     console.log('request called')
      //     return Promise.resolve()
      //   }
      // }

      Object.defineProperty(win, "ethereum", {
        get: () => new CustomizedBridge(signer as any, provider as any)
      })

      // Object.defineProperty(win, "isMetaMask", {
      //   get: () => ({
      //     isMetaMask: true,
      //     request: () => {
      //       console.log("request called")
      //       return Promise.resolve()
      //     }
      //   })
      // })
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