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

interface UserDisplayInfo  {
  displayName: string
  uuid: string
}

const SharedUsers = ({ bucket, showOwners }: Props) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { owners, readers, writers } = bucket

  const getUserDisplayInfo = useCallback((users: RichUserInfo[]) : UserDisplayInfo[] => {
    return users.map((user) => ({ displayName: getUserDisplayName(user), uuid: user.uuid }))
  }, [])

  const userLabels = useMemo(() =>
    [
      ...getUserDisplayInfo(showOwners ? owners : []),
      ...getUserDisplayInfo(readers),
      ...getUserDisplayInfo(writers)
    ],
  [readers, writers, getUserDisplayInfo, owners, showOwners])

  if (!userLabels.length) {
    return null
  }

  if (!desktop) {
    return (
      <div className={classes.root}>
        <UserBubble
          text={`+${userLabels.length}`}
          tooltip={userLabels.map((userLabel) => userLabel.displayName)}
        />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <UserBubble
        tooltip={userLabels[0].displayName}
        className={userLabels.length > 1 ? classes.bubble : undefined}
        hashIconValue={userLabels[0].uuid}
      />
      {userLabels.length > 2 && (
        <UserBubble
          text={`+${userLabels.length - 1}`}
          tooltip={userLabels.slice(1).map((userLabel) => userLabel.displayName)}
        />
      )}
      {userLabels.length === 2 && (
        <UserBubble
          tooltip={userLabels[1].displayName}
          hashIconValue={userLabels[1].uuid}
        />
      )}
    </div>
  )
}

export default SharedUsers