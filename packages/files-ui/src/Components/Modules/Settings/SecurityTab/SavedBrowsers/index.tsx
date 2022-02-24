import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Loading, Typography } from "@chainsafe/common-components"
import BrowserPanel from "./BrowserPanel"
import { useThresholdKey } from "../../../../../Contexts/ThresholdKeyContext"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
      paddingBottom: constants.generalUnit,
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`
      }
    },
    title: {
      marginBottom: constants.generalUnit * 1.5
    },
    expansionContainer: {
      marginTop: constants.generalUnit * 0.5
    },
    loader : {
      marginLeft: constants.generalUnit
    }
  })
)

const SavedBrowsers: React.FC<{isRefreshing: boolean}> = ({ isRefreshing }) => {
  const classes = useStyles()
  const { browserShares } = useThresholdKey()

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        component="h4"
        className={classes.title}
      >
        <Trans>Saved Browsers</Trans>
        {isRefreshing && <Loading
          size={16}
          type="initial"
          className={classes.loader}
        />}
      </Typography>
      {browserShares
        .sort((a, b) => a.dateAdded - b.dateAdded)
        .map((bs, i) => (
          <div
            key={i}
            className={classes.expansionContainer}
          >
            <BrowserPanel {...bs}/>
          </div>
        ))}
    </div>
  )
}

export default SavedBrowsers
