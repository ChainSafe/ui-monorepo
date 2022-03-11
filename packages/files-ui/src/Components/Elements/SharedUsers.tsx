import React, { useCallback, useEffect, useState } from "react"
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
  const [usersDisplayInfo, setUsersDisplayInfo] = useState<UserDisplayInfo[]>([])

  const getUserDisplayInfo = useCallback(async (users: RichUserInfo[]) : Promise<UserDisplayInfo[]> => {
    return Promise.all(users.map(async (user) => ({ displayName: await getUserDisplayName(user), uuid: user.uuid })))
  }, [])

  useEffect(() => {
    Promise.all(
      [
        getUserDisplayInfo(showOwners ? owners : []),
        getUserDisplayInfo(readers),
        getUserDisplayInfo(writers)
      ])
      .then(([owners, readers, writers]) =>
        setUsersDisplayInfo([...owners, ...readers, ...writers])
      )
  },
  [readers, writers, getUserDisplayInfo, owners, showOwners])

  if (!usersDisplayInfo.length) {
    return null
  }

  if (!desktop) {
    return (
      <div className={classes.root}>
        <UserBubble
          text={`+${usersDisplayInfo.length}`}
          tooltip={usersDisplayInfo.map((userLabel) => userLabel.displayName)}
        />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <UserBubble
        tooltip={usersDisplayInfo[0].displayName}
        className={usersDisplayInfo.length > 1 ? classes.bubble : undefined}
        hashIconValue={usersDisplayInfo[0].uuid}
      />
      {usersDisplayInfo.length > 2 && (
        <UserBubble
          text={`+${usersDisplayInfo.length - 1}`}
          tooltip={usersDisplayInfo.slice(1).map((userLabel) => userLabel.displayName)}
        />
      )}
      {usersDisplayInfo.length === 2 && (
        <UserBubble
          tooltip={usersDisplayInfo[1].displayName}
          hashIconValue={usersDisplayInfo[1].uuid}
        />
      )}
    </div>
  )
}

export default SharedUsers