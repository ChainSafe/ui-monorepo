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
      <Typography variant="h2" component="p">
        <Trans>
          Are you sure?
        </Trans>
      </Typography>

      <section>
        <Button onClick={confirm} size="large" variant="outline">
          Yes I understand
        </Button>
        <Button onClick={cancel} size="large" variant="primary">
          Set up sign in methods
        </Button>
      </section>
    </div>
  )
}

export default ConfirmSkip
