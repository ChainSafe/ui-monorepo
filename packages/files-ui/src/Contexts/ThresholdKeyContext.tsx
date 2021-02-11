import React, { useState, useEffect } from "react"
import { LOGIN_TYPE, TorusLoginResponse } from "@toruslabs/torus-direct-web-sdk"
import ThresholdKey from "@tkey/default" // or "@tkey/default"
import WebStorageModule, { WEB_STORAGE_MODULE_NAME } from "@tkey/web-storage"
import SecurityQuestionsModule, {
  SECURITY_QUESTIONS_MODULE_NAME,
} from "@tkey/security-questions"
import { IMetadata, KeyDetails } from "@tkey/common-types"
import ShareTransferModule, {
  SHARE_TRANSFER_MODULE_NAME,
} from "@tkey/share-transfer"
import ShareSerializationModule, {
  SHARE_SERIALIZATION_MODULE_NAME,
} from "@tkey/share-serialization"
import bowser from "bowser"

export type TThresholdKeyContext = {
  userInfo?: TorusLoginResponse
  keyDetails?: KeyDetails
  isNewDevice: boolean
  resetIsNewDevice(): void
  isNewKey: boolean
  shouldInitializeAccount: boolean
  resetShouldInitialize(): void
  pendingShareTransferRequests: ShareTransferRequest[]
  login(loginType: LOGIN_TYPE): Promise<void>
  addPasswordShare(password: string): Promise<void>
  inputPasswordShare(password: string): Promise<void>
  inputMnemonicShare(mnemonic: string): Promise<void>
  addNewDeviceShareAndSave(useFileStorage: boolean): Promise<void>
  approveShareTransferRequest(encPubKeyX: string): Promise<void>
  clearShareTransferRequests(): Promise<void>
  addMnemonicShare(): Promise<string>
}

type ThresholdKeyProviderProps = {
  children: React.ReactNode | React.ReactNode[]
  network?: "testnet" | "mainnet"
  enableLogging?: boolean
  apiKey?: string
}

type ShareTransferRequest = {
  availableShareIndexes: Array<string>
  browserDetail: bowser.Parser.ParsedResult
  encPubKey: any
  encPubKeyX: string
  timestamp: number
  userAgent: string
}

const ThresholdKeyContext = React.createContext<
  TThresholdKeyContext | undefined
>(undefined)

