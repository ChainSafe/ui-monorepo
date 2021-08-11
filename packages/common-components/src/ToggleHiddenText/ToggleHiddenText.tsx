import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode, useCallback, useMemo, useState } from "react"
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

const ToggleHiddenText = ({ className, iconPosition = "left", hiddenLength = 6, children }: IToggleHiddenText) => {
  const classes = useStyles()
  const [hidden, setHidden] = useState(true)
  const hiddenKey = useMemo(() => new Array(hiddenLength).fill("●"), [hiddenLength])

  const EyeClosed = useCallback(() => <EyeClosedSvg
    className={classes.icon}
    onClick={() => setHidden(false)}
  />
  , [classes.icon])

  const EyeOpen = useCallback(() => <EyeOpenSvg
    className={classes.icon}
    onClick={() => setHidden(true)}
  />
  , [classes.icon])

  return (
    <span className={clsx(classes.root, className)} >
      {
        hidden
          ? <>
            {iconPosition === "left" && <EyeClosed />}
            <span>{hiddenKey}</span>
            {iconPosition === "right" && <EyeClosed />}
          </>
          : <>
            {iconPosition === "left" && <EyeOpen />}
            {children}
            {iconPosition === "right" && <EyeOpen />}
          </>
      }
    </span>
  )
}

export default ToggleHiddenText
