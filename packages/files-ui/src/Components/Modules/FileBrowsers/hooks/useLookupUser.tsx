import { useCallback, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useUser } from "../../../../Contexts/UserContext"
import { ethers } from "ethers"
import { LookupUser, NonceResponsePermission } from "@chainsafe/files-api-client"

export const useLookupSharedFolderUser = () => {
  const { filesApiClient } = useFilesApi()
  const [sharedFolderReaders, setSharedFolderReaders] = useState<LookupUser[]>([])
  const [sharedFolderWriters, setSharedFolderWriters] = useState<LookupUser[]>([])

  const { profile } = useUser()

  const handleLookupUser = useCallback(async (inputVal: string) => {
    if (inputVal === "") return []

    const lookupBody = {
      public_address: undefined as string | undefined,
      identity_public_key: undefined as string | undefined,
      username: undefined as string | undefined
    }
    const ethAddressRegex = new RegExp("^0(x|X)[a-fA-F0-9]{40}$") // Eth Address Starting with 0x and 40 HEX chars
    const pubKeyRegex = new RegExp("^0(x|X)[a-fA-F0-9]{66}$") // Compressed public key, 66 chars long
    const ensRegex = new RegExp("^[A-z0-9\u1F60-\uFFFF]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,7}$") // domain name check

    if (ethAddressRegex.test(inputVal)) {
      lookupBody.public_address = inputVal
    } else if (pubKeyRegex.test(inputVal)) {
      lookupBody.identity_public_key = inputVal
    } else if (ensRegex.test(inputVal)) {
      const provider = new ethers.providers.InfuraProvider("mainnet")
      const address = await provider.resolveName(inputVal)
      if (address) {
        lookupBody.public_address = address
      }
    } else {
      lookupBody.username = inputVal
    }

    if (!lookupBody.username && !lookupBody.public_address && !lookupBody.identity_public_key) return []

    try {
      const result = await filesApiClient.lookupUser(lookupBody.username, lookupBody.public_address, lookupBody.identity_public_key)
      if (!result) return []

      const currentUsers = [...sharedFolderReaders, ...sharedFolderWriters].map(su => su.uuid)

      // prevent the addition of current user since they are the owner
      if (currentUsers.includes(result.uuid) || result.uuid === profile?.userId) return []

      return [{ label: inputVal, value: result.uuid, data: result }]
    } catch (e) {
      console.error("No user found", e)
      return Promise.resolve([])
    }
  }, [filesApiClient, sharedFolderReaders, sharedFolderWriters, profile])

  const onAddNewUser = useCallback((user: LookupUser, permission: NonceResponsePermission) => {
    if (permission === "read") {
      setSharedFolderReaders([...sharedFolderReaders, user])
    } else {
      setSharedFolderWriters([...sharedFolderWriters, user])
    }
  }, [sharedFolderReaders, sharedFolderWriters])

  const resetUsers = useCallback(() => {
    setSharedFolderReaders([])
    setSharedFolderWriters([])
  }, [])

  return {
    handleLookupUser,
    sharedFolderReaders,
    sharedFolderWriters,
    setSharedFolderReaders,
    setSharedFolderWriters,
    onAddNewUser,
    resetUsers
  }
}
