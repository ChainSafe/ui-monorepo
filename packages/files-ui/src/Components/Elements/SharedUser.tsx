import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { UserIcon } from "@chainsafe/common-components"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  return createStyles({
    root: {
    },
    bubble: {
      borderRadius: "50%",
      border: "solid black 1px",
      backgroundColor: palette.additional["gray"][6],
      color: palette.common.white.main
    },
    text : {
      textAlign: "center"
    }
  })
})

interface Props {
  sharedUsers: string[]
}

const SharedUsers = ({ sharedUsers }: Props) => {
  const classes = useStyles()

  if (!sharedUsers.length) {
    return null
  }

  const UserBubble = ({ text, hover }: {text?: string; hover: string}) => <div className={classes.bubble}>
    {text
      ? <span className={classes.text}>{text}</span>
      : <UserIcon/>
    }
  </div>

  return <div className={classes.root}>
    {sharedUsers.length > 2 && (
      <UserBubble
        text={`+${sharedUsers.length - 2}`}
        hover={"some move"}
      />
    )}
    {sharedUsers.length == 2 && (
      <UserBubble
        hover={sharedUsers[1]}
      />
    )}
    <UserBubble
      hover={sharedUsers[0]}
    />
  </div>
}

export default SharedUsers