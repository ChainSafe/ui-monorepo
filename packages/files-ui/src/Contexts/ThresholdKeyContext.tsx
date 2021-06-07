import React, { useState, useEffect, useMemo, useCallback } from "react"
import DirectAuthSdk, { createHandler, ILoginHandler, LOGIN_TYPE, TorusLoginResponse } from "@toruslabs/torus-direct-web-sdk"
import ThresholdKey from "@tkey/default"
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage"
import SecurityQuestionsModule, { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import { KeyDetails, ShareStore, getPubKeyEC } from "@tkey/common-types"
import ShareTransferModule, { SHARE_TRANSFER_MODULE_NAME } from "@tkey/share-transfer"
import ShareSerializationModule, { SHARE_SERIALIZATION_MODULE_NAME } from "@tkey/share-serialization"
import { ServiceProviderBase } from "@tkey/service-provider-base"
import { TorusStorageLayer } from "@tkey/storage-layer-torus"
import bowser from "bowser"
import { useFilesApi } from "../Contexts/FilesApiContext"
import { utils, Wallet } from "ethers"
import EthCrypto from "eth-crypto"
import { useWeb3 } from "@chainsafe/web3-context"
import ShareTransferRequestModal from "../Components/Elements/ShareTransferRequestModal"
import BN from "bn.js"
import { IdentityProvider } from "@chainsafe/files-api-client"
import { capitalize, centerEllipsis } from "../Utils/Helpers"
import { t } from "@lingui/macro"
import jwtDecode from "jwt-decode"
import { IdentityToken } from "@chainsafe/files-api-client"
import dayjs from "dayjs"

const TORUS_POSTBOX_KEY = "csf.postboxKey"
const TKEY_STORE_KEY = "csf.tkeyStore"
const TORUS_USERINFO_KEY = "csf.userInfo"
const PASSWORD_QUESTION = "What is your password?"

export type ThresholdKeyContextStatus = "initializing"|"initialized"|"awaiting confirmation"|"logging in"|"done"
export type BrowserShare = {
  shareIndex: string
  module: string
  userAgent: string
  dateAdded: number
} & Bowser.Parser.ParsedResult

export type TThresholdKeyContext = {
  userInfo?: TorusLoginResponse
  keyDetails?: KeyDetails
  publicKey?: string
  isNewDevice: boolean
  isNewKey: boolean
  browserShares: BrowserShare[]
  hasMnemonicShare: boolean
  hasPasswordShare: boolean
  shouldInitializeAccount: boolean
  pendingShareTransferRequests: ShareTransferRequest[]
  login(loginType: IdentityProvider, tokenInfo?: {token: string; email: string}): Promise<void>
  resetIsNewDevice(): void
  resetShouldInitialize(): void
  addPasswordShare(password: string): Promise<void>
  changePasswordShare(password: string): Promise<void>
  inputPasswordShare(password: string): Promise<void>
  inputMnemonicShare(mnemonic: string): Promise<void>
  addNewDeviceShareAndSave(): Promise<void>
  deleteShare(shareIndex: string): Promise<void>
  approveShareTransferRequest(encPubKeyX: string): Promise<void>
  rejectShareTransferRequest(encPubKeyX: string): Promise<void>
  clearShareTransferRequests(): Promise<void>
  addMnemonicShare(): Promise<string>
  getSerializedDeviceShare(shareIndex: string): Promise<string | undefined>
  encryptForPublicKey(publicKey: string, message: string): Promise<string>
  decryptMessageWithThresholdKey(message: string): Promise<string | undefined>
  logout(): Promise<void>
  status: ThresholdKeyContextStatus
  resetStatus(): void
  getAvailableShareIndices(): string[] | undefined
  refreshTKeyMeta(): Promise<void>
  loggedinAs: string
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
const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true"

const getProviderSpecificParams = (loginType: LOGIN_TYPE):
  {typeOfLogin: LOGIN_TYPE; clientId: string; verifier: string; jwtParams?: any} => {
  switch (loginType) {
  case "google": {
    return {
      typeOfLogin: loginType,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
      verifier: "chainsafe-uuid-testnet"
    }
  }
  case "facebook": {
    return {
      typeOfLogin: loginType,
      clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || "",
      verifier: "chainsafe-uuid-testnet"
    }
  }
  case "github":{
    return {
      typeOfLogin: loginType,
      clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "",
      verifier: "chainsafe-uuid-testnet",
      jwtParams: {
        domain: process.env.REACT_APP_AUTH0_DOMAIN || ""
      }
    }
  }
  default:{
    throw new Error(`${loginType} is unsupported`)
  }
  }
}

const ThresholdKeyProvider = ({ children, network = "mainnet", enableLogging = false, apiKey }: ThresholdKeyProviderProps) => {
  const { filesApiClient, thresholdKeyLogin, logout } = useFilesApi()
  const { provider, isReady, checkIsReady, address } = useWeb3()
  const [userInfo, setUserInfo] = useState<TorusLoginResponse | undefined>()
  const [TKeySdk, setTKeySdk] = useState<ThresholdKey | undefined>()
  const [keyDetails, setKeyDetails] = useState<KeyDetails | undefined>()
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false)
  const [isNewKey, setIsNewKey] = useState<boolean>(false)
  const [publicKey, setPublicKey] = useState<string | undefined>()
  const [shouldInitializeAccount, setShouldInitializeAccount] = useState<boolean>(false)
  const [pendingShareTransferRequests, setPendingShareTransferRequests] = useState<ShareTransferRequest[]>([])
  const [privateKey, setPrivateKey] = useState<string | undefined>()
  const [status, setStatus] = useState<ThresholdKeyContextStatus>("initializing")
  const [loggedinAs, setLoggedinAs] = useState("")
  const securityQuestionModule = useMemo(
    () => TKeySdk?.modules[SECURITY_QUESTIONS_MODULE_NAME] as SecurityQuestionsModule | undefined
    , [TKeySdk]
  )
  // `shares` object contains security question and local device shares
  // The service provider share as well as backup mnemonic do not appear in this share 
  // array. Note: Files accounts have one service provider by default.
  // If an account has totalShares - shares.length === 1 this indicates that a
  // mnemonic has not been set up for the account. If totalShares - shares.length === 2
  // this indicates that a mnemonic has already been set up. "2" corresponds here to one
  // service provider (default), and one mnemonic.
  const parsedShares = useMemo(() => keyDetails
    ? Object.keys(keyDetails.shareDescriptions).map((shareIndex) => (
      {
        shareIndex: shareIndex,
        ...JSON.parse(keyDetails.shareDescriptions[shareIndex][0])
      }
    ))
    : []
  , [keyDetails])

  const browserShares = useMemo(() => parsedShares.filter((s) => s.module === WEB_STORAGE_MODULE_NAME).map(bs => ({
    ...bs,
    ...bowser.parse(bs.userAgent)
  } as BrowserShare)), [parsedShares])
  const hasMnemonicShare = useMemo(() => (keyDetails && (keyDetails.totalShares - parsedShares.length > 1)) || false,
    [keyDetails, parsedShares.length])
  const hasPasswordShare = useMemo(() => parsedShares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0,
    [parsedShares])

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
      if (postboxKey && tkeySerialized && cachedUserInfo && !maintenanceMode) {
        setStatus("logging in")
        const tKeyJson = JSON.parse(tkeySerialized)
        const serviceProvider = new ServiceProviderBase({ enableLogging, postboxKey })
        const storageLayer = new TorusStorageLayer({ serviceProvider, enableLogging, hostUrl: "https://metadata.tor.us" })
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
        if (keyDetails.threshold === keyDetails.totalShares) {
          setShouldInitializeAccount(true)
        }
        setUserInfo(JSON.parse(cachedUserInfo))
        setStatus("done")
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

        await serviceProvider.init({ skipSw: false }).then(() => {
          console.log("initialized")
          setStatus("initialized")
        }).catch(() => "error initializing")
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
        if (privKeyString.length < 64) {
          setPrivateKey(utils.hexZeroPad(`0x${privKeyString}`, 32).substr(2))
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
          if (privKeyString.length < 64) {
            setPrivateKey(utils.hexZeroPad(`0x${privKeyString}`, 32).substr(2))
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
      if (!userInfo) return
      const decodedIdToken = jwtDecode<{exp: number}>(userInfo.userInfo.idToken || "")
      if (privateKey && dayjs.unix(decodedIdToken.exp).isAfter(dayjs())) {
        const pubKey = EthCrypto.publicKeyByPrivateKey(privateKey)
        setPublicKey(pubKey)
        const wallet = new Wallet(privateKey)
        const signature = await wallet.signMessage(userInfo.userInfo.idToken || "")
        await thresholdKeyLogin(
          signature,
          userInfo.userInfo.idToken || "",
          `0x${EthCrypto.publicKey.compress(pubKey)}`
        )
        setStatus("done")
      } else {
        console.error("Service Identity Token is expired.")
        thresholdKeyLogout()
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

        if(pendingShareTransferRequests.length !== pendingRequests.length){
          setPendingShareTransferRequests(pendingRequests)
        }
      }
    }

    let poller: NodeJS.Timeout
    if (TKeySdk && keyDetails && keyDetails.requiredShares <= 0) {
      handler()
      poller = setInterval(handler, 5000)
    }
    return () => {
      poller && clearInterval(poller)
    }
  }, [TKeySdk, keyDetails, pendingShareTransferRequests.length])

  // Initiate request for share transfer if not enough shares
  useEffect(() => {
    if (!TKeySdk) return
    const shareTransferModule = TKeySdk?.modules[SHARE_TRANSFER_MODULE_NAME] as ShareTransferModule
    let shareEncPubKeyX: string | undefined
    const createShareTransferRequest = async () => {
      try {
        console.log("Creating a Share Transfer request")
        const currentEncPubKeyX = await shareTransferModule.requestNewShare(window.navigator.userAgent, TKeySdk?.getCurrentShareIndexes())
        console.log("Share transfer request created. Starting request status poller")
        shareEncPubKeyX = currentEncPubKeyX
        await shareTransferModule.startRequestStatusCheck(currentEncPubKeyX, true)
        const resultKey = await TKeySdk?.getKeyDetails()
        setKeyDetails(resultKey)
        shareEncPubKeyX = undefined
      } catch (error) {
        console.error(error)
      }
    }

    if (keyDetails && keyDetails.requiredShares > 0) {
      createShareTransferRequest()
    }

    return () => {
      if (shareEncPubKeyX && shareTransferModule) {
        shareTransferModule.cancelRequestStatusCheck()
        shareTransferModule.deleteShareTransferStore(shareEncPubKeyX)
      }
    }
  }, [TKeySdk, keyDetails])

  useEffect(() => {
    const loginType = userInfo?.userInfo.typeOfLogin

    if (userInfo && loginType) {
      switch (loginType) {
      case "jwt":
        setLoggedinAs(t`Web3: ${centerEllipsis(String(address), 4)}`)
        break
      case "facebook":
      case "google":
      case "github":
        setLoggedinAs(`${capitalize(loginType)}: ${centerEllipsis(userInfo.userInfo.email, 4)}`)
        break
      default:
        setLoggedinAs(`${centerEllipsis(userInfo.publicAddress, 4)}`)
        break
      }
    }
  }, [userInfo, address])

  const login = async (loginType: IdentityProvider, tokenInfo?: {token: string; email: string}) => {
    if (!TKeySdk || maintenanceMode) return
    try {
      setStatus("awaiting confirmation")
      const { identityToken, userInfo } = await getIdentityToken(loginType, tokenInfo)
      const decodedToken = jwtDecode<{ uuid: string; address: string }>(identityToken.token || "")
      const directAuthSdk = (TKeySdk.serviceProvider as any).directWeb as DirectAuthSdk
      const torusKey = await directAuthSdk.getTorusKey(
        process.env.REACT_APP_FILES_UUID_VERIFIER_NAME || "",
        decodedToken.uuid,
        { verifier_id: decodedToken.uuid },
        identityToken.token || ""
      )
      TKeySdk.serviceProvider.postboxKey = new BN(torusKey.privateKey, "hex")

      const loginResponse: TorusLoginResponse = {
        privateKey: torusKey.privateKey,
        publicAddress: torusKey.publicAddress,
        metadataNonce: "",
        userInfo: {
          idToken: identityToken.token,
          email: userInfo?.email,
          name: userInfo?.name,
          profileImage: userInfo?.profileImage,
          verifier: "",
          verifierId: (loginType === "web3") ? address || "" : decodedToken.uuid,
          typeOfLogin: loginType !== "web3" && loginType !== "email" ? loginType : "jwt",
          accessToken: userInfo?.accessToken,
          state: { }
        }
      }
      setUserInfo(loginResponse)
    } catch (error) {
      console.error("Error logging in", error)
      throw error
    }

    sessionStorage.setItem(TORUS_POSTBOX_KEY, TKeySdk.serviceProvider.postboxKey.toString("hex"))
    setStatus("logging in")
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
        }
        const resultKey = await TKeySdk.getKeyDetails()
        if (resultKey.threshold === resultKey.totalShares) {
          setShouldInitializeAccount(true)
        }
        if (resultKey.requiredShares > 0) {
          setIsNewDevice(true)
        }
        setKeyDetails(resultKey)
      }
    } catch (error) {
      console.error(error)
      throw new Error("Threshold Key Error")
    }
  }

  const getIdentityToken = async (
    loginType: IdentityProvider,
    tokenInfo?: {token: string; email: string}
  ): Promise<{identityToken: IdentityToken; userInfo: any}> => {
    if (loginType === "email") {
      const uuidToken = await filesApiClient.generateServiceIdentityToken({
        identity_provider: loginType,
        identity_token: tokenInfo?.token || ""
      })
      return {
        identityToken: uuidToken,
        userInfo: { email: tokenInfo?.email }
      }
    }
    if (loginType === "web3") {

      let addressToUse = address
      let signer

      if (!isReady  || !provider) {
        const connected = await checkIsReady()

        if (!connected || !provider) throw new Error("Unable to connect to wallet.")
      }

      if(!signer){
        signer = provider.getSigner()
        if (!signer) throw new Error("Signer undefined")
      }

      if(!addressToUse){
        // checkIsReady above doesn't make sure that the address is defined
        // we pull the address here to have it defined for sure
        addressToUse = await signer.getAddress()
      }

      const { token } = await filesApiClient.getIdentityWeb3Token(addressToUse)

      if (!token) throw new Error("Token undefined")

      setStatus("awaiting confirmation")
      const signature = await signer.signMessage(token)
      setStatus("logging in")
      const web3IdentityToken = await filesApiClient.postIdentityWeb3Token({
        signature: signature,
        token: token,
        public_address: addressToUse
      })
      const uuidToken = await filesApiClient.generateServiceIdentityToken({
        identity_provider: loginType,
        identity_token: web3IdentityToken.token || ""
      })
      return {
        identityToken: uuidToken,
        userInfo: { address: addressToUse }
      }

    } else {
      const providerSpecificHandlerProps = getProviderSpecificParams(loginType)

      const loginHandler: ILoginHandler = createHandler({
        ...providerSpecificHandlerProps,
        redirect_uri: `${window.location.origin}/serviceworker/redirect`,
        redirectToOpener: false,
        uxMode: "popup",
        customState: {}
      })
      setStatus("awaiting confirmation")
      const oauthIdToken = await loginHandler.handleLoginWindow({})
      setStatus("logging in")
      const userInfo = await loginHandler.getUserInfo(oauthIdToken)
      const uuidToken = await filesApiClient.generateServiceIdentityToken({
        identity_provider: loginType,
        identity_token: oauthIdToken.idToken || oauthIdToken.accessToken
      })
      return { identityToken: uuidToken, userInfo: userInfo }
    }
  }

  const addPasswordShare = async (password: string) => {
    if (!TKeySdk || !securityQuestionModule) return

    try {
      await securityQuestionModule.generateNewShareWithSecurityQuestions(
        password,
        PASSWORD_QUESTION
      )
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
    } catch (e) {
      console.error(e)
    }
  }

  const changePasswordShare = async (password: string) => {
    if (!TKeySdk || !securityQuestionModule) return

    try {
      await securityQuestionModule.changeSecurityQuestionAndAnswer(
        password,
        PASSWORD_QUESTION
      )
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
    } catch (e) {
      console.error("Oops", e)
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
      return ""
    }
  }

  const inputPasswordShare = async (password: string) => {
    if (!TKeySdk || !securityQuestionModule) return

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

      await storageModule.storeDeviceShare(newDeviceShareStore)
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

  const deleteShare = async (shareIndex: string) => {
    if (!TKeySdk) return
    try {
      await TKeySdk.deleteShare(shareIndex)
      const newKeyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(newKeyDetails)
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }

  const getSerializedDeviceShare = async (shareIndex: string) => {
    if (!TKeySdk) return
    try {
      return await TKeySdk.outputShare(shareIndex, "mnemonic") as string
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }

  const getAvailableShareIndices = () => {
    if (!TKeySdk) return

    const pubPoly = TKeySdk.metadata.getLatestPublicPolynomial()
    const polyId = pubPoly.getPolynomialID()
    const shareStoreMap = TKeySdk.shares[polyId]
    return Object.keys(shareStoreMap)
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
    setShouldInitializeAccount(false)
    setStatus("initializing")

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
    return serviceProvider.init({ skipSw: false })
      .then(() => {
        setStatus("initialized")
      })
      .catch((e) => console.error("error initializing", e))
      .finally(() => {
        setTKeySdk(tkey)
        logout()
      })
  }

  const refreshTKeyMeta = useCallback(async () => {
    if (!TKeySdk) return
    try {
      await TKeySdk.syncShareMetadata()
      const newKeyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(newKeyDetails)
      return
    } catch (error) {
      if (error.message.includes("nonce")) {
        await TKeySdk.updateMetadata()
        await TKeySdk.syncShareMetadata()
        const newKeyDetails = await TKeySdk.getKeyDetails()
        setKeyDetails(newKeyDetails)
      } else {
        console.error("Error refreshing share metadata: ", error)
      }
      return
    }
  }, [TKeySdk])

  return (
    <ThresholdKeyContext.Provider
      value={{
        userInfo,
        login,
        addPasswordShare,
        changePasswordShare,
        inputPasswordShare,
        inputMnemonicShare,
        keyDetails,
        addNewDeviceShareAndSave,
        deleteShare,
        getSerializedDeviceShare,
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
        logout: thresholdKeyLogout,
        browserShares,
        hasMnemonicShare,
        hasPasswordShare,
        status,
        resetStatus: () => setStatus("initialized"),
        getAvailableShareIndices,
        refreshTKeyMeta,
        loggedinAs
      }}
    >
      {!isNewDevice && pendingShareTransferRequests.length > 0 && process.env.REACT_APP_TEST !== "true" && (
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
