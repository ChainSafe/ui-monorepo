import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

const ConfirmSkip: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
    </div>
  )
}

export default ConfirmSkip
