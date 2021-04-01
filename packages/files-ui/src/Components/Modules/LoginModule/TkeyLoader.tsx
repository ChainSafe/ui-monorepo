import React from "react"
import { createStyles, makeStyles, useTheme } from "@chainsafe/common-theme"
import { LOADER, Spinner } from "@chainsafe/common-components"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(({ animation, palette, zIndex }: CSFTheme) =>
  createStyles({
    root: {
      opacity: 0,
      visibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: zIndex?.blocker,
      transitionDuration: `${animation.transform}ms`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "&:before": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: zIndex?.background,
        backgroundColor: palette.common.black.main,
        opacity: 0.3
      },
      "&.active": {
        opacity: 1,
        visibility: "visible"
      }
    }
  })
)

interface ITkeyLoader {
  className?: string
  loading: boolean
}

const TkeyLoader = ({ className, loading }: ITkeyLoader) => {
  const classes = useStyles()
  const { palette } = useTheme<CSFTheme>()

  return (
    <div className={clsx(classes.root, className, {
      "active": !loading
    })}>
      <Spinner color={palette.secondary.main} size={50} width={50} loader={LOADER.ClockLoader} />
    </div>
  )
}

export default TkeyLoader
