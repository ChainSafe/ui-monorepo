import React from "react"
import {
  makeStyles,
  createStyles,
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"

const useStyles = makeStyles(
  ({ palette, breakpoints }: CSFTheme) =>
    createStyles({
      root: {
        [breakpoints.down("md")]: {
          backgroundColor: palette.common.black.main,
          height: "100vh",
          display: "flex",
        },
      },
    }),
)

const LoginPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
    </div>
  )
}

export default LoginPage
