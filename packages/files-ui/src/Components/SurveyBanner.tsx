import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { CrossIcon, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import React, { useCallback } from "react"
import { CSFTheme } from "../Themes/types"
import { ROUTE_LINKS } from "./FilesRoutes"

const SURVEY_VERSION = 3
export const DISMISSED_SURVEY_KEY = `csf.dismissedSurveyBannerV${SURVEY_VERSION}`

const useStyles = makeStyles(
  ({ constants }: CSFTheme) => {
    return createStyles({
      root: {
        background: "linear-gradient(90deg, rgba(81,101,220,1) 0%, rgba(3,150,166,1) 68%, rgba(255, 167, 51,1) 100%);",
        padding: constants.generalUnit,
        paddingLeft: constants.generalUnit * 2,
        marginTop: constants.generalUnit,
        borderRadius: 2,
        display: "flex",
        alignItems: "center"
      },
      banner: {
        color: constants.surveyBanner.color,
        fontWeight: 600,
        paddingRight: constants.generalUnit
      },
      link: {
        marginLeft: constants.generalUnit * 2,
        color: constants.surveyBanner.color,
        cursor: "pointer",
        outline: "none",
        textDecoration: "underline"
      },
      crossIconButton: {
        cursor: "pointer",
        height: constants.generalUnit * 2
      },
      spacer: {
        flex: 1
      },
      icon: {
        fontSize: 12,
        "& svg": {
          fill: constants.surveyBanner.color
        }
      }
    })
  })

interface Props {
    onHide: () => void
}

const SurveyBanner = ({ onHide }: Props) => {
  const classes = useStyles()
  const { localStorageSet } = useLocalStorage()

  const onClose = useCallback(() => {
    onHide()
    localStorageSet(DISMISSED_SURVEY_KEY, "true")
  }, [localStorageSet, onHide])

  const onOpen = useCallback(() => {
    onClose()
    window.open(ROUTE_LINKS.UserSurvey, "_blank")
  }, [onClose])

  return (
    <div className={classes.root}>
      <Typography
        variant="body1"
        className={classes.banner}>
        <Trans>
          Want to help shape this product?
        </Trans>
        <span
          className={classes.link}
          onClick={onOpen}
        >
          <Trans>Schedule a 15 min call</Trans>
        </span>
      </Typography>
      <div className={classes.spacer}/>
      <div
        className={classes.crossIconButton}
        onClick={onClose}
      >
        <CrossIcon
          fontSize="small"
          className={classes.icon}
        />
      </div>
    </div>
  )}

export default SurveyBanner
