import React, { useCallback, useMemo } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import UserBubble from "./UserBubble"
import { LookupUser } from "@chainsafe/files-api-client"
import { BucketKeyPermission } from "../../Contexts/FilesContext"
import { centerEllipsis } from "../../Utils/Helpers"

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      display: "flex"
    }
  })
})
interface Props {
 bucket: BucketKeyPermission
}

const SharedUsers = ({ bucket }: Props) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { owners, readers, writers } = bucket

  const getUserLabels = useCallback((users: LookupUser[]): string[] => {
    return users.reduce((acc: string[], user): string[] => {
      if (user.username !== "") {
        return user.username ? [...acc, user.username] :  acc
      }

      if (user.public_address !== "") {
        return user.public_address ? [...acc, centerEllipsis(user.public_address.toLowerCase(), 6)] :  acc
      }

      return user.uuid ? [...acc, user.uuid] :  acc
    }, [] as string[])
  }, [])

  const userLabels = useMemo(() =>
    [
      ...getUserLabels(owners),
      ...getUserLabels(readers),
      ...getUserLabels(writers)
    ],
  [owners, readers, writers, getUserLabels])

  if (!userLabels.length) {
    return null
  }

  if (!desktop) {
    return (
      <div className={classes.root}>
        <UserBubble
          text={`+${userLabels.length}`}
          tooltip={userLabels}
        />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <UserBubble
        tooltip={userLabels[0]}
      />
      {userLabels.length > 2 && (
        <UserBubble
          text={`+${userLabels.length - 1}`}
          tooltip={userLabels.slice(0, -1)}
        />
      )}
      {userLabels.length === 2 && (
        <UserBubble
          tooltip={userLabels[1]}
        />
      )}
    </div>
  )
}

export default SharedUsers