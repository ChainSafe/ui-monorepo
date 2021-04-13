import React from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Loading, Typography } from "@chainsafe/common-components"
import BrowserPanel from "./BrowserPanel"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import {Trans} from "@lingui/macro"

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

const SavedBrowsers: React.FC<{isRefreshing: boolean}> = ({ isRefreshing }) => {
  const classes = useStyles()
  const { browserShares } = useThresholdKey()

  return (
    <div className={classes.root}>
      <Typography component="p" variant="body1" className={classes.title}>
        <Trans>Saved Browsers</Trans> {isRefreshing && <Loading size={16} type='inherit' />}
      </Typography>
      {browserShares.sort((a, b) => a.dateAdded - b.dateAdded).map((bs, i) => (
        <div key={i} className={classes.expansionContainer}>
          <BrowserPanel {...bs}/>
        </div>
      ))}
    </div>
  )
}

export default SavedBrowsers