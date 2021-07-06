import React from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import UserBubble from "./UserBubble"

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      display: "flex"
    }
  })
})
interface Props {
  sharedUsers: string[]
}

const SharedUsers = ({ sharedUsers }: Props) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

  if (!sharedUsers.length) {
    return null
  }

  if (!desktop) {
    return <div className={classes.root}>
      <UserBubble
        text={`+${sharedUsers.length}`}
        tooltip={sharedUsers}
      />
    </div>
  }

  return (
    <div className={classes.root}>
      <UserBubble
        tooltip={sharedUsers[0]}
      />
      {sharedUsers.length > 2 && (
        <UserBubble
          text={`+${sharedUsers.length - 1}`}
          tooltip={sharedUsers.slice(0, -1)}
        />
      )}
      {sharedUsers.length === 2 && (
        <UserBubble
          tooltip={sharedUsers[1]}
        />
      )}
    </div>
  )
}

export default SharedUsers