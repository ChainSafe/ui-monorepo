import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative"
    }
  })
)

const DashboardPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h1"
      >
        Dashboard
      </Typography>
    </div>
  )
}

export default DashboardPage
