import { useCallback, useState } from "react"
import { BucketKeyPermission, useFiles } from "../../../../Contexts/FilesContext"
import { SharedUserData } from "../types"

export const useCreateOrEditSharedFolder = () => {
  const [isCreatingSharedFolder, setIsCreatingSharedFolder] = useState(false)
  const [isEditingSharedFolder, setIsEditingSharedFolder] = useState(false)
  const { createSharedFolder, editSharedFolder } = useFiles()

  const getSharedUsers = (sharedUserTagData: SharedUserData[]) => sharedUserTagData.map(su => ({
    uuid: su.value,
    pubKey: su.data.identity_pubkey?.slice(2) || "",
    encryption_key: su.data.encryption_key
  }))

  const handleCreateSharedFolder = useCallback((
    sharedFolderName: string,
    sharedFolderReaders: SharedUserData[],
    sharedFolderWriters: SharedUserData[]
  ) => {
    const readers = getSharedUsers(sharedFolderReaders)
    const writers = getSharedUsers(sharedFolderWriters)
    setIsCreatingSharedFolder(true)
    return createSharedFolder(sharedFolderName.trim(), writers, readers)
      .then((bucket) => {
        setIsCreatingSharedFolder(false)
        return bucket
      })
      .catch((error) => {
        setIsCreatingSharedFolder(false)
        console.error(error)
      })
  }, [createSharedFolder])

  const handleEditSharedFolder = useCallback((
    bucketToEdit: BucketKeyPermission,
    sharedFolderReaders: SharedUserData[],
    sharedFolderWriters: SharedUserData[]
  ) => {
    const readers = getSharedUsers(sharedFolderReaders)
    const writers = getSharedUsers(sharedFolderWriters)
    setIsEditingSharedFolder(true)
    return editSharedFolder(bucketToEdit, writers, readers)
      .then((bucket) => {
        setIsEditingSharedFolder(false)
        return bucket
      })
      .catch((error) => {
        setIsEditingSharedFolder(false)
        console.error(error)
      })
  }, [editSharedFolder])

  return {
    handleCreateSharedFolder,
    isCreatingSharedFolder,
    handleEditSharedFolder,
    isEditingSharedFolder
  }
}