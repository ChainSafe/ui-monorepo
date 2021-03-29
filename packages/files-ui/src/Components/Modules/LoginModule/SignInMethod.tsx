import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CheckCircleSvg, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { centerEllipsis } from "../../../Utils/Helpers"
import { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({
  breakpoints,
  constants,
  palette,
  zIndex
}: CSFTheme) =>
  createStyles({
    root:{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "1 1 0",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: zIndex?.layer1,
      backgroundColor: constants.loginModule.background,
      [breakpoints.up("md")]: {
        maxWidth: 580,
        width: "100vw"
      }
    },
    setOption: {
      width: "100%",
      backgroundColor: constants.loginModule.signinOptions.itemBackground,
      color: constants.loginModule.signinOptions.textColor,
      "& svg": {
        width: 21,
        height: 21,
        fill: palette.additional.green[6]
      }
    },
    newOption: {

    }
  })
)

interface ISignInMethods {
  goToPassword: () => void
  goToMnemonic: () => void
  goToSkip: () => void
  goToComplete: () => void
  className?: string
}

const SignInMethods: React.FC<ISignInMethods> = ({
  goToComplete,
  goToMnemonic,
  goToPassword,
  goToSkip,
  className
}: ISignInMethods) => {
  const classes = useStyles()
  const { 
    keyDetails, 
    publicKey

  } = useThresholdKey()
  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  const hasPasswordShare =
    shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0
  const hasMnemonicShare = keyDetails && (keyDetails.totalShares - shares.length > 1)

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant="h2" component="h1">
        <Trans>
          Sign-in Methods
        </Trans>
      </Typography>

      {
        publicKey && (
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                Social Sign-in Wallet
              </Typography>
              <Typography variant="h5">
                Logged in as {centerEllipsis(publicKey, 4)}
              </Typography>
              <CheckCircleSvg />
            </div>
          </section>
        )
      }

      {
        hasPasswordShare && (
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                Password set.
              </Typography>
              <CheckCircleSvg />
            </div>
          </section>
        )
      }

      {
        hasMnemonicShare && (
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                Backup phrase saved
              </Typography>
              <CheckCircleSvg />
            </div>
          </section>
        )
      }

      {
        hasMnemonicShare && (
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                Backup phrase saved
              </Typography>
              <CheckCircleSvg />
            </div>
          </section>
        )
      }

      <section className={classes.setOption}>
        <div>
          <Typography variant="h5">
            Saved Browser
          </Typography>
          <Typography variant="h5">
           Saved
          </Typography>
          <CheckCircleSvg />
        </div>
        <Typography>
          Files uses device backups to save your browser. <a href="" target="_blank">Why?</a>
        </Typography>
      </section>

      {
        (!hasMnemonicShare || !hasPasswordShare) && (
          <>
            <Typography variant="h2" component="p">
              <Trans>
                Add sign-in Methods
              </Trans>
            </Typography>
            <Typography component="p">
              <Trans>
                We seriously advise that you add a third method. If you lose one of the two sign-in methods, 
                you’ll lose access to your account forever. Plus, signing in on multiple devices will be easier.  
              </Trans>
            </Typography>
            <section>
              {
                !hasPasswordShare && (
                  <div onClick={goToPassword} className={classes.newOption}>

                    <Typography component="p">
                      Set up a password
                    </Typography>
                  </div>
                )
              }
              {
                !hasMnemonicShare && (
                  <div onClick={goToMnemonic} className={classes.newOption}>
                    <Typography component="p">
                      Copy backup phrase
                    </Typography>
                  </div>
                )
              }
            </section>
          </>
        )
      }
      {
        keyDetails && (
          keyDetails.totalShares > keyDetails.threshold ? (
                
            <Typography onClick={goToComplete} component="p">
              <Trans>
                Complete
              </Trans>
            </Typography>
          ): (
            <Typography onClick={goToSkip} component="p">
              <Trans>
                Remind me later 
              </Trans>
            </Typography>
          )
        )
      }
    </div>
  )
}

export default SignInMethods
