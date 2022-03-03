import { LookupUser } from "@chainsafe/files-api-client"
import React, { useEffect, useState } from "react"
import { getUserDisplayName } from "../../Utils/getUserDisplayName"

interface Props {
  user: LookupUser
}
export const UserName = ({ user }: Props) => {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    getUserDisplayName(user)
      .then(setUserName)
      .catch(console.error)
  }, [user])

  return <span>{userName}</span>
}