import React, { useCallback, useMemo } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import UserBubble from "./UserBubble"
import { BucketKeyPermission, RichUserInfo } from "../../Contexts/FilesContext"
import { getUserDisplayName } from "../../Utils/getUserDisplayName"
import { CSFTheme } from "../../Themes/types"

const useStyles = makeStyles(({ constants }: CSFTheme) => {
  return createStyles({
    root: {
      display: "flex"
    },
    bubble: {
      marginRight: constants.generalUnit
    }
  })
})
interface Props {
  bucket: BucketKeyPermission
  showOwners: boolean
}

const SharedUsers = ({ bucket, showOwners }: Props) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { owners, readers, writers } = bucket

  const getUserLabels = useCallback((users: RichUserInfo[]): string[] => {
    return users.reduce((acc: string[], user): string[] => {
      const displayName = getUserDisplayName(user)

      return [...acc, displayName]
    }, [] as string[])
  }, [])

  const userLabels = useMemo(() =>
    [
      ...getUserLabels(showOwners ? owners : []),
      ...getUserLabels(readers),
      ...getUserLabels(writers)
    ],
  [readers, writers, getUserLabels, owners, showOwners])

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
        className={userLabels.length > 1 ? classes.bubble : undefined}
        showHashIcon
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
          showHashIcon
        />
      )}
    </div>
  )
}

export default SharedUsers