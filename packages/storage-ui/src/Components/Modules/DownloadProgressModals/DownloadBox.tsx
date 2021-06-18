import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { DownloadProgress } from "../../../Contexts/StorageContext"
import {
  ProgressBar,
  Typography,
  CheckCircleIcon,
  CloseCircleIcon
} from "@chainsafe/common-components"
import clsx from "clsx"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, palette, animation, breakpoints }: ITheme) => {
    return createStyles({
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
        padding: constants.generalUnit * 2,
        borderRadius: 4
      },
      appearBox: {
        animation: `$slideLeft ${animation.translate}ms`,
        [breakpoints.down("md")]: {
          animation: `$slideUp ${animation.translate}ms`
        }
      },
      "@keyframes slideLeft": {
        from: { transform: "translate(100%)" },
        to: { transform: "translate(0)" }
      },
      "@keyframes slideUp": {
        from: { transform: "translate(0, 100%)" },
        to: { transform: "translate(0, 0)" }
      },
      contentContainer: {
        display: "flex",
        alignItems: "center"
      },
      marginBottom: {
        marginBottom: constants.generalUnit
      },
      marginRight: {
        marginRight: constants.generalUnit * 2
      }
    })
  }
)

interface IDownloadBox {
  downloadInProgress: DownloadProgress
}

const DownloadBox: React.FC<IDownloadBox> = ({ downloadInProgress }) => {
  const {
    fileName,
    complete,
    error,
    progress,
    errorMessage
  } = downloadInProgress
  const classes = useStyles()

  return (
    <>
      <div className={clsx(classes.appearBox, classes.boxContainer)}>
        {
          complete
            ? <div className={classes.contentContainer}>
              <CheckCircleIcon className={classes.marginRight} />
              <Typography
                variant="body1"
                component="p"
              >
                <Trans>Download complete</Trans>
              </Typography>
            </div>
            : error
              ? <div className={classes.contentContainer}>
                <CloseCircleIcon className={classes.marginRight} />
                <Typography
                  variant="body1"
                  component="p"
                >
                  {errorMessage}
                </Typography>
              </div>
              : <div>
                <Typography
                  variant="body2"
                  component="p"
                  className={classes.marginBottom}
                >
                  <Trans>Downloading {fileName}...</Trans>
                </Typography>
                <ProgressBar
                  progress={progress}
                  size="small"
                />
              </div>
        }
}

export default DownloadBox
