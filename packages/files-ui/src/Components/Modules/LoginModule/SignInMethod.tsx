import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

const SignInMethods: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="p">
        <Trans>
          Sign-in Methods
        </Trans>
      </Typography>

      <Typography component="p">
        <Trans>
          Sign-in Methods
        </Trans>
      </Typography>
      <Typography component="p">
        <Trans>
          We seriously advise that you add a third method. If you lose one of the two sign-in methods, 
          you’ll lose access to your account forever. Plus, signing in on multiple devices will be easier.  
        </Trans>
      </Typography>

      <Typography component="p">
        <Trans>
          Remind me later
        </Trans>
      </Typography>
    </div>
  )
}

export default SignInMethods
