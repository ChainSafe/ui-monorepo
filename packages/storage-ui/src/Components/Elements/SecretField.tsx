import React, { useCallback, useState } from "react"
import { EyeOpenIcon, EyeClosedIcon, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CSSTheme } from "../../Themes/types"

interface Props {
    value: string
    className?: string
}

const useStyles = makeStyles(({ typography }: CSSTheme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between"
    },
    showSecret: {
      maxWidth: "100%",
      display: "block",
      overflowWrap: "anywhere"
    }
  })
)

const SecretField = ({ value, className }: Props) => {
  const [showValue, setShowValue] = useState(false)
  const classes = useStyles()

  const toggleShowValue = useCallback(() => {
    setShowValue(!showValue)
  }, [showValue])

  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.showSecret}>{showValue ? value : "⚫⚫⚫⚫⚫⚫⚫⚫⚫" }</Typography>
      {showValue ? <EyeClosedIcon onClick={toggleShowValue} /> : <EyeOpenIcon onClick={toggleShowValue} />}
    </div>
  )
}

export default SecretField