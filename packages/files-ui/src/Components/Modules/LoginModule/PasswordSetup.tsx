import React from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Typography, CloseSvg } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import PasswordForm from "../../Elements/PasswordForm"

const useStyles = makeStyles(({  breakpoints, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      width: "100vw",
      [breakpoints.up("md")]: {
        padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`
      },
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2
      },
      "& h2": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit * 1.5,
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      }
    },
    close: {
      position: "absolute",
      cursor: "pointer",
      "& svg": {
        width: 15,
        height: 15,
        stroke: constants.loginModule.textColor
      },
      [breakpoints.up("md")]: {
        top: constants.generalUnit * 3,
        right: constants.generalUnit * 3
      },
      [breakpoints.down("md")]: {
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5
      }
    }
  })
)

interface IPasswordSetup {
  className?: string
  setPassword: (password: string) => Promise<void>
  cancel: () => void
}

const PasswordSetup = ({ setPassword, className, cancel }: IPasswordSetup) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

  return (
    <section className={clsx(classes.root, className)}>
      <div
        onClick={cancel}
        className={classes.close}
      >
        <CloseSvg />
      </div>
      <Typography
        variant={desktop ? "h2" : "h4"}
        component="h2"
      >
        <Trans>
          Set up a password
        </Trans>
      </Typography>
      {
        desktop && (
          <Typography component="p">
            <Trans>
              You can change this later.
            </Trans>
          </Typography>
        )
      }
      <PasswordForm setPassword={setPassword}/>
    </section>
  )
}

export default PasswordSetup
