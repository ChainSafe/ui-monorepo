import React, { useState } from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Button, ExpansionPanel, Typography } from "@chainsafe/common-components"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import bowser from "bowser"
import dayjs from "dayjs"

const useStyles = makeStyles(({ palette, constants, animation, breakpoints }: CSFTheme) =>
  createStyles({
    panelHeading: {
      backgroundColor: palette.additional["gray"][4],
      borderRadius: "10px",
      padding: `${constants.generalUnit}px 0 ${constants.generalUnit}px ${constants.generalUnit * 2}px`,
      transition: `border-radius ${animation.transform}ms`,
      "&.active": {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }
    },
    panelBody: {
      backgroundColor: palette.additional["gray"][4],
      padding: 0,
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      marginTop: `-${constants.generalUnit}px`
    },
    panelContent: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit,
      color: palette.additional["gray"][9],
      display: "flex",
      flexDirection: "column"
    },
    subtitle: {
      paddingBottom: constants.generalUnit,
      lineHeight: "24px",
      [breakpoints.down("md")]: {
        fontSize: "14px",
        lineHeight: "22px"
      }
    },
    subtitleLast: {
      lineHeight: "24px",
      [breakpoints.down("md")]: {
        fontSize: "14px",
        lineHeight: "22px"
      }
    },
    lightSubtitle: {
      color: palette.additional["gray"][8],
      paddingBottom: constants.generalUnit * 0.5,
      [breakpoints.down("md")]: {
        fontSize: "14px",
        lineHeight: "22px"
      }
    },
    actionBox: {
      marginTop: constants.generalUnit * 2
    }
  })
)

interface IBrowserPanelProps {
  browserInstance: bowser.Parser.ParsedResult
  dateAdded: number
}

const BrowserPanel: React.FC<IBrowserPanelProps> = ({ browserInstance, dateAdded }) => {
  const classes = useStyles()
  const [showPanel, setShowPanel] = useState(false)

  return (
    <ExpansionPanel
      header={browserInstance.browser.name || ""}
      variant="borderless"
      injectedClasses={{ heading: clsx(classes.panelHeading, showPanel && "active"), content: classes.panelBody }}
      iconPosition={"right"}
      active={showPanel}
      toggle={() => setShowPanel(!showPanel)}
    >
      <div className={classes.panelBody}>
        <div className={classes.panelContent}>
          <Typography variant="body1" component="p" className={classes.subtitle}>
            <Trans>Operating system :</Trans>&nbsp;{browserInstance.os.name}
          </Typography>
          <Typography variant="body1" component="p" className={classes.subtitle}>
            <Trans>Browser : </Trans>&nbsp;{browserInstance.browser.name}&nbsp;{browserInstance.browser.version}
          </Typography>
          <Typography variant="body1" component="p" className={classes.subtitleLast}>
            <Trans>Saved on: </Trans>&nbsp;{dayjs(dateAdded).format("DD MMM YYYY")}
          </Typography>
          <div className={classes.actionBox}>
            <Typography variant="body1" component="p" className={classes.lightSubtitle}>
              <Trans>Your recovery key can be used to restore your account in place of your backup phrase.</Trans>
            </Typography>
            <Button
              size="small"
            >
              <Trans>Download recovery key</Trans>
            </Button>
          </div>
          <div className={classes.actionBox}>
            <Typography variant="body1" component="p" className={classes.lightSubtitle}>
              <Trans>Forgetting this browser deletes this from your list of sign-in methods.
              You will not be able to forget a browser if you only have two methods set up.</Trans>
            </Typography>
            <Button
              size="small"
            >
              <Trans>Forget this browser</Trans>
            </Button>
          </div>
        </div>
      </div>
    </ExpansionPanel>
  )
}

export default BrowserPanel