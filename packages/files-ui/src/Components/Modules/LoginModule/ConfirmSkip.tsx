import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(({
  constants,
  typography
}: CSFTheme) =>
  createStyles({
    root: {
      padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
      width: "100vw",
      maxWidth: 570
    },
    title: {
      fontWeight: typography.fontWeight.regular
    },
    warning: {
      marginTop: constants.generalUnit * 2.5,
      marginBottom: constants.generalUnit * 14.5
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& > *": {
        maxWidth: `calc(50% - ${constants.generalUnit}px)`
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

  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.title} variant="h2" component="p">
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
