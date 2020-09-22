import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles(() =>
  createStyles({
    logoImage: {
      width: "fit-content",
    },
  }),
)

const ChainsafeFilesLogo: React.FC<{ className?: string }> = ({
  className
}) => {
  const classes = useStyles()
  return (
    <img
      src="ChainSafe-logo.png"
      alt="Chainsafe Logo"
      className={clsx(classes.logoImage, className)}
    />
  )
}

export default ChainsafeFilesLogo
