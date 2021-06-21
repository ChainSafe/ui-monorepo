import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { Typography, UserIcon } from "@chainsafe/common-components"
import clsx from "clsx"

const useStyles = makeStyles(({ zIndex, animation, constants, palette }: CSFTheme) => {
  return createStyles({
    root: {
      display: "flex"
    },
    bubble: {
      position: "relative",
      borderRadius: "50%",
      backgroundColor: palette.additional["gray"][6],
      color: palette.common.white.main,
      width: constants.generalUnit * 5,
      height: constants.generalUnit * 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        fill: palette.common.white.main
      },
      "&:first-child": {
        marginRight: constants.generalUnit
      }
    },
    text : {
      textAlign: "center"
    },
    tooltip: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      left: "50%",
      top: "-20px",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      zIndex: zIndex?.layer1,
      transitionDuration: `${animation.transform}ms`,
      opacity: 0,
      visibility: "hidden",
      backgroundColor: constants.loginModule.flagBg,
      color: constants.loginModule.flagText,
      padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
      borderRadius: 2,
      "&:after": {
        transitionDuration: `${animation.transform}ms`,
        content: "''",
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translate(-50%,0)",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `5px solid ${constants.loginModule.flagBg}`
      },
      "&.active": {
        opacity: 1,
        visibility: "visible"
      }

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

  const UserBubble = ({ text, hover }: {text?: string; hover: string | string[]}) => {
    const [isHover, setIsHover] = useState(false)

    return (
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={classes.bubble}
      >
        <div className={clsx(classes.tooltip, { "active": isHover })}>
          {
            Array.isArray(hover)
              ? hover.map((user) => <div key={user}>{user}</div>)
              : hover
          }
        </div>
        {text
          ? <Typography
            variant="h4"
            className={classes.text}
          >
            {text}
          </Typography>
          : <UserIcon/>
        }
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <UserBubble
        hover={sharedUsers[0]}
      />
      {sharedUsers.length > 2 && (
        <UserBubble
          text={`+${sharedUsers.length - 1}`}
          hover={sharedUsers.slice(0, -1)}
        />
      )}
      {sharedUsers.length === 2 && (
        <UserBubble
          hover={sharedUsers[1]}
        />
      )}
    </div>
  )
}

export default SharedUsers