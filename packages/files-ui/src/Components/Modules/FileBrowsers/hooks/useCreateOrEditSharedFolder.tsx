import { useCallback, useState } from "react"
import { BucketKeyPermission, useFiles } from "../../../../Contexts/FilesContext"
import { SharedUserTagData } from "../types"

export const useCreateOrEditSharedFolder = () => {
  const [isCreatingSharedFolder, setIsCreatingSharedFolder] = useState(false)
  const [isEditingSharedFolder, setIsEditingSharedFolder] = useState(false)
  const { createSharedFolder, editSharedFolder } = useFiles()

  const getSharedUsers = (sharedUserTagData: SharedUserTagData[]) => sharedUserTagData.map(su => ({
    uuid: su.value,
    pubKey: su.data.identity_pubkey?.slice(2) || "",
    encryption_key: su.data.encryption_key
  }))

  const handleCreateSharedFolder = useCallback((
    sharedFolderName: string,
    sharedFolderReaders: SharedUserTagData[],
    sharedFolderWriters: SharedUserTagData[]
  ) => {
    const readers = getSharedUsers(sharedFolderReaders)
    const writers = getSharedUsers(sharedFolderWriters)
    setIsCreatingSharedFolder(true)
    return createSharedFolder(sharedFolderName, writers, readers)
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
    sharedFolderReaders: SharedUserTagData[],
    sharedFolderWriters: SharedUserTagData[]
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