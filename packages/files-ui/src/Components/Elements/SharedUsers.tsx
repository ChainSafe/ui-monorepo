import React, { useCallback, useMemo } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import UserBubble from "./UserBubble"
import { BucketUser } from "@chainsafe/files-api-client"
import { BucketKeyPermission } from "../../Contexts/FilesContext"

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

  const getUserIds = useCallback((users?: BucketUser[]): string[] => {
    if(!users) return []

    return users.reduce((acc: string[], user): string[] => {
      return user.uuid ? [...acc, user.uuid] :  acc
    }, [] as string[])
  }, [])

  const userIds = useMemo(() =>
    [
      ...getUserIds(owners),
      ...getUserIds(readers),
      ...getUserIds(writers)
    ],
  [owners, readers, writers, getUserIds])

  if (!userIds.length) {
    return null
  }

  if (!desktop) {
    return <div className={classes.root}>
      <UserBubble
        text={`+${userIds.length}`}
        tooltip={userIds}
      />
    </div>
  }

  return (
    <div className={classes.root}>
      <UserBubble
        tooltip={userIds[0]}
      />
      {userIds.length > 2 && (
        <UserBubble
          text={`+${userIds.length - 1}`}
          tooltip={userIds.slice(0, -1)}
        />
      )}
      {userIds.length === 2 && (
        <UserBubble
          tooltip={userIds[1]}
        />
      )}
    </div>
  )
}

export default SharedUsers