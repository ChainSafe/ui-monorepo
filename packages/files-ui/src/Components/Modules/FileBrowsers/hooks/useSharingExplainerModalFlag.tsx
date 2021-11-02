import { useCallback } from "react"
import { useEffect, useState } from "react"
import { useUser } from "../../../../Contexts/UserContext"

export const DISMISSED_SHARING_EXPLAINER_KEY = "csf.dismissedSharingExplainer"

export const useSharingExplainerModalFlag = () => {
  const { localStore, setLocalStore } = useUser()
  const [hasSeenSharingExplainerModal, setHasSeenSharingExplainerModal] = useState(true)

  useEffect(() => {
    if (!localStore) {
      return
    }
    if (localStore[DISMISSED_SHARING_EXPLAINER_KEY] === "false"){
      setHasSeenSharingExplainerModal(false)
    }
  }, [localStore, setLocalStore])

  const hideModal = useCallback(() => {
    setLocalStore({ [DISMISSED_SHARING_EXPLAINER_KEY]: "true" }, "update")
    setHasSeenSharingExplainerModal(true)
  }, [setLocalStore])

  return { hasSeenSharingExplainerModal, hideModal }
}