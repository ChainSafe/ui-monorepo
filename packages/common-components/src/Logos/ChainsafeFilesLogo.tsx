import React from "react"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import logo from "./ChainSafe-Files-logo.png"

const useStyles = makeStyles(({ overrides }: ITheme) =>
  createStyles({
    root: {
      width: "fit-content",
      ...overrides?.ChainsafeLogo?.root
    }
  })
)

export interface ChainsafeFilesLogoProps {
  className?: string
}

const ChainsafeFilesLogo = ({ className }: ChainsafeFilesLogoProps) => {
  const classes = useStyles()

  return (
    <img
      src={logo}
      alt="Chainsafe Files Logo"
      className={clsx(classes.root, className)}
    />
  )
}

export default ChainsafeFilesLogo
