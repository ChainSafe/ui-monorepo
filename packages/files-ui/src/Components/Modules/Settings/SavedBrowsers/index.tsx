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
      paddingBottom: constants.generalUnit
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

  const browserShareInstances: {
      browserInstance: bowser.Parser.ParsedResult
      dateAdded: number
      shareIndex: string
    }[] = []

  if (keyDetails) {
    Object.keys(keyDetails.shareDescriptions).forEach((shareIndex) => {
      const share = JSON.parse(keyDetails.shareDescriptions[shareIndex][0])
      if (share.module === "webStorage") {
        try {
          const browserInstance = bowser.parse(share.userAgent)
          if (browserInstance) {
            browserShareInstances.push({
              browserInstance,
              dateAdded: share.dateAdded,
              shareIndex: shareIndex
            })
          }
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

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
            shareIndex={browserShareInstance.shareIndex}
          />
        </div>
      ))
      }
    </div>
  )
}

export default SavedBrowsers