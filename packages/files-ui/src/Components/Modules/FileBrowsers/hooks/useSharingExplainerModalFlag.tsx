import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { useCallback } from "react"
import { useEffect, useState } from "react"

export const DISMISSED_SHARING_EXPLAINER_KEY = "csf.dismissedSharingExplainer"

export const useSharingExplainerModalFlag = () => {
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const [hasSeenSharingExplainerModal, setHasSeenSharingExplainerModal] = useState(false)
  const dismissedFlag = localStorageGet(DISMISSED_SHARING_EXPLAINER_KEY)

  useEffect(() => {
    if (dismissedFlag === "false"){
      setHasSeenSharingExplainerModal(true)
    } else if (dismissedFlag === null) {
      // the dismiss flag was never set
      localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "false")
      setHasSeenSharingExplainerModal(true)
    }
  }, [dismissedFlag, localStorageSet])

  const hideModal = useCallback(() => {
    localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "true")
    setHasSeenSharingExplainerModal(false)
  }, [localStorageSet])

  return { hasSeenSharingExplainerModal, hideModal }
}