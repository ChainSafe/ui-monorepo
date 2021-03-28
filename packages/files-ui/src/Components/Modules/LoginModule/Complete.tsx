import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

const Complete: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="p">
        <Trans>
          Great! You’re all done.
        </Trans>
      </Typography>
      <Typography component="p">
        <Trans>
          Thanks for taking care of that. You can adjust these anytime in security settings.
        </Trans>
      </Typography>

      <Button>
        <Trans>
          Continue
        </Trans>
      </Button>
    </div>
  )
}

export default Complete
