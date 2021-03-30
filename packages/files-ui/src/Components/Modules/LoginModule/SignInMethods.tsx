import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CheckCircleSvg, CopySvg, KeySvg, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { centerEllipsis } from "../../../Utils/Helpers"
import { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import { CSFTheme } from "../../../Themes/types"
import bowser from "bowser"
import clsx from "clsx"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(({
  breakpoints,
  constants,
  typography,
  palette,
  zIndex
}: CSFTheme) =>
  createStyles({
    root:{
      zIndex: zIndex?.layer1,
      backgroundColor: constants.loginModule.background,
      color: constants.loginModule.textColor,
      width: "100vw",
      [breakpoints.up("md")]: {
        maxWidth: 580,
        padding: `${constants.generalUnit * 6.5}px ${constants.generalUnit * 5}px`
      },
      [breakpoints.down("md")]: {
        height: "100vh",
        padding: `${constants.generalUnit * 2.5}px ${constants.generalUnit * 2}px`
      }
    },
    setOption: {
      width: "100%",
      backgroundColor: constants.loginModule.itemBackground,
      color: constants.loginModule.textColor,
      padding: constants.generalUnit * 1.5,
      borderRadius: 16,
      marginTop: constants.generalUnit * 1.5,
      "& > div": {
        display: "flex",
        alignItems: "center",
        "& > span": {
          display: "block",
          lineHeight: "16px",
          fontWeight: typography.fontWeight.regular,
          "&:first-child": {
            flex: "1 1 0"
          }
        }
      },
      "& svg": {
        width: 21,
        height: 21,
        marginLeft: constants.generalUnit * 1,
        stroke: palette.additional.green[6],
        fill: palette.additional.green[6]
      }
    },
    subText: {
      color: constants.loginModule.subText,
      display: "block",
      marginTop: constants.generalUnit * 2,
      "& a": {
        color: constants.loginModule.subText
      }
    },
    additionalMethods: {
      marginTop: constants.generalUnit * 7.5,
      marginBottom: constants.generalUnit * 3
    },
    availableOptions: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: constants.generalUnit * 6.5,
      marginBottom: constants.generalUnit * 6.5,
      [breakpoints.up("md")]: {
        flexDirection: "row"
      },
      [breakpoints.down("md")]: {
        flexDirection: "column"
      }
    },
    newOption: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 1.5}px`,
      width: "100%",
      color: constants.loginModule.subText,
      backgroundColor: constants.loginModule.itemBackground,
      borderRadius: 16,
      [breakpoints.up("md")]:{
        flexDirection: "column"
      },
      [breakpoints.down("md")]:{
        flexDirection: "row"
      },
      "& svg": {
        marginBottom: constants.generalUnit,
        [breakpoints.up("md")]:{
          height: 30,
          width: 30
        },
        [breakpoints.down("md")]:{
          height: 20,
          width: 20
        }
      },
      [breakpoints.up("md")]: {
        maxWidth: `calc(33% - ${constants.generalUnit * 1.5}px)`,
        marginRight: constants.generalUnit * 1.5
      }
    },
    key: {
      stroke: constants.loginModule.iconColor
    },
    copy: {
      fill: constants.loginModule.iconColor
    },
    continue: {
      textAlign: "right",
      textDecoration: "underline",
      cursor: "pointer"
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
  const { desktop } = useThemeSwitcher()
  const { 
    keyDetails, 
    publicKey
  } = useThresholdKey()
  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []
    
  const browserShare = 
    shares.filter((s) => s.module === "webStorage")


  const hasPasswordShare =
    shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0

  const hasMnemonicShare = keyDetails && (keyDetails.totalShares - shares.length > 1)


  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant={desktop ? "h2" : "h4"} component="h1">
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

      <section className={classes.setOption}>
        <div>
          <Typography variant="h5">
            Saved Browser
          </Typography>
          <Typography variant="h5">
            Saved {`${bowser.parse(browserShare[0].userAgent).browser.name} ${bowser.parse(browserShare[0].userAgent).browser.version}`}
          </Typography>
          <CheckCircleSvg />
        </div>
        <Typography className={classes.subText}>
          Files uses device backups to save your browser.{" "}
          <a href={ROUTE_LINKS.Terms} rel="noopener noreferrer" target="_blank">Learn more</a>
        </Typography>
      </section>

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
        (!hasMnemonicShare || !hasPasswordShare) && (
          <>
            <Typography className={classes.additionalMethods} variant="h2" component="p">
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
            <section className={classes.availableOptions}>
              {
                !hasPasswordShare && (
                  <div onClick={goToPassword} className={classes.newOption}>
                    <KeySvg className={classes.key} />
                    <Typography component="p">
                      Set up a password
                    </Typography>
                  </div>
                )
              }
              {
                !hasMnemonicShare && (
                  <div onClick={goToMnemonic} className={classes.newOption}>
                    <CopySvg className={classes.copy} />
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
                
            <Typography className={classes.continue} onClick={goToComplete} component="p">
              <Trans>
                Complete
              </Trans>
            </Typography>
          ): (
            <Typography className={classes.continue} onClick={goToSkip} component="p">
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
