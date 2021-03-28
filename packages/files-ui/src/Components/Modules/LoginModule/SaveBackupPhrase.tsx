import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

const ConfirmSkip: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="h1">
        Save backup phrase
      </Typography>
      <Typography component="p">
        We can only show you the backup phrase once because it’s generated and isn’t stored on our servers. Please save it somewhere safe!
      </Typography>

      <Button>
        Continue
      </Button>
    </div>
  )
}

export default ConfirmSkip
