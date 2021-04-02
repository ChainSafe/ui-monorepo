import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Typography } from "@chainsafe/common-components"
import DesktopMobilePNG from "../../../Media/landing/layers/desktop-mobile.png"
import PasswordKeyPNG from "../../../Media/landing/layers/password-key.png"
import PeacefulSuccotashPNG from "../../../Media/landing/layers/peaceful-succotash.png"
import { t, Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"
import clsx from "clsx"

// Concise explainer is used in both initialize and migrate account
const useStyles = makeStyles(
  ({ constants, breakpoints, typography }: CSFTheme) =>
    createStyles({
      root: {
        padding: `${constants.generalUnit * 6}px ${constants.generalUnit * 4}px`,
        backgroundColor: `${constants.loginModule.explainerBg} !important`,
        width: 480,
        [breakpoints.down("md")]: {
          padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`,
          width: "100vw",
          heighteight: "100vh",
          borderRadius: 0
        }
      },
      title: {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2.5,
        [breakpoints.down("md")]: {
          ...typography.h4
        }
      },
      subtitle: {
        ...typography.body1,
        marginBottom: constants.generalUnit * 5,
        [breakpoints.down("md")]: {
          ...typography.body2
        }
      },
      graphicsContainer: {
        display: "flex",
        justifyContent: "space-between",
        [breakpoints.down("md")]: {
          flexDirection: "column"
        }
      },
      imageBox: {
        padding: constants.generalUnit * 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        [breakpoints.up("md")]: {
          textAlign: "center",
          maxWidth: `calc(33% - ${constants.generalUnit})`
        },
        [breakpoints.down("md")]: {
          flexDirection: "row",
          justifyContent: "space-between"
        },
        "& img": {
          maxHeight: 64,
          display: "block",
          marginBottom: constants.generalUnit * 2
        },
        "& p":{
          ...typography.body1,
          [breakpoints.down("md")]: {
            ...typography.body2,
            width: `calc(100% - ${100 + (constants.generalUnit * 1.5)}px)`
          }
        }
      },
      learnMore: {
        marginTop: constants.generalUnit * 4,
        ...typography.body1,
        [breakpoints.down("md")]: {
          ...typography.body2
        }
      },
      buttonContainer: {
        marginTop: constants.generalUnit * 4,
        display: "flex",
        justifyContent: "flex-end",
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit * 3,
          flexDirection: "row",
          justifyContent: "center"
        }
      },
      doItButton: {
        minWidth: 120,
        [breakpoints.down("md")]: {
          minWidth: "100%"
        }
      }
    })
)

interface IConciseExplainerProps {
  screen: "initialize" | "migrate"
  onLetsDoIt(): void
  className?: string
}

const ConciseExplainer: React.FC<IConciseExplainerProps> = ({ className, screen, onLetsDoIt }) => {
  const classes = useStyles()

  const { desktop } = useThemeSwitcher()

  return (
    <div className={clsx(className, classes.root)}>
      <div>
        <Typography variant="h2" component="h2" className={classes.title}>
          <Trans>Introducing multi-factor sign in</Trans>
        </Typography>
        <Typography component="p" className={classes.subtitle}>
          {screen === "initialize"
            ? t`Welcome! Here at Files we don’t require emails and phone numbers to set up an account. `
            : t`Previously, you required a password to access your Files account. 
            We’re happy to announce that you don’t need a password to sign in anymore. 
            All you have to do is set up multiple sign-in methods.`
          }
          <br/>
          <br/>
          {screen === "initialize"
            ? t`Instead, we use multiple sign-in methods for security and account recovery purposes. 
            Each time you log in with your cryptowallet, Google, Facebook, or Github, 
            you’ll be asked for one of the sign-in methods below:`
            : t`Setting these up means you’ll be able to recover your account if you do get locked out somehow. 
            Here’s what you can do now:`
          }
        </Typography>
        <div className={classes.graphicsContainer}>
          <div className={classes.imageBox}>
            <img src={DesktopMobilePNG} alt="devices" />
            <Typography component="p">
              <Trans>Save the device</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img src={PasswordKeyPNG}  alt="password and keys" />
            <Typography component="p">
              <Trans>Add and change passwords</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img src={PeacefulSuccotashPNG} alt="peaceful succotash" />
            <Typography component="p">
              <Trans>Recover with passphrase</Trans>
            </Typography>
          </div>
        </div>
        {
          desktop && (
            <Typography component="p" className={classes.learnMore}>
              {screen === "initialize"
                ? (
                  <Trans>Setting up multiple sign-in methods makes signing in on multiple devices and restoring your account a breeze,
                  all done without us storing information about you. Think that’s cool?&nbsp;
                  <a href={ROUTE_LINKS.ApplyCryptography} target="_blank" rel="noopener noreferrer">
                    Learn how we apply cryptography to ensure the privacy of your data.
                  </a>
                  </Trans>
                ) :
                (
                  <Trans>
                    Check out&nbsp;
                    <a href={ROUTE_LINKS.ApplyCryptography} target="_blank" rel="noopener noreferrer">
                      how we apply cryptography
                    </a>&nbsp;
                    to ensure the privacy of your data.
                  </Trans>
                )
              }
            </Typography>
          )
        }
      </div>
      <div className={classes.buttonContainer}>
        <Button onClick={onLetsDoIt} className={classes.doItButton}>
          {desktop ? t`Let's do it` : t`Next`}
        </Button>
      </div>
    </div>
  )
}

export default ConciseExplainer
