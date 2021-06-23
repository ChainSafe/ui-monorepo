import React, { useCallback, useState } from "react"
import { EyeOpenIcon, EyeClosedIcon, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"

interface Props {
    value: string
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between"
    }
  })
)

const SecretField = ({ value }: Props) => {
  const [showValue, setShowValue] = useState(false)
  const classes = useStyles()

  const toggleShowValue = useCallback(() => {
    setShowValue(!showValue)
  }, [showValue])

  return (
    <div className={classes.root}>
      <Typography>{showValue ? value : "⚫⚫⚫⚫⚫⚫⚫⚫⚫" }</Typography>
      {showValue ? <EyeClosedIcon onClick={toggleShowValue} /> : <EyeOpenIcon onClick={toggleShowValue} />}
    </div>
  )
}

export default SecretField