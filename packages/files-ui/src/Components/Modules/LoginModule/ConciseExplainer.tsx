import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Typography } from "@chainsafe/common-components"
import DesktopMobileSVG from "../../../Media/landing/layers/light/DesktopMobile.svg"
import PasswordKeySVG from "../../../Media/landing/layers/light/PasswordKey.svg"
import PeacefulSuccotashSVG from "../../../Media/landing/layers/light/PeacefulSuccotash.svg"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) =>
    createStyles({
      root: {
        padding: `${constants.generalUnit * 6}px ${constants.generalUnit * 4}px`,
        backgroundColor: palette.common.white.main,
        boxShadow: constants.landing.boxShadow,
        width: 500
      },
      title: {
        fontWeight: 400
      },
      svgContainer: {
        display: "flex",
        justifyContent: "space-between"
      },
      svgBox: {
        padding: constants.generalUnit * 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      },
      buttonContainer: {
        paddingTop: constants.generalUnit * 3,
        display: "flex",
        justifyContent: "flex-end"
      },
      doItButton: {
        minWidth: 120
      }
    })
)

interface IConciseExplainerProps {
  screen: "initialize" | "migrate"
  onLetsDoIt(): void
}

const ConciseExplainer: React.FC<IConciseExplainerProps> = ({ screen, onLetsDoIt }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h2" component="h2" className={classes.title}>
        <Trans>Introducing multi-factor sign in</Trans>
      </Typography>
      <br />
      <Typography variant="body1" component="p">
        {screen === "initialize" 
          ? "Welcome! Here at Files we don’t require emails and phone numbers to set up an account. " 
          : `Previously, you required a password to access your Files account. 
            We’re happy to announce that you don’t need a password to sign in anymore. 
            All you have to do is set up multiple sign-in methods.`
        }
      </Typography>
      <br />
      <Typography variant="body1" component="p">
        {screen === "initialize" 
          ? `Instead, we use multiple sign-in methods for security and account recovery purposes. 
            Each time you log in with your cryptowallet, Google, Facebook, or Github, 
            you’ll be asked for one of the sign-in methods below:` 
          : `Setting these up means you’ll be able to recover your account if you do get locked out somehow. 
            Here’s what you can do now:`
        }
        
      </Typography>
      <br />
      <div className={classes.svgContainer}>
        <div className={classes.svgBox}>
          <DesktopMobileSVG />
          <br />
          <Typography>
            Save the device
          </Typography>
        </div>
        <div className={classes.svgBox}>
          <PasswordKeySVG />
          <br />
          <Typography>
            Add and change passwords
          </Typography>
        </div>
        <div className={classes.svgBox}>
          <PeacefulSuccotashSVG />
          <br />
          <Typography>
            Recover with passphrase
          </Typography>
        </div>
      </div>
      <br />
      <Typography variant="body1" component="p">
        {screen === "initialize" 
          ? (
            <>
              <Trans>Setting up multiple sign-in methods makes signing in on multiple devices and restoring your account a breeze, 
              all done without us storing information about you. Think that’s cool? </Trans>&nbsp;
              <a href={ROUTE_LINKS.ApplyCryptography}><Trans>Learn how we apply cryptography to ensure the privacy of your data.</Trans></a>
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
      <div className={classes.buttonContainer}>
        <Button onClick={onLetsDoIt} className={classes.doItButton}>
          <Trans>Let&apos;s do it</Trans>
        </Button>
      </div>
    </div>
  )
}

export default ConciseExplainer
