import React, { useCallback, useState } from "react"
import {
  makeStyles,
  createStyles
} from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Button, ExpansionPanel, Typography } from "@chainsafe/common-components"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { BrowserShare, useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"

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
    },
    spanMarginRight: {
      marginRight: "0.5rem"
    }
  })
)

function download(filename: string, text: string) {
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
  element.setAttribute("download", filename)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const BrowserPanel = ({ dateAdded, shareIndex, browser, os }: BrowserShare) => {
  const { deleteShare, getSerializedDeviceShare, keyDetails, browserShares } = useThresholdKey()
  const classes = useStyles()
  const [showPanel, setShowPanel] = useState(false)
  const [loadingDeleteShare, setLoadingDeleteShare] = useState(false)
  const [loadingDownloadKey, setLoadingDownloadKey] = useState(false)

  const onDeleteShare = useCallback(() => {
    setLoadingDeleteShare(true)
    deleteShare(shareIndex)
      .then(() => {
        setLoadingDeleteShare(false)
        setShowPanel(false)
      }).catch((e) => {
        console.error(e)
        setLoadingDeleteShare(false)
      })
  },
  [deleteShare, shareIndex])

  const onDownloadKey = useCallback(() => {
    setLoadingDownloadKey(true)
    getSerializedDeviceShare(shareIndex)
      .then((mnemonicKey) => {
        if (mnemonicKey) {
          download(`Chainsafe Files - ${browser.name || ""} key.txt`, mnemonicKey)
        }
        setLoadingDownloadKey(false)
      })
      .catch((e) => {
        console.error(e)
        setLoadingDownloadKey(false)
      })
  }, [browser.name, getSerializedDeviceShare, shareIndex])

  return (
    <ExpansionPanel
      header={browser.name || ""}
      variant="borderless"
      injectedClasses={{ heading: clsx(classes.panelHeading, showPanel && "active"), content: classes.panelBody }}
      iconPosition={"right"}
      active={showPanel}
      toggle={() => setShowPanel(!showPanel)}
    >
      <div className={classes.panelBody}>
        <div className={classes.panelContent}>
          <Typography
            variant="body1"
            component="p"
            className={classes.subtitle}
          >
            <span className={classes.spanMarginRight}><Trans>Operating system:</Trans></span>{os.name}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.subtitle}
          >
            <span className={classes.spanMarginRight}>
              <Trans>Browser:</Trans>
            </span>
            <span className={classes.spanMarginRight}>{browser.name}</span>{browser.version}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.subtitleLast}
          >
            <span className={classes.spanMarginRight}><Trans>Saved on:</Trans></span>{dayjs(dateAdded).format("DD MMM YYYY - HH:mm")}
          </Typography>
          <div className={classes.actionBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.lightSubtitle}
            >
              <Trans>Your recovery key can be used to restore your account in place of your backup phrase.</Trans>
            </Typography>
            <Button
              size="small"
              loading={loadingDownloadKey}
              disabled={loadingDownloadKey}
              onClick={onDownloadKey}
            >
              <Trans>Download recovery key</Trans>
            </Button>
          </div>
          {keyDetails && browserShares.length > 1 && keyDetails?.totalShares > 3 &&
            <div className={classes.actionBox}>
              <Typography
                variant="body1"
                component="p"
                className={classes.lightSubtitle}
              >
                <Trans>Forgetting this browser deletes this from your list of sign-in methods.
                You will not be able to forget a browser if you only have two methods set up.</Trans>
              </Typography>
              <Button
                size="small"
                loading={loadingDeleteShare}
                onClick={onDeleteShare}
                disabled={loadingDeleteShare}
              >
                <Trans>Forget this browser</Trans>
              </Button>
            </div>
          }
        </div>
      </div>
    </ExpansionPanel>
  )
}

export default BrowserPanel