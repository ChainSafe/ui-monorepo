import React from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Typography } from "@chainsafe/common-components"
import BrowserPanel from "./BrowserPanel"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import bowser from "bowser"

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
  const { keyDetails } = useThresholdKey()

  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  const browserShares = shares.filter((s) => s.module === "webStorage")

  const browserShareInstances: {
    browserInstance: bowser.Parser.ParsedResult
    dateAdded: number
  }[] = []
  browserShares.forEach((browserShare) => {
    try {
      const browserInstance = bowser.parse(browserShare.userAgent)
      if (browserInstance) {
        browserShareInstances.push({
          browserInstance,
          dateAdded: browserShare.dateAdded
        })
      }
    } catch {
      // 
    }
  })

  return (
    <div className={classes.root}>
      <Typography component="p" variant="body1" className={classes.title}>
        Saved Browsers
      </Typography>
      {browserShareInstances.map((browserShareInstance, i) => (
        <div key={i} className={classes.expansionContainer}>
          <BrowserPanel
            browserInstance={browserShareInstance.browserInstance}
            dateAdded={browserShareInstance.dateAdded}
          />
        </div>
      ))
      }
    </div>
  )
}

export default SavedBrowsers