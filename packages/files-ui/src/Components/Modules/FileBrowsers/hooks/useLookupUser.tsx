import { LookupUserRequest } from "@chainsafe/files-api-client"
import { useCallback, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useUser } from "../../../../Contexts/UserContext"
import { SharedFolderCreationUser } from "../types"

export const useLookupSharedFolderUser = () => {
  const { filesApiClient } = useFilesApi()
  const [sharedFolderUsers, setSharedFolderUsers] = useState<SharedFolderCreationUser[]>([])
  const { profile } = useUser()

  const handleLookupUser = useCallback(async (inputVal: string) => {
    if (inputVal === "") return []

    const lookupBody: LookupUserRequest = {}
    const ethAddressRegex = new RegExp("^0(x|X)[a-fA-F0-9]{40}$") // Eth Address Starting with 0x and 40 HEX chars
    const pubKeyRegex = new RegExp("^0(x|X)[a-fA-F0-9]{66}$") // Compressed public key, 66 chars long

    if (ethAddressRegex.test(inputVal)) {
      lookupBody.public_address = inputVal
    } else if (pubKeyRegex.test(inputVal)) {
      lookupBody.identity_public_key = inputVal
    } else {
      lookupBody.username = inputVal
    }

    try {
      const result = await filesApiClient.lookupUser(lookupBody)

      if (!result) return []

      const currentUsers = Array.isArray(sharedFolderUsers)
        ? sharedFolderUsers.map(su => su.value)
        : []

      // prevent the addition of current user since they are the owner
      if (currentUsers.includes(result.uuid) || result.uuid === profile?.userId) return []

      return [{ label: inputVal, value: result.uuid, data: result }]
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }, [filesApiClient, sharedFolderUsers, profile])

  return { handleLookupUser, sharedFolderUsers, setSharedFolderUsers }
}