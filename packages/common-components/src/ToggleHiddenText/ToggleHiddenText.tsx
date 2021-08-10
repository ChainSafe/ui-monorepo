import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode, useState } from "react"
import clsx from "clsx"
import { EyeClosedSvg } from "../Icons/icons/EyeClosed.icon"
import { EyeOpenSvg } from "../Icons/icons/EyeOpen.icon"

const useStyles = makeStyles(({ constants, overrides }: ITheme) =>
  createStyles({
    root: {
      display: "inline-flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginLeft: constants.generalUnit,
      ...overrides?.ToggleHiddenText?.root
    },
    icon: {
      marginRight: constants.generalUnit,
      cursor: "pointer",
      ...overrides?.ToggleHiddenText?.icon
    }
  })
)

interface IToggleHiddenText {
  children: ReactNode
  iconPosition?: "left" | "right"
  hiddenLength?: number
  className?: string
}

const ToggleHiddenText = ({
  className,
  iconPosition = "left",
  hiddenLength = 6,
  children
}: IToggleHiddenText) => {
  const classes = useStyles()
  const [hidden, setHidden] = useState(true)

  return (
    <span className={clsx(classes.root, className)} >
      {
        hidden
          ? (
            <>
              {iconPosition === "left" && <EyeClosedSvg
                className={classes.icon}
                onClick={() => setHidden(false)}/>}
              <span>{ new Array(hiddenLength).fill("●") }</span>
              {iconPosition === "right" && <EyeClosedSvg
                className={classes.icon}
                onClick={() => setHidden(false)}/>}
            </>
          ) : (
            <>
              {iconPosition === "left" && <EyeOpenSvg
                className={classes.icon}
                onClick={() => setHidden(true)}
              />}
              { children }
              {iconPosition === "right" && <EyeOpenSvg
                className={classes.icon}
                onClick={() => setHidden(true)}
              />}
            </>
          )
      }
    </span>
  )
}

export default ToggleHiddenText