const ThresholdKeyProvider = ({
  children,
  network = "mainnet",
  enableLogging = false,
  apiKey,
}: ThresholdKeyProviderProps) => {
  const [userInfo, setUserInfo] = useState<TorusLoginResponse | undefined>()
  const [TKeySdk, setTKeySdk] = useState<ThresholdKey | undefined>()
  const [keyDetails, setKeyDetails] = useState<KeyDetails | undefined>()
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false)
  const [isNewKey, setIsNewKey] = useState<boolean>(false)
  const [
    shouldInitializeAccount,
    setShouldInitializeAccount,
  ] = useState<boolean>(false)
  const [skipMinThreshold, setSkipMinThreshold] = useState<boolean>(false)
  const [
    pendingShareTransferRequests,
    setPendingShareTransferRequests,
  ] = useState<ShareTransferRequest[]>([])

  // Initialize Threshold Key and DirectAuth
  useEffect(() => {
    const init = async () => {
      const tkey = new ThresholdKey({
        modules: {
          [SECURITY_QUESTIONS_MODULE_NAME]: new SecurityQuestionsModule(),
          [WEB_STORAGE_MODULE_NAME]: new WebStorageModule(true),
          [SHARE_TRANSFER_MODULE_NAME]: new ShareTransferModule(),
        },
        directParams: {
          baseUrl: `${window.location.origin}/serviceworker`,
          network: network,
          enableLogging: enableLogging,
          apiKey: apiKey,
        },
        enableLogging: enableLogging,
      })
      setTKeySdk(tkey)
      // @ts-ignore
      await tkey.serviceProvider.init({ skipSw: false })
    }
    init()
    // eslint-disable-next-line
  }, [])

  // Reconstruct Key effect
  useEffect(() => {
    const reconstructKey = async () => {
      console.log("Minimum number of shares is reached, reconstructing key")
      if (!TKeySdk) return
      try {
        const { privKey } = await TKeySdk.reconstructKey(false)
        console.log(privKey.toString("hex"))
        const shareTransferModule = TKeySdk?.modules[
          SHARE_TRANSFER_MODULE_NAME
        ] as ShareTransferModule
        await shareTransferModule.cancelRequestStatusCheck()
        return
      } catch (error) {
        if (error.message.includes("nonce")) {
          await TKeySdk.updateMetadata()
          const { privKey } = await TKeySdk.reconstructKey(false)
          console.log(privKey.toString("hex"))
          return
        } else {
          console.log(error)
        }
      }
    }

    if (keyDetails?.requiredShares === 0) {
      reconstructKey()
    }
  }, [keyDetails, TKeySdk])

  // Share Transfer poller
  useEffect(() => {
    const handler = async () => {
      if (TKeySdk) {
        console.log("Checking for new Transfer requests")
        const shareTransferModule = TKeySdk.modules[
          SHARE_TRANSFER_MODULE_NAME
        ] as ShareTransferModule

        const latestShareTransferStore = await shareTransferModule.getShareTransferStore()

        const pendingRequests = Object.keys(latestShareTransferStore).reduce(
          (acc: Array<ShareTransferRequest>, x) => {
            const browserDetail = bowser.parse(
              latestShareTransferStore[x].userAgent,
            )
            if (!latestShareTransferStore[x].encShareInTransit)
              acc.push({
                ...latestShareTransferStore[x],
                browserDetail,
                encPubKeyX: x,
              })
            return acc
          },
          [],
        )
        setPendingShareTransferRequests(pendingRequests)
      }
    }

    let poller: number
    if (keyDetails && keyDetails.requiredShares <= 0) {
      console.log("Key is reconstructed. Starting Share Transfer poller")
      handler()
      poller = setInterval(handler, 5000)
    }
    return () => {
      poller && clearInterval(poller)
    }
    // eslint-disable-next-line
  }, [keyDetails])

  // Initiate request for share transfer if not enough shares
  useEffect(() => {
    const handler = async () => {
      if (!TKeySdk) return
      // Generate share transfer request
      const shareTransferModule = TKeySdk.modules[
        SHARE_TRANSFER_MODULE_NAME
      ] as ShareTransferModule
      console.log("Creating a Share Transfer request")
      const currentEncPubKeyX = await shareTransferModule.requestNewShare(
        window.navigator.userAgent,
        TKeySdk.getCurrentShareIndexes(),
      )
      console.log(
        "Share transfer request created. Starting request status poller",
      )

      await shareTransferModule.startRequestStatusCheck(currentEncPubKeyX, true)
      const resultKey = await TKeySdk.getKeyDetails()
      console.log(resultKey)
      setKeyDetails(resultKey)
    }

    if (keyDetails && keyDetails.requiredShares > 0) {
      handler()
    }
  }, [keyDetails])

  const login = async (loginType: LOGIN_TYPE) => {
    if (!TKeySdk) return
    try {
      switch (loginType) {
        case "google":
          //@ts-ignore
          const googleResult = await TKeySdk.serviceProvider.triggerLogin({
            typeOfLogin: "google",
            verifier: process.env.REACT_APP_GOOGLE_VERIFIER_NAME,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          })
          setUserInfo(googleResult)
          break
        case "facebook":
          //@ts-ignore
          const fbResult = await TKeySdk.serviceProvider.triggerLogin({
            typeOfLogin: "facebook",
            verifier: process.env.REACT_APP_FACEBOOK_VERIFIER_NAME,
            clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
          })
          setUserInfo(fbResult)
          break
        case "github":
          //@ts-ignore
          const ghResult = await TKeySdk.serviceProvider.triggerLogin({
            typeOfLogin: "github",
            verifier: process.env.REACT_APP_GITHUB_VERIFIER_NAME,
            clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
            jwtParams: {
              domain: process.env.REACT_APP_AUTH0_DOMAIN,
            },
          })
          setUserInfo(ghResult)
          break
        default:
          break
      }
    } catch (error) {
      console.log("Error logging in")
      console.log(error)
      return
    }
    const metadata = await TKeySdk.storageLayer.getMetadata<IMetadata>({
      privKey: TKeySdk.serviceProvider.postboxKey,
    })
    console.log(metadata)
    //@ts-ignore
    const isNewKey = metadata.message === "KEY_NOT_FOUND"
    if (isNewKey) {
      console.log("New key")
      setIsNewKey(true)
      setShouldInitializeAccount(true)
      await TKeySdk.initialize()
      const resultKey = await TKeySdk.getKeyDetails()
      console.log(resultKey)
      setKeyDetails(resultKey)
      const { privKey } = await TKeySdk.reconstructKey(false)
      console.log(privKey)
    } else {
      console.log("Existing key")
      //@ts-ignore
      await TKeySdk.initialize({ input: metadata })
      try {
        console.log("Trying to load device share")
        const storageModule = TKeySdk.modules[
          WEB_STORAGE_MODULE_NAME
        ] as WebStorageModule
        await storageModule.inputShareFromWebStorage()
      } catch (error) {
        console.log(
          "Error loading device share. If this is a new device please add it using one of your other recovery shares.",
        )
        console.log(error)
        setIsNewDevice(true)
      }
      const resultKey = await TKeySdk.getKeyDetails()
      if (resultKey.threshold === resultKey.totalShares) {
        setShouldInitializeAccount(true)
      }
      console.log(resultKey)
      setKeyDetails(resultKey)
    }
  }

  const addPasswordShare = async (password: string) => {
    if (!TKeySdk) return
    const securityQuestionModule = TKeySdk.modules[
      SECURITY_QUESTIONS_MODULE_NAME
    ] as SecurityQuestionsModule
    await securityQuestionModule.generateNewShareWithSecurityQuestions(
      password,
      "What is your password?",
    )
    const keyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(keyDetails)
  }

  const addMnemonicShare = async () => {
    if (!TKeySdk) return Promise.reject("No TKey SDK")
    const shareCreated = await TKeySdk.generateNewShare()
    const requiredShareStore =
      shareCreated.newShareStores[shareCreated.newShareIndex.toString("hex")]
    // remember to include in initializtion modules
    const shareSerializationModule = (await TKeySdk.modules[
      SHARE_SERIALIZATION_MODULE_NAME
    ]) as ShareSerializationModule
    const result = (await shareSerializationModule.serialize(
      requiredShareStore.share.share,
      "mnemonic",
    )) as string
    const keyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(keyDetails)
    return result
  }

  const inputPasswordShare = async (password: string) => {
    if (!TKeySdk) return
    const securityQuestionModule = TKeySdk.modules[
      SECURITY_QUESTIONS_MODULE_NAME
    ] as SecurityQuestionsModule
    try {
      await securityQuestionModule.inputShareFromSecurityQuestions(password)
    } catch (error) {
      console.log("Invalid share password entered")
    }
    const keyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(keyDetails)
  }

  const inputMnemonicShare = async (mnemonic: string) => {
    if (!TKeySdk) return
    const shareSerializationModule = TKeySdk.modules[
      SHARE_SERIALIZATION_MODULE_NAME
    ] as ShareSerializationModule
    try {
      const share = await shareSerializationModule.deserializeMnemonic(mnemonic)
      await TKeySdk.inputShare(share)
      const keyDetails = await TKeySdk.getKeyDetails()
      setKeyDetails(keyDetails)
    } catch (error) {
      console.log("Invalid mnemonic entered")
    }
  }

  const addNewDeviceShareAndSave = async () => {
    if (!TKeySdk) return
    const storageModule = TKeySdk.modules[
      WEB_STORAGE_MODULE_NAME
    ] as WebStorageModule
    await TKeySdk.updateMetadata()
    const newDeviceShare = await TKeySdk.generateNewShare()
    const newDeviceShareStore =
      newDeviceShare.newShareStores[
        newDeviceShare.newShareIndex.toString("hex")
      ]

    storageModule.storeDeviceShare(newDeviceShareStore)
    storageModule.canUseFileStorage &&
      storageModule.storeDeviceShareOnFileStorage(newDeviceShare.newShareIndex)
    console.log("New device share added")
    setIsNewDevice(false)
    const newKeyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(newKeyDetails)
  }

  const approveShareTransferRequest = async (encPubKeyX: string) => {
    if (!TKeySdk) return

    const shareTransferModule = TKeySdk.modules[
      SHARE_TRANSFER_MODULE_NAME
    ] as ShareTransferModule
    await shareTransferModule.approveRequest(encPubKeyX)
    await TKeySdk.syncShareMetadata()
    const newKeyDetails = await TKeySdk.getKeyDetails()
    setKeyDetails(newKeyDetails)
  }

  const clearShareTransferRequests = async () => {
    if (!TKeySdk) return

    const shareTransferModule = TKeySdk.modules[
      SHARE_TRANSFER_MODULE_NAME
    ] as ShareTransferModule
    await shareTransferModule.resetShareTransferStore()
    await TKeySdk.syncShareMetadata()
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
        isNewKey,
        addMnemonicShare,
        clearShareTransferRequests,
        resetIsNewDevice: () => setIsNewDevice(false),
        shouldInitializeAccount,
        resetShouldInitialize: () => setShouldInitializeAccount(false),
      }}
    >
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
