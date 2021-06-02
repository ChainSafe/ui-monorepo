import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden"
    }
  })
)

const PinsPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Pins</Typography>
    </div>
  )
}

export default PinsPage
