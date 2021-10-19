import { useCallback } from "react"
import { useEffect, useState } from "react"
import { useUser } from "../../../../Contexts/UserContext"

export const DISMISSED_SHARING_EXPLAINER_KEY = "csf.dismissedSharingExplainer"

export const useSharingExplainerModalFlag = () => {
  const { localStore, setLocalStore } = useUser()
  const [hasSeenSharingExplainerModal, setHasSeenSharingExplainerModal] = useState(false)
  const dismissedFlag = localStore ? localStore[DISMISSED_SHARING_EXPLAINER_KEY] : null

  useEffect(() => {
    if (dismissedFlag === "false"){
      setHasSeenSharingExplainerModal(true)
    } else if (dismissedFlag === null) {
      // the dismiss flag was never set
      setLocalStore({ [DISMISSED_SHARING_EXPLAINER_KEY]: "false" }, "update")
      setHasSeenSharingExplainerModal(true)
    }
  }, [dismissedFlag, setLocalStore])

  const hideModal = useCallback(() => {
    setLocalStore({ [DISMISSED_SHARING_EXPLAINER_KEY]: "true" }, "update")
    setHasSeenSharingExplainerModal(false)
  }, [setLocalStore])

  return { hasSeenSharingExplainerModal, hideModal }
}