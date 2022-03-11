import { LookupUser } from "@chainsafe/files-api-client"
import { useCallback, useState } from "react"
import { BucketKeyPermission, useFiles } from "../../../../Contexts/FilesContext"

export const useCreateOrEditSharedFolder = () => {
  const [isCreatingSharedFolder, setIsCreatingSharedFolder] = useState(false)
  const [isEditingSharedFolder, setIsEditingSharedFolder] = useState(false)
  const { createSharedFolder, editSharedFolder } = useFiles()

  const handleCreateSharedFolder = useCallback((
    sharedFolderName: string,
    sharedFolderReaders: LookupUser[],
    sharedFolderWriters: LookupUser[]
  ) => {
    setIsCreatingSharedFolder(true)
    return createSharedFolder(sharedFolderName.trim(), sharedFolderWriters, sharedFolderReaders)
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
    sharedFolderReaders: LookupUser[],
    sharedFolderWriters: LookupUser[]
  ) => {
    setIsEditingSharedFolder(true)
    return editSharedFolder(bucketToEdit, sharedFolderWriters, sharedFolderReaders)
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