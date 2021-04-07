import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, CheckSvg, CloseSvg, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"
import CompleteSVG from "../../../Media/svgs/complete.svg"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"

const useStyles = makeStyles(({ breakpoints, constants, palette, zIndex }: CSFTheme) =>
  createStyles({
    root:{
      backgroundColor: `${constants.loginModule.completeBg} !important`,
      color: constants.loginModule.completeText,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      justifyContent: "center !important",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      [breakpoints.up("md")]: {
        maxWidth: 550,
        maxHeight: 640
      },
      "& p": {
        margin: `${constants.generalUnit * 1.5}px 0`
      },
      "& h2": {
        textAlign: "center"
      }
    },
    background: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: zIndex?.background
    },
    option: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${constants.generalUnit}px ${constants.generalUnit * 3}px`,
      "& svg": {
        height: 15,
        width: 15,
        marginLeft: constants.generalUnit * 3,
        marginRight: 2.5,
        stroke: palette.error.main,
        fill: palette.error.main
      },
      "&.active svg": {
        height: 20,
        width: 20,
        marginRight: 0,
        fill: palette.success.main,
        stroke: palette.success.main,
        marginLeft: constants.generalUnit * 3
      }
    },
    cta: {
      marginTop : constants.generalUnit * 3,
      maxWidth: 270,
      color: constants.loginModule.completeBg,
      backgroundColor: constants.loginModule.completeText,
      "&:hover": {
        backgroundColor: palette.success.main,
        color: constants.loginModule.completeBg
      }
    }
  })
)

interface IComplete {
  className?: string
}

const Complete = ({ className }: IComplete) => {
  const classes = useStyles()
  const { userInfo, resetShouldInitialize, hasPasswordShare, hasMnemonicShare, browserShares } = useThresholdKey()

  const hasSocial = !!userInfo?.userInfo

  return (
    <div className={clsx(className, classes.root)}>
      <img className={classes.background} src={CompleteSVG} alt="complete slide background" />
      <Typography variant="h2" component="h2">
        <Trans>
          Great! You’re all done.
        </Trans>
      </Typography>
      <Typography component="p" variant="body2">
        <Trans>
          Thanks for taking care of that. You can <br/> adjust these anytime in security settings.
        </Trans>
      </Typography>
      <section>
        <div className={clsx(
          classes.option, {
            "active": hasSocial
          }
        )}>
          <Typography>
            <Trans>
              Social sign in or wallet
            </Trans>
          </Typography>
          {
            hasSocial ? (
              <CheckSvg />
            ) : (
              <CloseSvg />
            )
          }
        </div>
        <div className={clsx(
          classes.option, {
            "active": browserShares.length > 0
          }
        )}>
          <Typography>
            <Trans>
              Saved browser
            </Trans>
          </Typography>
          {
            browserShares.length > 0 ? (
              <CheckSvg />
            ) : (
              <CloseSvg />
            )
          }
        </div>
        <div className={clsx(
          classes.option, {
            "active": hasPasswordShare
          }
        )}>
          <Typography>
            <Trans>
              Password setup
            </Trans>
          </Typography>
          {
            hasPasswordShare ? (
              <CheckSvg />
            ) : (
              <CloseSvg />
            )
          }
        </div>
        <div className={clsx(
          classes.option, {
            "active": hasMnemonicShare
          }
        )}>
          <Typography>
            <Trans>
              Backup phrase
            </Trans>
          </Typography>
          {
            hasMnemonicShare ? (
              <CheckSvg />
            ) : (
              <CloseSvg />
            )
          }
        </div>
      </section>
      <Button onClick={() => resetShouldInitialize()} size="large" fullsize className={classes.cta} variant="primary">
        <Trans>
          Continue
        </Trans>
      </Button>
    </div>
  )
}

export default Complete
