import React from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Typography } from "@chainsafe/common-components"
import BrowserPanel from "./BrowserPanel"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
      paddingBottom: constants.generalUnit,
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`
      }
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
  const { browserShares } = useThresholdKey()

  return (
    <div className={classes.root}>
      <Typography component="p" variant="body1" className={classes.title}>
        Saved Browsers
      </Typography>
      {browserShares.map((bs, i) => (
        <div key={i} className={classes.expansionContainer}>
          <BrowserPanel {...bs}/>
        </div>
      ))}
    </div>
  )
}

export default SavedBrowsers