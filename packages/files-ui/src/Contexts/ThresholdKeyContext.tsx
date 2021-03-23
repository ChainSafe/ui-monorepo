import React, { useState, useEffect } from "react"
import DirectAuthSdk, { LOGIN_TYPE, TorusLoginResponse } from "@toruslabs/torus-direct-web-sdk"
import ThresholdKey from "@tkey/default"
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage"
import SecurityQuestionsModule, { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import { KeyDetails, ShareStore, getPubKeyEC } from "@tkey/common-types"
import ShareTransferModule, { SHARE_TRANSFER_MODULE_NAME } from "@tkey/share-transfer"
import ShareSerializationModule, { SHARE_SERIALIZATION_MODULE_NAME } from "@tkey/share-serialization"
import { ServiceProviderBase } from "@tkey/service-provider-base"
import { TorusStorageLayer } from "@tkey/storage-layer-torus"
import bowser from "bowser"
import { signMessage, useImployApi } from "@chainsafe/common-contexts"
import { Wallet } from "ethers"
import EthCrypto from "eth-crypto"
import { useWeb3 } from "@chainsafe/web3-context"
import ShareTransferRequestModal from "../Components/Elements/ShareTransferRequestModal"
import BN from "bn.js"
import { TKeyRequestIdentity_provider } from "@chainsafe/files-api-client"

const TORUS_POSTBOX_KEY = "csf.postboxKey"
const TKEY_STORE_KEY = "csf.tkeyStore"
const TORUS_USERINFO_KEY = "csf.userInfo"

export type TThresholdKeyContext = {
  userInfo?: TorusLoginResponse
  keyDetails?: KeyDetails
  publicKey?: string
  isNewDevice: boolean
  isNewKey: boolean
  shouldInitializeAccount: boolean
  pendingShareTransferRequests: ShareTransferRequest[]
  login(loginType: LOGIN_TYPE | "web3"): Promise<void>
  resetIsNewDevice(): void
  resetShouldInitialize(): void
  addPasswordShare(password: string): Promise<void>
  inputPasswordShare(password: string): Promise<void>
  inputMnemonicShare(mnemonic: string): Promise<void>
  addNewDeviceShareAndSave(): Promise<void>
  approveShareTransferRequest(encPubKeyX: string): Promise<void>
  rejectShareTransferRequest(encPubKeyX: string): Promise<void>
  clearShareTransferRequests(): Promise<void>
  addMnemonicShare(): Promise<string>
  encryptForPublicKey(publicKey: string, message: string): Promise<string>
  decryptMessageWithThresholdKey(message: string): Promise<string | undefined>
  logout(): Promise<void>
}

type ThresholdKeyProviderProps = {
  children: React.ReactNode | React.ReactNode[]
  network?: "testnet" | "mainnet"
  enableLogging?: boolean
  apiKey?: string
}

export type ShareTransferRequest = {
  availableShareIndexes: Array<string>
  browserDetail: bowser.Parser.ParsedResult
  encPubKey: any
  encPubKeyX: string
  timestamp: number
  userAgent: string
}

const ThresholdKeyContext = React.createContext<TThresholdKeyContext | undefined>(undefined)

const ThresholdKeyProvider = ({ children, network = "mainnet", enableLogging = false, apiKey }: ThresholdKeyProviderProps) => {
  const { imployApiClient, thresholdKeyLogin, logout } = useImployApi()
  const { provider, isReady, checkIsReady, address } = useWeb3()
  const [userInfo, setUserInfo] = useState<TorusLoginResponse | undefined>()
  const [TKeySdk, setTKeySdk] = useState<ThresholdKey | undefined>()
  const [keyDetails, setKeyDetails] = useState<KeyDetails | undefined>()
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false)
  const [isNewKey, setIsNewKey] = useState<boolean>(false)
  const [publicKey, setPublicKey] = useState<string | undefined>()
  const [shouldInitializeAccount,setShouldInitializeAccount] = useState<boolean>(false)
  const [pendingShareTransferRequests, setPendingShareTransferRequests] = useState<ShareTransferRequest[]>([])
  const [privateKey, setPrivateKey] = useState<string | undefined>()

  // Initialize Threshold Key and DirectAuth
  useEffect(() => {
    const init = async () => {
      const tkeySerialized = sessionStorage.getItem(TKEY_STORE_KEY)
      const postboxKey = sessionStorage.getItem(TORUS_POSTBOX_KEY)
      const cachedUserInfo = sessionStorage.getItem(TORUS_USERINFO_KEY)
      const modules = {
        [SECURITY_QUESTIONS_MODULE_NAME]: new SecurityQuestionsModule(),
        [WEB_STORAGE_MODULE_NAME]: new WebStorageModule(),
        [SHARE_TRANSFER_MODULE_NAME]: new ShareTransferModule(),
        [SHARE_SERIALIZATION_MODULE_NAME]: new ShareSerializationModule()
      }
      let tkey: ThresholdKey

      // If Session storage contains all the data necessary to recreate the TKey object
      if (postboxKey && tkeySerialized && cachedUserInfo) {
        const tKeyJson = JSON.parse(tkeySerialized)
        const serviceProvider = new ServiceProviderBase({ enableLogging, postboxKey })
        const storageLayer = new TorusStorageLayer({ serviceProvider, enableLogging,hostUrl: "https://metadata.tor.us" })
        tkey = await ThresholdKey.fromJSON(tKeyJson, { modules, serviceProvider, storageLayer })
        
        if (tKeyJson.modules) {
          if (tKeyJson.modules[WEB_STORAGE_MODULE_NAME])
            (tkey.modules[WEB_STORAGE_MODULE_NAME] as WebStorageModule).canUseFileStorage =
              tKeyJson.modules[WEB_STORAGE_MODULE_NAME].canUseFileStorage

          if (tkey.modules[SHARE_TRANSFER_MODULE_NAME])
            (tkey.modules[
              SHARE_TRANSFER_MODULE_NAME
            ] as ShareTransferModule).setRequestStatusCheckInterval(5000)
        }
        const keyDetails = tkey.getKeyDetails()
        setKeyDetails(keyDetails)
        setUserInfo(JSON.parse(cachedUserInfo))
      } else {
        // If no session storage is available, instantiate a new Threshold key
        // The user will be required to log in to the respective service 
        tkey = new ThresholdKey({
          modules,
          directParams: {
            baseUrl: `${window.location.origin}/serviceworker`,
            network: network,
            enableLogging: enableLogging,
            apiKey: apiKey
          },
          enableLogging: enableLogging
        })

        const serviceProvider = (tkey.serviceProvider as unknown) as DirectAuthSdk
        await serviceProvider.init({ skipSw: false })
      }
      setTKeySdk(tkey)
    }
    init()
    // eslint-disable-next-line
  }, [])

  // Session storage
  useEffect(() => {
    if (TKeySdk && keyDetails && keyDetails?.requiredShares <= 0 && userInfo) {
      sessionStorage.setItem(TKEY_STORE_KEY, JSON.stringify(TKeySdk.toJSON()))
      sessionStorage.setItem(TORUS_USERINFO_KEY, JSON.stringify(userInfo))
    }
  }, [TKeySdk, keyDetails, userInfo])

  // Reconstruct Key effect
  useEffect(() => {
    const reconstructKey = async () => {
      if (!TKeySdk) return
      console.log("Minimum number of shares is reached, reconstructing key")
      try {
        const { privKey } = await TKeySdk.reconstructKey(false)
        const privKeyString = privKey.toString("hex")
        if (privKeyString.length === 63) {
          setPrivateKey(`0${privKeyString}`)
        } else {
          setPrivateKey(privKeyString)
        }
      } catch (error) {
        // Under certain circumstances (approval of login on another device) the metadata
        // cached may be stale, resulting in a failure to reconstruct the key. This is 
        // identified through the nonce. Manually refreshing the metadata cache solves this problem
        if (error.message.includes("nonce")) {
          await TKeySdk.updateMetadata()
          const { privKey } = await TKeySdk.reconstructKey(false)
          const privKeyString = privKey.toString("hex")
          if (privKeyString.length === 63) {
            setPrivateKey(`0${privKeyString}`)
          } else {
            setPrivateKey(privKeyString)
          }
        } else {
          console.log(error)
          return
        }
      }
      const shareTransferModule = TKeySdk?.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
      await shareTransferModule.cancelRequestStatusCheck()
      if (shareTransferModule.currentEncKey) {
        const pubKeyEC = getPubKeyEC(shareTransferModule.currentEncKey)
        const encPubKeyX = pubKeyEC.getX().toString("hex")        
        await shareTransferModule.deleteShareTransferStore(encPubKeyX)
      }
    }

    if (keyDetails && keyDetails.requiredShares <= 0 && !privateKey) {
      reconstructKey()
    }
  }, [keyDetails, TKeySdk, privateKey])

  // Ensure API client is logged in
  useEffect(() => {
    const loginWithThresholdKey = async () => {
      const { token } = await imployApiClient.getWeb3Token()
      if (token && privateKey && userInfo) {
        const pubKey = EthCrypto.publicKeyByPrivateKey(privateKey)
        setPublicKey(pubKey)
        const wallet = new Wallet(privateKey)
        const signature = await wallet.signMessage(token)
        await thresholdKeyLogin(
          signature, 
          token, 
          (userInfo.userInfo.typeOfLogin === "jwt") ? 
            "web3" : 
            userInfo.userInfo.typeOfLogin as TKeyRequestIdentity_provider, 
          userInfo.userInfo.idToken || userInfo.userInfo.accessToken,
          `0x${EthCrypto.publicKey.compress(pubKey)}`
        )
      }
    }

    if (privateKey) {
      console.log("logging in using tkey")
      loginWithThresholdKey()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privateKey])

  // Share Transfer poller
  useEffect(() => {
    const handler = async () => {
      if (TKeySdk) {
        const shareTransferModule = TKeySdk.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
        const latestShareTransferStore = await shareTransferModule.getShareTransferStore()

        const pendingRequests = Object.keys(latestShareTransferStore).reduce(
          (acc: Array<ShareTransferRequest>, x) => {
            const browserDetail = bowser.parse(latestShareTransferStore[x].userAgent)

            if (!latestShareTransferStore[x].encShareInTransit)
              acc.push({
                ...latestShareTransferStore[x],
                browserDetail,
                encPubKeyX: x
              })
            return acc
          },
          []
        )
        setPendingShareTransferRequests(pendingRequests)
      }
    }

    let poller: number
    if (TKeySdk && keyDetails && keyDetails.requiredShares <= 0) {
      handler()
      poller = setInterval(handler, 5000)
    }
    return () => {
      poller && clearInterval(poller)
    }
  }, [TKeySdk, keyDetails])

  // Initiate request for share transfer if not enough shares
  useEffect(() => {
    const handler = async () => {
      if (!TKeySdk) return
      // Generate share transfer request
      const shareTransferModule = TKeySdk.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
      console.log("Creating a Share Transfer request")
      const currentEncPubKeyX = await shareTransferModule.requestNewShare(window.navigator.userAgent, TKeySdk.getCurrentShareIndexes())
      console.log("Share transfer request created. Starting request status poller")

      await shareTransferModule.startRequestStatusCheck(currentEncPubKeyX, true)
      const resultKey = await TKeySdk.getKeyDetails()
      setKeyDetails(resultKey)
    }

    if (keyDetails && keyDetails.requiredShares > 0) {
      handler()
    }
  }, [TKeySdk, keyDetails])

  const login = async (loginType: LOGIN_TYPE | "web3") => {
    if (!TKeySdk) return
    try {
      const serviceProvider = (TKeySdk.serviceProvider as unknown) as DirectAuthSdk
      switch (loginType) {
      case "google": {
        const googleResult = await serviceProvider.triggerLogin({
          typeOfLogin: "google",
          verifier: process.env.REACT_APP_GOOGLE_VERIFIER_NAME || "",
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || ""
        })
        setUserInfo(googleResult)
        break
      }
      case "facebook": {
        const fbResult = await serviceProvider.triggerLogin({
          typeOfLogin: "facebook",
          verifier: process.env.REACT_APP_FACEBOOK_VERIFIER_NAME || "",
          clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || ""
        })
        setUserInfo(fbResult)
        break
      }
      case "github": {
        const ghResult = await serviceProvider.triggerLogin({
          typeOfLogin: "github",
          verifier: process.env.REACT_APP_GITHUB_VERIFIER_NAME || "",
          clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "",
          jwtParams: {
            domain: process.env.REACT_APP_AUTH0_DOMAIN || ""
          }
        })
        setUserInfo(ghResult)
        break
      }
      case "web3":{
        if (!provider) break

        if (!isReady || !address) {
          const connected = await checkIsReady()
          if (!connected || !address) break
        }

        const { token } = await imployApiClient.getIdentityWeb3Token(address)

        if (token) {
          const signature = await signMessage(token, provider.getSigner())
          const result = await imployApiClient.postIdentityWeb3Token({
            signature: signature,
            token: token,
            public_address: address
          })
          const directAuthSdk = (serviceProvider as any).directWeb as DirectAuthSdk

          const torusKey = await directAuthSdk.getTorusKey(
            process.env.REACT_APP_FILES_VERIFIER_NAME || "",
            address,
            { verifier_id: address },
            result.token || ""
          )
          TKeySdk.serviceProvider.postboxKey = new BN(torusKey.privateKey, "hex")
          const loginResponse: TorusLoginResponse = {
            privateKey: torusKey.privateKey,
            publicAddress: torusKey.publicAddress,
            metadataNonce: "",
            userInfo: {
              idToken: result.token,
              email: "",
              name: "",
              profileImage: "",
              verifier: "",
              verifierId: "",
              typeOfLogin: "jwt",
              accessToken: "",
              state: {

              }
            }
          }
          setUserInfo(loginResponse)
        }
        break
      }
      default:
        break
      }
    } catch (error) {
      console.error("Error logging in")
      console.error(error)
      throw error
    }

    sessionStorage.setItem(TORUS_POSTBOX_KEY, TKeySdk.serviceProvider.postboxKey.toString("hex"))
    
    try {
      const metadata = await TKeySdk.storageLayer.getMetadata<ShareStore | {message: string}>({
        privKey: TKeySdk.serviceProvider.postboxKey
      })
      console.log("metadata", metadata)
      const keyNotFound = (metadata as {message: string}).message === "KEY_NOT_FOUND"
      if (keyNotFound) {
        console.log("New key")
        setIsNewKey(true)
        setShouldInitializeAccount(true)
        await TKeySdk.initialize()
        const resultKey = await TKeySdk.getKeyDetails()
        setKeyDetails(resultKey)
        const { privKey } = await TKeySdk.reconstructKey(false)
        console.log("privKey", privKey)
      } else {
        console.log("Existing key")
        await TKeySdk.initialize({ input: metadata as ShareStore })
        try {
          console.log("Trying to load device share")
          const storageModule = TKeySdk.modules[WEB_STORAGE_MODULE_NAME] as WebStorageModule
          await storageModule.inputShareFromWebStorage()
        } catch (error) {
          console.error("Error loading device share. If this is a new device please add it using one of your other recovery shares.")
          setIsNewDevice(true)
        }
        const resultKey = await TKeySdk.getKeyDetails()
        if (resultKey.threshold === resultKey.totalShares) {
          setShouldInitializeAccount(true)
        }
        setKeyDetails(resultKey)
      }
    } catch (error) {
      console.error(error)
      throw new Error("Threshold Key Error")
    }
  }

  const addPasswordShare = async (password: string) => {
    if (!TKeySdk) return

    try {
      const securityQuestionModule = TKeySdk.modules[SECURITY_QUESTIONS_MODULE_NAME] as SecurityQuestionsModule
      await securityQuestionModule.generateNewShareWithSecurityQuestions(
        password,
        "What is your password?"
      )
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
    } catch (e) {
      console.error(e)
    }
  }

  const addMnemonicShare = async () => {
    if (!TKeySdk) return Promise.reject("No TKey SDK")

    try {
      const shareCreated = await TKeySdk.generateNewShare()
      const requiredShareStore = shareCreated.newShareStores[shareCreated.newShareIndex.toString("hex")]
      const shareSerializationModule = (await TKeySdk.modules[SHARE_SERIALIZATION_MODULE_NAME]) as ShareSerializationModule
      const result = (await shareSerializationModule.serialize(
        requiredShareStore.share.share,
        "mnemonic"
      )) as string
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
      return result
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  const inputPasswordShare = async (password: string) => {
    if (!TKeySdk) return

    const securityQuestionModule = TKeySdk.modules[SECURITY_QUESTIONS_MODULE_NAME] as SecurityQuestionsModule
    try {
      await securityQuestionModule.inputShareFromSecurityQuestions(password)
    } catch (error) {
      throw new Error("Invalid share password entered")
    }
    const keyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(keyDetails)
  }

  const inputMnemonicShare = async (mnemonic: string) => {
    if (!TKeySdk) return

    try {
      const share = await ShareSerializationModule.deserializeMnemonic(mnemonic)
      await TKeySdk.inputShare(share)
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
    } catch (error) {
      throw new Error("Invalid mnemonic entered")
    }
  }

  const addNewDeviceShareAndSave = async () => {
    if (!TKeySdk) return

    try {
      const storageModule = TKeySdk.modules[WEB_STORAGE_MODULE_NAME] as WebStorageModule
      await TKeySdk.updateMetadata()
      const newDeviceShare = await TKeySdk.generateNewShare()
      const newDeviceShareStore = newDeviceShare.newShareStores[newDeviceShare.newShareIndex.toString("hex")]
  
      storageModule.storeDeviceShare(newDeviceShareStore)
      console.log("New device share added")
      setIsNewDevice(false)
      const newKeyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(newKeyDetails)
    } catch (e) {
      console.error(e)
    }
  }

  const approveShareTransferRequest = async (encPubKeyX: string) => {
    if (!TKeySdk) return
    
    try {
      const shareTransferModule = TKeySdk.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
      await shareTransferModule.approveRequest(encPubKeyX)
      await TKeySdk.syncShareMetadata()
      const newKeyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(newKeyDetails)
    } catch (e) {
      console.error(e)
    }
  }

  const rejectShareTransferRequest = async (encPubKey: string) => {
    if (!TKeySdk) return

    try {
      const shareTransferModule = TKeySdk.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
      await shareTransferModule.deleteShareTransferStore(encPubKey)
      await TKeySdk.syncShareMetadata()
    } catch (e) {
      console.error(e)
    }
  }

  const clearShareTransferRequests = async () => {
    if (!TKeySdk) return

    try {
      const shareTransferModule = TKeySdk.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
      await shareTransferModule.resetShareTransferStore()
      await TKeySdk.syncShareMetadata()
    } catch (e) {
      console.error(e)
    }
  }

  const encryptForPublicKey = async (publicKey: string, message: string) => {
    const messageCipher = await EthCrypto.encryptWithPublicKey(
      publicKey,
      message
    )
    return EthCrypto.cipher.stringify(messageCipher)
  }

  const decryptMessageWithThresholdKey = async (message: string) => {
    if (!privateKey) return

    try {
      const messageCipher = EthCrypto.cipher.parse(message)
      return EthCrypto.decryptWithPrivateKey(privateKey, messageCipher)
    } catch (error) {
      console.error("Error decrypting: ", message, privateKey)   
      return Promise.reject("Error decrypting")   
    }
  }

  const thresholdKeyLogout = async () => {
    sessionStorage.clear()
    setPrivateKey(undefined)
    setKeyDetails(undefined)
    setPublicKey(undefined)
    setUserInfo(undefined)
    clearShareTransferRequests()

    const tkey = new ThresholdKey({
      modules: {
        [SECURITY_QUESTIONS_MODULE_NAME]: new SecurityQuestionsModule(),
        [WEB_STORAGE_MODULE_NAME]: new WebStorageModule(true),
        [SHARE_TRANSFER_MODULE_NAME]: new ShareTransferModule()
      },
      directParams: {
        baseUrl: `${window.location.origin}/serviceworker`,
        network: network,
        enableLogging: enableLogging,
        apiKey: apiKey
      },
      enableLogging: enableLogging
    })

    const serviceProvider = (tkey.serviceProvider as unknown) as DirectAuthSdk
    await serviceProvider.init({ skipSw: false })
    setTKeySdk(tkey)
    logout()
  }

  return (
    <ThresholdKeyContext.Provider
      value={{
        userInfo,
        login,
        addPasswordShare,
        inputPasswordShare,
        inputMnemonicShare,
        keyDetails,
        addNewDeviceShareAndSave,
        isNewDevice,
        pendingShareTransferRequests,
        approveShareTransferRequest,
        rejectShareTransferRequest,
        isNewKey,
        addMnemonicShare,
        clearShareTransferRequests,
        resetIsNewDevice: () => setIsNewDevice(false),
        shouldInitializeAccount,
        resetShouldInitialize: () => setShouldInitializeAccount(false),
        publicKey,
        decryptMessageWithThresholdKey,
        encryptForPublicKey,
        logout: thresholdKeyLogout
      }}
    >
      {!isNewDevice && pendingShareTransferRequests.length > 0 && (
        <ShareTransferRequestModal
          requests={pendingShareTransferRequests}
        />
      )}
      {children}
    </ThresholdKeyContext.Provider>
  )
}

function useThresholdKey() {
  const context = React.useContext(ThresholdKeyContext)
  if (context === undefined) {
    throw new Error("useTKey must be used within a tKeyProvider")
  }
  return context
}

export { ThresholdKeyProvider, useThresholdKey }
