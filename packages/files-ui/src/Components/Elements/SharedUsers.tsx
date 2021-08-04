import React, { useCallback, useMemo } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import UserBubble from "./UserBubble"
import { LookupUser } from "@chainsafe/files-api-client"
import { BucketKeyPermission } from "../../Contexts/FilesContext"
import { getUserDisplayName } from "../../Utils/getUserDisplayName"

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
      const displayName = getUserDisplayName(user)

      return [...acc, displayName]
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
          tooltip={userLabels.slice(1)}
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