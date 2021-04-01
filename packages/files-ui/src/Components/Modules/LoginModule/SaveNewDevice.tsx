import React, { useCallback, useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) =>
  createStyles({
    root: {
      padding: `0 ${constants.generalUnit * 4}px`,
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      [breakpoints.up("md")]: {
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 3}px`
      }
    },
    buttonSection: {
      [breakpoints.up("md")]: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      },
      [breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly"
      }
    },
    button: {
      width: 240,
      marginBottom: constants.generalUnit * 2,
      [breakpoints.up("md")]: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main
      },
      [breakpoints.down("md")]: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main
      }
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: constants.generalUnit * 4,
      marginBottom: constants.generalUnit * 4
    },
    headerText: {
      textAlign: "center",
      [breakpoints.up("md")]: {
        paddingTop: constants.generalUnit * 4,
        paddingBottom: constants.generalUnit * 8
      },
      [breakpoints.down("md")]: {
        paddingTop: constants.generalUnit * 3,
        paddingBottom: constants.generalUnit * 3,
        textAlign: "center"
      }
    },
    text: {
      display: "inline-block",
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4,
      textAlign: "center",
      [breakpoints.down("md")]: {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  })
)

const SaveNewDevice = ({className}: {className: string}) => {
  const { addNewDeviceShareAndSave, resetIsNewDevice } = useThresholdKey()
  const [isAccepted, setIsAccepted] = useState(false)
  const [isDenied, setIsDenied] = useState(false)
  const classes = useStyles()


  const onSave = useCallback(() => {
    setIsAccepted(true)
    addNewDeviceShareAndSave()
      .catch(console.error)
  }, [addNewDeviceShareAndSave])

  const onDeny = useCallback(() => {
    resetIsNewDevice()
    setIsDenied(true)
  }, [resetIsNewDevice])

  return (
    <section className={clsx(classes.root, className)}>
      <Typography
        variant="h6"
        component="h1"
        className={classes.headerText}
      >
        <Trans>Nice to see you again!</Trans>
      </Typography>
      <Typography className={classes.text}>
        <Trans>Save this browser for next time?</Trans>
      </Typography>
      <div className={classes.buttonWrapper}>
        <Button
          className={classes.button}
          variant="primary"
          size="large"
          onClick={onSave}
          loading={isAccepted}
          disabled={isAccepted || isDenied}
        >
          <Trans>Yes, save it</Trans>
        </Button>
        <Button
          className={classes.button}
          variant="outline"
          size="large"
          onClick={onDeny}
          loading={isDenied}
          disabled={isAccepted || isDenied}
        >
          <Trans>No thanks</Trans>
        </Button>
      </div>
    </section>
  )
}

export default SaveNewDevice
