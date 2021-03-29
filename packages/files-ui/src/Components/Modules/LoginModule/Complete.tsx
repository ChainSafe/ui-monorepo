import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

interface IComplete {
  className?: string
}

const Complete: React.FC<IComplete> = ({
  className
}: IComplete) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
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
