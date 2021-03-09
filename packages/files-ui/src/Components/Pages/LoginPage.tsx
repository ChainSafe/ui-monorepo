import React from "react"
import {
  makeStyles,
  createStyles,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import InitializeAccount from "../Modules/LoginModule/InitializeAccount"
import SaveNewDevice from "../Modules/LoginModule/SaveNewDevice"
import MissingShares from "../Modules/LoginModule/MissingShares"
import { CSFTheme } from "../../Themes/types"
import Layer1DarkSVG from "../../Media/Layer1-darkmode.svg"
import Layer2DarkSVG from "../../Media/Layer2-darkmode.svg"
import Layer1LightSVG from "../../Media/Layer1-lightmode.svg"
import Layer2LightSVG from "../../Media/Layer2-lightmode.svg"
import InitialScreen from "../Modules/LoginModule/InitialScreen"
import { ChainsafeFilesLogo, Typography } from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, breakpoints, typography, zIndex }: CSFTheme) =>
    createStyles({
      root: {
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden"
      },
      layer1: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: zIndex?.background,
        maxHeight: `calc(100% - ${constants.generalUnit * 4}px)`
      },
      layer2: {
        position: "absolute",
        left: "50%",
        top: "calc(50% + 3vh)",
        transform: "translate(-50%, -50%)",
        zIndex: zIndex?.layer0,
        [breakpoints.up("md")]: {
          minHeight: "64vh",
          maxHeight: "90vh"
        },
        [breakpoints.down("md")]: {
          width: "120vw"
        }
      },
      title: {
        position: "absolute",
        top: constants.generalUnit * 5.25,
        left: "50%",
        transform: "translate(-50%, 0)",
        fontWeight: typography.fontWeight.regular,
        textAlign: "center",
        width: "100%",
        [breakpoints.up("md")]:{
          ...typography.h2
        },
        [breakpoints.down("md")]:{
          ...typography.h4
        }
      },
      cta: {
        position: "absolute",
        bottom: 0,
        right: 0,
        padding: `${constants.generalUnit * 2.5}px ${constants.generalUnit * 1.5}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        "& *:first-child": {
          marginBottom: constants.generalUnit
        },
        [breakpoints.down("md")]: {
          display: "none"
        }
      },
      inner: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: zIndex?.layer1
      }
    })
)

const LoginPage = () => {
  const classes = useStyles()
  const { themeKey } = useThemeSwitcher()

  const {
    keyDetails,
    isNewDevice,
    shouldInitializeAccount
  } = useThresholdKey()

  const shouldSaveNewDevice =
    !!keyDetails && keyDetails.requiredShares <= 0 && isNewDevice

  const areSharesMissing = !!keyDetails && keyDetails.requiredShares > 0

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        ChainSafe Files
      </Typography>
      {
        themeKey === "dark" ? 
          <>
            <Layer1DarkSVG className={classes.layer1} />
            <Layer2DarkSVG className={classes.layer2} />
          </>
          :
          <>
            <Layer1LightSVG className={classes.layer1} />
            <Layer2LightSVG className={classes.layer2} />
          </>
          
      }
      <a
        className={classes.cta}
        href={ROUTE_LINKS.ChainSafe}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ChainsafeFilesLogo />
        <Typography>
          <Trans>
            Learn more about ChainSafe
          </Trans>
        </Typography>
      </a>
      <div className={classes.inner}>
        {!keyDetails && <InitialScreen/>}
        {areSharesMissing && <MissingShares />}
        {shouldInitializeAccount && <InitializeAccount />}
        {shouldSaveNewDevice && <SaveNewDevice />}
      </div>
    </div>
  )
}

export default LoginPage
