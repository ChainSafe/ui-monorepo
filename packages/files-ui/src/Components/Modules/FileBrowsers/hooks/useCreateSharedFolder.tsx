import { useCallback, useState } from "react"
import EthCrypto from "eth-crypto"
import { useFiles } from "../../../../Contexts/FilesContext"
import { SharedFolderCreationPermission, SharedFolderCreationUser } from "../types"

export const useCreateSharedFolder = () => {
  const [isCreatingSharedFolder, setIsCreatingSharedFolder] = useState(false)
  const { createSharedFolder } = useFiles()


  const handleCreateSharedFolder = useCallback(async (
    sharedFolderName: string,
    sharedFolderUsers: SharedFolderCreationUser[],
    permissions: SharedFolderCreationPermission
  ) => {
    const users = sharedFolderUsers.map(su => ({
      uuid: su.value,
      pubKey: EthCrypto.publicKey.decompress(su.data.identity_pubkey.slice(2))
    }))
    const readers = (permissions === "read") ? users : []
    const writers = (permissions === "write") ? users : []
    setIsCreatingSharedFolder(true)
    createSharedFolder(sharedFolderName, writers, readers)
      .then(() => setIsCreatingSharedFolder(false))
      .catch(console.error)
  }, [createSharedFolder])

  return { handleCreateSharedFolder, isCreatingSharedFolder }
}