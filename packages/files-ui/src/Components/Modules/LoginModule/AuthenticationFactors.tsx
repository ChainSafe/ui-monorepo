import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CheckCircleSvg, CrossOutlinedSvg, Typography, WarningSvg } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(({ breakpoints, constants, typography, palette, zIndex }: CSFTheme) =>
  createStyles({
    root:{
      zIndex: zIndex?.layer1,
      backgroundColor: constants.loginModule.background,
      color: constants.loginModule.textColor,
      width: "100vw",
      [breakpoints.up("md")]: {
        maxWidth: 580,
        minHeight: "64vh",
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
      borderRadius: 4,
      marginTop: constants.generalUnit * 1.5,
      "&.clickable": {
        cursor: "pointer"
      },
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
        marginLeft: constants.generalUnit * 1
      }
    },
    checkIcon: {
      stroke: palette.additional.green[6],
      fill: palette.additional.green[6]
    },
    errorIcon: {
      stroke: palette.error.main,
      fill: palette.error.main,
      marginLeft: constants.generalUnit * 1
    },
    subText: {
      color: constants.loginModule.subText,
      display: "block",
      marginTop: constants.generalUnit * 2,
      "& a": {
        color: constants.loginModule.subText
      }
    },
    ctaText: {
      fontWeight: typography.fontWeight.bold,
      textDecoration: "underline",
      [breakpoints.down("md")]: {
        display: "block",
        marginTop: constants.generalUnit * 2
      }
    },
    continue: {
      display: "block",
      textAlign: "right",
      textDecoration: "underline",
      cursor: "pointer",
      color: palette.additional.gray[6],
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit * 6
      },
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit * 3
      }
    }
  })
)

interface IAuthenticationFactors {
  goToPassword: () => void
  goToMnemonic: () => void
  goToSkip: () => void
  goToComplete: () => void
  className?: string
}

const AuthenticationFactors = ({ goToComplete, goToMnemonic, goToPassword, goToSkip, className }: IAuthenticationFactors) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { keyDetails, loggedinAs, hasMnemonicShare, hasPasswordShare, browserShares } = useThresholdKey()

  return (
    <div className={clsx(classes.root, className)}>
      <Typography variant={desktop ? "h2" : "h4"} component="h1">
        <Trans>
          Your Authentication Factors
        </Trans>
      </Typography>

      {
        !!loggedinAs && (
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                <Trans>
                  Social Sign-in or Wallet
                </Trans>
              </Typography>
              {
                desktop && (
                  <Typography variant="h5">
                    { loggedinAs }
                  </Typography>
                )
              }
              <CheckCircleSvg className={classes.checkIcon} />
            </div>
          </section>
        )
      }

      <section className={clsx(
        classes.setOption, {
          "error": browserShares.length === 0
        }
      )}>
        <div>
          {browserShares.length > 0 && <Typography variant="h5">
            <Trans>
              Saved Browser
            </Trans>
          </Typography>}
          {
            desktop && (
              <Typography variant="h5">
                <Trans>Saved</Trans>{" "}
                {browserShares.length > 0 && `${browserShares[0].browser.name} ${browserShares[0].browser.version}`}
              </Typography>
            )
          }
          {browserShares.length > 0 ?
            <CheckCircleSvg className={classes.checkIcon} /> :
            <CrossOutlinedSvg className={classes.errorIcon} />
          }
        </div>
        {
          desktop && (
            <Typography className={classes.subText}>
              <Trans>Files uses device backups to save your browser.</Trans>{" "}
              <a href={ROUTE_LINKS.Terms} rel="noopener noreferrer" target="_blank"><Trans>Learn more</Trans></a>
            </Typography>
          )
        }
      </section>
      <section onClick={() => !hasPasswordShare ? goToPassword() : null} className={clsx(classes.setOption, {
        "clickable": !hasPasswordShare
      })}>
        <div>
          <Typography variant="h5">
            <Trans>
              Password
            </Trans>
          </Typography>
          {
            !hasPasswordShare ? (
              <>
                {
                  desktop && (
                    <Typography className={classes.ctaText} variant="h5">
                      <Trans>
                        Set it up now
                      </Trans>
                    </Typography>
                  )
                }
                <WarningSvg />
              </>
            ) : (
              <CheckCircleSvg className={classes.checkIcon} />
            )
          }
        </div>
        {
          !desktop && (
            <Typography className={classes.ctaText} variant="h5">
              <Trans>
                Set it up now
              </Trans>
            </Typography>
          )
        }
      </section>
      <section onClick={() => !hasMnemonicShare ? goToMnemonic() : null}className={clsx(classes.setOption, {
        "clickable": !hasMnemonicShare
      })}>
        <div>
          <Typography variant="h5">
            <Trans>
              Backup phrase
            </Trans>
          </Typography>
          {
            !hasMnemonicShare ? (
              <>
                {
                  desktop && (
                    <Typography className={classes.ctaText} variant="h5">
                      <Trans>
                        Set it up now
                      </Trans>
                    </Typography>
                  )
                }
                <WarningSvg />
              </>
            ) : (
              <CheckCircleSvg className={classes.checkIcon} />
            )
          }
        </div>
        {
          !desktop && (
            <Typography className={classes.ctaText} variant="h5">
              <Trans>
                Set it up now
              </Trans>
            </Typography>
          )
        }
      </section>
      {
        keyDetails && (
          keyDetails.totalShares > keyDetails.threshold ? (
            <Typography className={classes.continue} onClick={goToComplete} component="p">
              <Trans>
                Complete
              </Trans>
            </Typography>
          ) : (
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

export default AuthenticationFactors
