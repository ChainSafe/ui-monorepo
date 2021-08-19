import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { TransferProgress } from "../../../Contexts/FilesContext"
import { ProgressBar, Typography, CheckCircleIcon, CloseCircleIcon } from "@chainsafe/common-components"
import clsx from "clsx"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(
  ({ constants, palette, animation, breakpoints }: CSFTheme) => {
    return createStyles({
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
        padding: constants.generalUnit * 2,
        borderRadius: 4,
        [breakpoints.down("md")]: {
          margin: 0
        }
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
        alignItems: "center",
        "& svg": {
          fill: constants.uploadAlert.icon
        }
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

interface ITransferToast {
  transferInProgress: TransferProgress
}

const TransferToast: React.FC<ITransferToast> = ({ transferInProgress }) => {
  const {
    complete,
    error,
    progress,
    errorMessage,
    operation
  } = transferInProgress
  const classes = useStyles()

  return (
    <>
      <div
        className={clsx(classes.appearBox, classes.boxContainer)}
        data-cy="transfer-status-toast-message"
      >
        { !!error && (<div className={classes.contentContainer}>
          <CloseCircleIcon className={classes.marginRight} />
          <Typography
            variant="body1"
            component="p"
          >
            {errorMessage}
          </Typography>
        </div>) }
        { !complete && !error && (<div>
          <Typography
            variant="body2"
            component="p"
            className={classes.marginBottom}
          >
            <Trans>
                Sharing your file ({operation === "Download" ? t`Downloading` : t`Encrypting & uploading` })
            </Trans>
          </Typography>
          <ProgressBar
            progress={progress}
            size="small"
          />
        </div>) }
        { complete && !error && (<div className={classes.contentContainer}>
          <CheckCircleIcon className={classes.marginRight} />
          <Typography
            variant="body1"
            component="p"
          >
            <Trans>Transfer complete</Trans>
          </Typography>
        </div>) }
      </div>
    </>
  )
}

export default TransferToast
