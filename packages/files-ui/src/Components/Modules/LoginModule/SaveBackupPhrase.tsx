import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CloseSvg, Typography } from "@chainsafe/common-components"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"
import { t, Trans } from "@lingui/macro"
import MnemonicForm from "../../Elements/MnemonicForm"

const useStyles = makeStyles(({ breakpoints, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      color: constants.loginModule.textColor,
      width: "100vw",
      "& h1": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit,
        color: constants.loginModule.textColor,
        [breakpoints.down("md")]: {
          textAlign: "center",
          marginBottom: constants.generalUnit * 2
        }
      },
      [breakpoints.up("md")]: {
        padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: constants.generalUnit * 2
      }
    },
    close: {
      position: "absolute",
      cursor: "pointer",
      "& svg": {
        width: 15,
        height: 15,
        stroke: constants.loginModule.textColor
      },
      [breakpoints.up("md")]: {
        top: constants.generalUnit * 3,
        right: constants.generalUnit * 3
      },
      [breakpoints.down("md")]: {
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5
      }
    }
  })
)

interface ISaveBackupPhrase {
  className?: string
  complete: () => void
  cancel: () => void
}

const SaveBackupPhrase = ({ className, complete, cancel }: ISaveBackupPhrase) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

  return (
    <div className={clsx(classes.root, className)}>
      <div onClick={cancel} className={clsx(classes.close, "close")}>
        <CloseSvg />
      </div>
      <Typography component="h1" variant={desktop ? "h2" : "h4"}>
        <Trans>
          Generate backup phrase
        </Trans>
      </Typography>
      <Typography component="p">
        <Trans>
          A backup phrase will be generated and used for your account.<br/>
          We do not store it and <b>it can only be displayed once</b>. Save it somewhere safe!
        </Trans>
      </Typography>
      <MnemonicForm
        onComplete={complete}
        buttonLabel={t`Continue`}
      />
    </div>
  )
}

export default SaveBackupPhrase
