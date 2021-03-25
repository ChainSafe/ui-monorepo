import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Typography } from "@chainsafe/common-components"
import DesktopMobilePNG from "../../../Media/landing/layers/desktop-mobile.png"
import PasswordKeyPNG from "../../../Media/landing/layers/password-key.png"
import PeacefulSuccotashPNG from "../../../Media/landing/layers/peaceful-succotash.png"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"

// Concise explainer is used in both initialize and migrate account
const useStyles = makeStyles(
  ({ constants, breakpoints, typography }: CSFTheme) =>
    createStyles({
      root: {
        padding: `${constants.generalUnit * 6}px ${constants.generalUnit * 4}px`,
        minHeight: "inherit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        [breakpoints.down("md")]: {
          padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`
        }
      },
      title: {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          ...typography.h4
        }
      },
      subtitle: {
        ...typography.body1,
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
        [breakpoints.up("md")]: {
          textAlign: "center"
        },
        [breakpoints.down("md")]: {
          flexDirection: "row"
        },
        "& img": {
          maxHeight: 64,
          marginRight: constants.generalUnit * 3
        }
      },
      buttonContainer: {
        paddingTop: constants.generalUnit * 3,
        display: "flex",
        justifyContent: "flex-end",
        [breakpoints.down("md")]: {
          paddingTop: constants.generalUnit * 3,
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
}

const ConciseExplainer: React.FC<IConciseExplainerProps> = ({ screen, onLetsDoIt }) => {
  const classes = useStyles()

  const { desktop } = useThemeSwitcher()

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h2" component="h2" className={classes.title}>
          <Trans>Introducing multi-factor sign in</Trans>
        </Typography>
        <Typography variant="body1" component="p" className={classes.subtitle}>
          <Trans>
            {screen === "initialize"
              ? "Welcome! Here at Files we don’t require emails and phone numbers to set up an account. "
              : `Previously, you required a password to access your Files account. 
            We’re happy to announce that you don’t need a password to sign in anymore. 
            All you have to do is set up multiple sign-in methods.`
            }
          </Trans>
        </Typography>
        <br />
        <Typography variant="body1" component="p" className={classes.subtitle}>
          <Trans>
            {screen === "initialize"
              ? `Instead, we use multiple sign-in methods for security and account recovery purposes. 
            Each time you log in with your cryptowallet, Google, Facebook, or Github, 
            you’ll be asked for one of the sign-in methods below:`
              : `Setting these up means you’ll be able to recover your account if you do get locked out somehow. 
            Here’s what you can do now:`
            }
          </Trans>
        </Typography>
        <br />
        <div className={classes.graphicsContainer}>
          <div className={classes.imageBox}>
            <img src={DesktopMobilePNG} alt="devices" />
            <br />
            <Typography variant="body1" component="p" className={classes.subtitle}>
              <Trans>Save the device</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img src={PasswordKeyPNG}  alt="password and keys" />
            <br />
            <Typography variant="body1" component="p" className={classes.subtitle}>
              <Trans>Add and change passwords</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img src={PeacefulSuccotashPNG} alt="peaceful succotash" />
            <br />
            <Typography variant="body1" component="p" className={classes.subtitle}>
              <Trans>Recover with passphrase</Trans>
            </Typography>
          </div>
        </div>
        <br />
        <Typography variant="body1" component="p" className={classes.subtitle}>
          {screen === "initialize"
            ? (
              <>
                <Trans>Setting up multiple sign-in methods makes signing in on multiple devices and restoring your account a breeze,
              all done without us storing information about you. Think that’s cool? </Trans>&nbsp;
                <a href={ROUTE_LINKS.ApplyCryptography}>
                  <Trans>Learn how we apply cryptography to ensure the privacy of your data.</Trans>
                </a>
              </>
            ) :
            (
              <>
                <Trans>Check out</Trans>
              &nbsp;<a href={ROUTE_LINKS.ApplyCryptography}><Trans>how we apply cryptography</Trans></a>&nbsp;
                <Trans>to ensure the privacy of your data.</Trans>
              </>
            )
          }
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        <Button onClick={onLetsDoIt} className={classes.doItButton}>
          <Trans>{desktop ? "Let's do it" : "Next"}</Trans>
        </Button>
      </div>
    </div>
  )
}

export default ConciseExplainer
