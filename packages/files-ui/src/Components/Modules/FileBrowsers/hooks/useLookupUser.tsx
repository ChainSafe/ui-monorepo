import { LookupUserRequest } from "@chainsafe/files-api-client"
import { t } from "@lingui/macro"
import { useCallback, useState } from "react"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useUser } from "../../../../Contexts/UserContext"
import { centerEllipsis } from "../../../../Utils/Helpers"
import { SharedUserTagData, SharedFolderUserPermission } from "../types"
import { ITagOption, ITagValueType } from "@chainsafe/common-components"
import { useEffect } from "react"

export const useLookupSharedFolderUser = () => {
  const { filesApiClient } = useFilesApi()
  const [sharedFolderReaders, setSharedFolderReaders] = useState<SharedUserTagData[]>([])
  const [sharedFolderWriters, setSharedFolderWriters] = useState<SharedUserTagData[]>([])
  const [usersError, setUsersError] = useState("")

  const { profile } = useUser()

  useEffect(() => {
    // check intersecting users
    const foundIntersectingUsers = sharedFolderReaders
      .filter(
        reader => (
          sharedFolderWriters.some(writer => reader.data.uuid === writer.data.uuid)
        ))

    if (foundIntersectingUsers.length) {
      setUsersError(t`User ${
        centerEllipsis(foundIntersectingUsers[0].label)
      } is both a reader and writer`)
    } else {
      setUsersError("")
    }
  }, [sharedFolderReaders, sharedFolderWriters])

  const handleLookupUser = useCallback(async (inputVal: string, permission: SharedFolderUserPermission) => {
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

      const usersList = permission === "read" ? sharedFolderReaders : sharedFolderWriters
      const currentUsers = usersList.map(su => su.value)

      // prevent the addition of current user since they are the owner
      if (currentUsers.includes(result.uuid) || result.uuid === profile?.userId) return []

      return [{ label: inputVal, value: result.uuid, data: result }]
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }, [filesApiClient, sharedFolderReaders, sharedFolderWriters, profile])

  const onNewUsers = useCallback((val: ITagValueType<ITagOption, true>, permission: SharedFolderUserPermission) => {
    const newSharedFolderUsers = val?.map(({ label, value, data }) => ({ label, value, data })) || []

    if (permission === "read") {
      // setting readers
      setSharedFolderReaders(newSharedFolderUsers)
    } else {
      // setting writers
      setSharedFolderWriters(newSharedFolderUsers)
    }
  }, [])

  return {
    handleLookupUser,
    sharedFolderReaders,
    sharedFolderWriters,
    onNewUsers,
    usersError,
    setUsersError
  }
}
