import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"

const useStyles = makeStyles(
  ({ zIndex }: CSFTheme) =>
    createStyles({
      root: {
        zIndex: zIndex?.background
      }
    })
)

const InitialScreen: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
    </div>
  )
}

export default InitialScreen
