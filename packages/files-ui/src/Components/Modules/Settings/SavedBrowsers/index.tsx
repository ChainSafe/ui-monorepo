import React from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Typography } from "@chainsafe/common-components"
import BrowserPanel from "./BrowserPanel"

const useStyles = makeStyles(({ constants }: CSFTheme) =>
  createStyles({
    root: {
      padding: `${constants.generalUnit * 3}px 0`
    },
    title: {
      fontSize: "16px",
      lineHeight: "24px",
      paddingBottom: constants.generalUnit * 2
    },
    expansionContainer: {
      marginBottom: constants.generalUnit * 3
    }
  })
)


const SavedBrowsers: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="p" variant="body1" className={classes.title}>
        Saved Browsers
      </Typography>
      <div className={classes.expansionContainer}>
        <BrowserPanel nickname="browser1" />
      </div>
      <div className={classes.expansionContainer}>
        <BrowserPanel nickname="browser1" />
      </div>
    </div>
  )
}

export default SavedBrowsers