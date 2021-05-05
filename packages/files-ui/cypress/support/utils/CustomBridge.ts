import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge"
import { toUtf8String } from "ethers/lib/utils"
import { testAddress } from "../../fixtures/loginData"

export class CustomizedBridge extends Eip1193Bridge {
    async sendAsync(...args: Array<any>) {
      return this.send(...args)
    }

    async isMetaMask() {
      return true
    }

    async send(...args: Array<any>) {
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
  
      if (method === "personal_sign") {
        const addr = params[1]
        const message = params[0]
  
        if (
          (addr as string).toLowerCase() !== testAddress.toLowerCase()
        ) {
          return Promise.reject(
            `Wrong address, expected ${testAddress}, but got ${addr}`
          )
        }
  
        try {
          const sig = await this.signer.signMessage(toUtf8String(message))
          return sig
        } catch (e) {
          return Promise.reject(
            `Error in CustomizedBridge for personal_sign: ${e.message}`
          )
        }
      }
  
      if (method === "eth_requestAccounts" || method === "eth_accounts") {
        if (isCallbackForm) {
          callback({ result: [testAddress] })
        } else {
          return Promise.resolve([testAddress])
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