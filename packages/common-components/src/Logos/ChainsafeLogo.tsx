import React from "react"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import logo from "./ChainSafe-logo.png"

const useStyles = makeStyles(({ overrides }: ITheme) =>
  createStyles({
    root: {
      width: "fit-content",
      ...overrides?.ChainsafeLogo?.root
    }
  })
)

export interface ChainsafeLogoProps {
  className?: string
}

const ChainsafeLogo = ({ className }: ChainsafeLogoProps) => {
  const classes = useStyles()

  return (
    <img
      src={logo}
      alt="Chainsafe Logo"
      className={clsx(classes.root, className)}
    />
  )
}

export default ChainsafeLogo
