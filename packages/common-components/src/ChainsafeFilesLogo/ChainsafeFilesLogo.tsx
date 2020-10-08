import React from "react"
import { makeStyles, createStyles } from "@imploy/common-themes"
import clsx from "clsx"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "fit-content",
    },
  }),
)

const ChainsafeFilesLogo: React.FC<{ className?: string }> = ({
  className,
}) => {
  const classes = useStyles()
  return (
    <img
      src="ChainSafe-logo.png"
      alt="Chainsafe Logo"
      className={clsx(classes.root, className)}
    />
  )
}

export default ChainsafeFilesLogo
