import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(({ breakpoints, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      width: "100vw",
      [breakpoints.up("md")]:{
        maxWidth: 570,
        padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
      }
    },
    title: {
      fontWeight: typography.fontWeight.regular,
      [breakpoints.down("md")]: {
        textAlign: "center"
      }
    },
    warning: {
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit * 2.5,
        marginBottom: constants.generalUnit * 14.5
      },
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit * 2.5,
        marginBottom: constants.generalUnit * 5.5
      }
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& > *": {
        [breakpoints.up("md")]: {
          maxWidth: `calc(50% - ${constants.generalUnit}px)`
        },
        [breakpoints.down("md")]: {
          maxWidth: `calc(50% - ${constants.generalUnit / 2}px)`
        }
      },
      [breakpoints.down("md")]: {
        width: `calc(100% + ${constants.generalUnit * 2}px)`,
        position: "relative",
        left: -constants.generalUnit
      }
    }
  })
)

interface IConfirmSkip {
  cancel: () => void
  confirm: () => void
  className?: string
}

const ConfirmSkip: React.FC<IConfirmSkip> = ({
  cancel,
  confirm,
  className
}: IConfirmSkip) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.title} variant={desktop ? "h2" : "h4"} component="p">
        <Trans>
          Are you sure?
        </Trans>
      </Typography>

      <Typography className={classes.warning} component="p">
        <Trans>
          Without setting up at least three authentication factors,
          you risk getting locked out of your account.
          <br/><br/>Remember, you need a minimum of two factors to sign in.
          If you only have one, you’ll lose access to your account forever.
        </Trans>
      </Typography>

      <section className={classes.buttons}>
        <Button fullsize onClick={confirm} size="large" variant="outline">
          <Trans>
            Yes I understand
          </Trans>
        </Button>
        <Button fullsize onClick={cancel} size="large" variant="primary">
          <Trans>
            Set up sign in methods
          </Trans>
        </Button>
      </section>
    </div>
  )
}

export default ConfirmSkip
