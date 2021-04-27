import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Typography } from "@chainsafe/common-components"
import DesktopMobilePNG from "../../../Media/landing/layers/desktop-mobile.png"
import PasswordKeyPNG from "../../../Media/landing/layers/password-key.png"
import PeacefulSuccotashPNG from "../../../Media/landing/layers/peaceful-succotash.png"
import { Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ constants, breakpoints, typography }: CSFTheme) =>
    createStyles({
      root: {
        backgroundColor: `${constants.loginModule.explainerBg} !important`,
        width: "100vw",
        [breakpoints.up("md")]: {
          padding: `${constants.generalUnit * 6}px ${constants.generalUnit * 5}px`,
          maxWidth: 670
        },
        [breakpoints.down("md")]: {
          padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`,
          height: "100vh",
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
        [breakpoints.up("md")]: {
          margin: `${constants.generalUnit * 7}px 0 ${constants.generalUnit * 6}px`
        },
        [breakpoints.down("md")]: {
          flexDirection: "column"
        }
      },
      imageBox: {
        padding: constants.generalUnit,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        [breakpoints.up("md")]: {
          textAlign: "center",
          maxWidth: `calc(33% - ${constants.generalUnit}px)`
        },
        [breakpoints.down("md")]: {
          flexDirection: "row",
          justifyContent: "space-between"
        },
        "& img": {
          display: "block",
          marginBottom: constants.generalUnit * 2,
          [breakpoints.up("md")]: {
            maxWidth: "80%"
          },
          [breakpoints.down("md")]: {
            maxHeight: 64
          }
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
      continue: {
        minWidth: 120,
        [breakpoints.down("md")]: {
          minWidth: "100%"
        }
      }
    })
)

interface IConciseExplainerProps {
  onContinue(): void
  className?: string
}

const ConciseExplainer: React.FC<IConciseExplainerProps> = ({ className, onContinue }) => {
  const classes = useStyles()

  return (
    <div className={clsx(className, classes.root)}>
      <div>
        <Typography
          variant="h2"
          component="h2"
          className={classes.title}
        >
          <Trans>Let&apos;s get you set up.</Trans>
        </Typography>
        <Typography
          component="p"
          className={classes.subtitle}
        >
          <Trans>
            For security reasons, each time you sign in we’ll ask you for one of the following to confirm your identity.
          </Trans>
          &nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://chainsafe.io/"
          >
            <Trans>
              Learn more
            </Trans>
          </a>
        </Typography>
        <div className={classes.graphicsContainer}>
          <div className={classes.imageBox}>
            <img
              src={DesktopMobilePNG}
              alt="devices"
            />
            <Typography component="p">
              <Trans>Use a saved browser</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img
              src={PasswordKeyPNG}
              alt="password and keys"
            />
            <Typography component="p">
              <Trans>Enter password</Trans>
            </Typography>
          </div>
          <div className={classes.imageBox}>
            <img
              src={PeacefulSuccotashPNG}
              alt="peaceful succotash"
            />
            <Typography component="p">
              <Trans>Recover with passphrase</Trans>
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="primary"
          onClick={onContinue}
          className={classes.continue}
        >
          <Trans>
            Continue
          </Trans>
        </Button>
      </div>
    </div>
  )
}

export default ConciseExplainer
